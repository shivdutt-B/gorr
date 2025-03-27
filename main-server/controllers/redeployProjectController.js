const { prisma } = require("../services/prismaService");
const { RunTaskCommand, StopTaskCommand } = require("@aws-sdk/client-ecs");
const { ecsClient, config } = require("../config/aws");
const { subscribeToLogs, publishLog } = require("../services/redisService");

const redeployProject = async (req, res) => {
  try {
    console.log("🚀 ~ redeployProject ~ req.body:", req.body);
    const userId = req.body.userId ? parseInt(req.body.userId) : undefined;
    const { gitURL, slug, rootDirectory, envVariables } = req.body;
    let taskArn = null;
    let responseWasSent = false;
    let existingProject = null;

    try {
      // Validate required parameters
      if (!slug) {
        return res.status(400).json({
          status: "error",
          message: "Project slug is required for redeployment",
        });
      }

      // Check if project exists in database
      existingProject = await prisma.project.findUnique({
        where: { slug: slug },
      });

      if (!existingProject) {
        return res.status(404).json({
          status: "error",
          message: "Project not found. Cannot redeploy a non-existent project.",
        });
      }

      // Verify user has permission to redeploy this project
      if (userId && existingProject.userId !== userId) {
        return res.status(403).json({
          status: "error",
          message: "You don't have permission to redeploy this project",
        });
      }

      // Publish initial log
      await publishLog(slug, {
        status: "QUEUED",
        message:
          "🔄 Redeployment has been added to the queue and will start soon",
        details: "Redeployment environment is being prepared",
        timestamp: new Date().toISOString(),
        projectId: slug,
        stage: "initialization",
      });

      // Decode environment variables
      const decodedEnvVars = envVariables.map(({ key, value }) => ({
        key: Buffer.from(key, "base64").toString("utf-8"),
        value: Buffer.from(value, "base64").toString("utf-8"),
      }));

      // Define ECS task command
      const command = new RunTaskCommand({
        cluster: config.CLUSTER,
        taskDefinition: config.TASK,
        launchType: process.env.ECS_LAUNCH_TYPE,
        count: 1,
        networkConfiguration: {
          awsvpcConfiguration: {
            assignPublicIp: "ENABLED",
            subnets: config.SUBNETS,
            securityGroups: config.SECURITY_GROUPS,
          },
        },
        overrides: {
          containerOverrides: [
            {
              name: process.env.ECS_IMAGE,
              environment: [
                {
                  name: "GIT_REPOSITORY_URL",
                  value: gitURL || existingProject.gitUrl,
                },
                { name: "PROJECT_ID", value: slug },
                { name: "ROOT_DIRECTORY", value: rootDirectory },
                { name: "ENV_VARS", value: JSON.stringify(decodedEnvVars) },
              ],
            },
          ],
        },
      });

      // Run the ECS task
      const taskResponse = await ecsClient.send(command);
      taskArn = taskResponse.tasks[0].taskArn;
      console.log("✅ Task started successfully:", taskArn);

      // Publish task started status to Redis
      await publishLog(slug, {
        status: "STARTED",
        message: "🚀 Redeployment process has started successfully",
        details: "Your code is being processed by our build system",
        timestamp: new Date().toISOString(),
        projectId: slug,
        stage: "building",
        taskArn: taskArn,
      });

      const buildResult = await new Promise((resolve, reject) => {
        const timeout = setTimeout(async () => {
          try {
            if (subscriber) {
              await subscriber.unsubscribe();
            }

            // Stop the ECS task if it times out
            if (taskArn) {
              try {
                const stopCommand = new StopTaskCommand({
                  cluster: config.CLUSTER,
                  task: taskArn,
                  reason: "Redeployment timed out after 20 minutes",
                });
                await ecsClient.send(stopCommand);
                console.log(
                  `✅ Successfully stopped task due to timeout: ${taskArn}`
                );
              } catch (stopError) {
                console.error(
                  "❗ Failed to stop ECS task after timeout:",
                  stopError
                );
              }
            }
          } catch (error) {
            console.error("❗ Error unsubscribing:", error);
          }

          reject(new Error("Redeployment timed out after 20 minutes"));
        }, 20 * 60 * 1000); // 20 minute timeout

        let subscriber = null;

        // Debug subscriber to monitor all log statuses
        const debugSubscriber = subscribeToLogs(slug, async (log) => {
          if (
            log.status === "COMPLETED" ||
            log.status === "FAILED" ||
            log.status === "ERROR" ||
            log.status === "INFO"
          ) {
            console.log(log);
          }
        });

        // Subscribe to logs and store the subscriber reference
        subscriber = subscribeToLogs(slug, async (log) => {
          if (log.stage === "completed") {
            clearTimeout(timeout);
            try {
              await subscriber.unsubscribe();
            } catch (error) {
              console.error("❗ Error unsubscribing:", error);
            }

            // Send success response to client when redeployment is completed
            if (!responseWasSent) {
              res.status(200).json({
                status: "success",
                message: "Project redeployment completed successfully",
                data: {
                  projectSlug: slug,
                  url: `https://${slug}.${process.env.PROXY_DOMAIN}` || `http://${slug}.localhost:8000`,
                  project: existingProject,
                },
              });
              responseWasSent = true;
            }

            resolve({ success: true, log });
          } else if (log.status === "ERROR" || log.status === "FAILED") {
            clearTimeout(timeout);
            try {
              await subscriber.unsubscribe();
            } catch (error) {
              console.error("❗ Error unsubscribing:", error);
            }

            // Stop the ECS task if there's an error
            if (taskArn) {
              try {
                const stopCommand = new StopTaskCommand({
                  cluster: config.CLUSTER,
                  task: taskArn,
                  reason: "Redeployment process failed with error status",
                });
                await ecsClient.send(stopCommand);
                console.log(
                  `✅ Successfully stopped task due to error: ${taskArn}`
                );
              } catch (stopError) {
                console.error(
                  "❗ Failed to stop ECS task after error:",
                  stopError
                );
              }
            }

            // Send error response to client when redeployment fails
            if (!responseWasSent) {
              res.status(500).json({
                status: "error",
                message: "Project redeployment failed",
                error: log.message || "Redeployment failed",
                data: {
                  projectSlug: slug,
                },
              });
              responseWasSent = true;
            }

            reject(new Error(log.message || "Redeployment failed"));
          }
        });
      });

      console.log("✅ Redeployment completed successfully for project:", slug);
      console.log("✅ Project redeployment completed successfully");
    } catch (error) {
      console.error("❗ Redeploy project error:", error);

      // If we have a task running, try to stop it
      if (taskArn) {
        try {
          // Send command to stop the ECS task
          const stopCommand = new StopTaskCommand({
            cluster: config.CLUSTER,
            task: taskArn,
            reason: "Redeployment process failed or was terminated",
          });
          await ecsClient.send(stopCommand);
          console.log(`✅ Successfully stopped task: ${taskArn}`);
        } catch (stopError) {
          console.error("❗ Failed to stop ECS task:", stopError);
        }
      }

      // Publish error status to Redis
      await publishLog(slug, {
        status: "ERROR",
        message: "❌ Redeployment process failed",
        details: error.message,
        error: {
          name: error.name,
          message: error.message,
          stack:
            process.env.NODE_ENV === "production" ? undefined : error.stack,
        },
        timestamp: new Date().toISOString(),
        projectId: slug,
        stage: "failed",
      });

      // Send error response if we haven't already sent a response
      if (!responseWasSent && !res.headersSent) {
        res.status(500).json({
          status: "error",
          message: "Redeployment failed",
          error: error.message || "Unknown error occurred",
          data: {
            projectSlug: slug,
          },
        });
        responseWasSent = true;
      }
    }
  } catch (globalError) {
    // Global error handler for any unexpected errors
    console.error("❗ Unexpected redeployment error:", globalError);

    // Only send response if headers haven't been sent yet
    if (!res.headersSent) {
      return res.status(500).json({
        status: "error",
        message: "Redeployment failed due to an unexpected error",
        error: globalError.message || "Unknown error occurred",
      });
    }
  }
};

module.exports = { redeployProject };
