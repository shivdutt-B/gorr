const { prisma } = require("../services/prismaService");
const { RunTaskCommand, StopTaskCommand } = require("@aws-sdk/client-ecs");
const { ecsClient, config } = require("../config/aws");
const { publishLog, subscribeToLogs, publisher, waitForRedisConnection } = require("../services/redisService");


const redeployProject = async (req, res) => {
  /*
  First check if Redis is connected. If not, return an error response.
  This ensures that we don't attempt to redeploy if we can't log the status.
  We use a utility function to wait for Redis connection with retries.
  */
  try {
    await waitForRedisConnection(publisher, 10, 1000);
  } catch (err) {
    return res.status(200).json({
      status: "error",
      message: "Could not connect to Redis. Please try again later.",
      error: err.message,
    });
  }
  try {
    const userId = req.body.userId ? parseInt(req.body.userId) : undefined;
    const { gitURL, slug, rootDirectory, envVariables } = req.body;
    let taskArn = null;
    let responseWasSent = false;
    let existingProject = null;

    try {
      // Validate required parameters
      if (!slug) {
        return res.json({
          status: "error",
          message: "Project slug is required for redeployment",
        });
      }

      // Check if project exists in database
      existingProject = await prisma.project.findUnique({
        where: { slug: slug },
      });

      if (!existingProject) {
        return res.json({
          status: "error",
          message: "Project not found. Cannot redeploy a non-existent project.",
        });
      }

      // Verify user has permission to redeploy this project
      if (userId && existingProject.userId !== userId) {
        return res.json({
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

      const FORMATTED_ENV_VARS = await JSON.stringify(envVariables);

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
                { name: "ENV_VARS", value: FORMATTED_ENV_VARS },
              ],
            },
          ],
        },
      });

      // Run the ECS task
      const taskResponse = await ecsClient.send(command);
      taskArn = taskResponse.tasks[0].taskArn;

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
                  reason: "Redeployment timed out after 15 minutes",
                });
                await ecsClient.send(stopCommand);
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

          reject(new Error("Redeployment timed out after 15 minutes"));
        }, 15 * 60 * 1000); // 15 minute timeout

        let subscriber = null;

        // Subscribe to logs and store the subscriber reference
        subscriber = subscribeToLogs(slug, async (log) => {
          let isAngularProject = false;
          let projectName = null;

          // Check if log message is a string before trying to use string methods
          if (typeof log.message === "string") {
            if (log.message.includes("Detected Angular project")) {
              isAngularProject = true;

              // Improve regex pattern to capture project name more reliably
              const match = log.message.match(
                /Detected Angular project:\s*([^\s]+)/
              );
              if (match && match[1]) {
                projectName = match[1];

                // Store this information at the subscriber level for later use
                subscriber.isAngularProject = true;
                subscriber.projectName = projectName;
              }
            }
          }

          if (log.stage === "completed") {
            clearTimeout(timeout);
            try {
              await subscriber.unsubscribe();
            } catch (error) {
              console.error("❗ Error unsubscribing:", error);
            }

            // Send success response to client when redeployment is completed
            if (!responseWasSent) {
              // Use the stored values from subscriber if current ones aren't set
              isAngularProject =
                isAngularProject || subscriber.isAngularProject || false;
              projectName = projectName || subscriber.projectName || null;

              const baseUrl = process.env.PROXY_DOMAIN || "localhost:8000";
              let url;

              if (isAngularProject && projectName) {
                url = `https://${slug}_${projectName}_browser.${baseUrl}`;
                // url = `http://${slug}_${projectName}_browser.localhost:8000`;
              } else {
                url = `https://${slug}.${baseUrl}`;
                // url = `http://${slug}.localhost:8000`;
              }

              // Update the project URL if needed
              if (existingProject.projectUrl !== url) {
                try {
                  await prisma.project.update({
                    where: { slug: slug },
                    data: { projectUrl: url },
                  });

                  await publishLog(slug, {
                    status: "INFO",
                    message: "📝 Project URL updated in database",
                    details: `New URL: ${url}`,
                    timestamp: new Date().toISOString(),
                    projectId: slug,
                    stage: "project_update",
                  });
                } catch (dbError) {
                  console.error("❗ Failed to update project URL:", dbError);
                  await publishLog(slug, {
                    status: "WARNING",
                    message: "⚠️ Failed to update project URL",
                    details: dbError.message,
                    timestamp: new Date().toISOString(),
                    projectId: slug,
                    stage: "project_update_failed",
                  });
                }
              }

              res.status(200).json({
                status: "success",
                message: "Project redeployment completed successfully",
                data: {
                  projectSlug: slug,
                  url: url,
                  project: existingProject,
                  isAngularProject,
                  projectName,
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
              } catch (stopError) {
                console.error(
                  "❗ Failed to stop ECS task after error:",
                  stopError
                );
              }
            }

            // Send error response to client when redeployment fails
            if (!responseWasSent) {
              res.json({
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
        res.json({
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
      return res.json({
        status: "error",
        message: "Redeployment failed due to an unexpected error",
        error: globalError.message || "Unknown error occurred",
      });
    }
  }
};

module.exports = { redeployProject };
