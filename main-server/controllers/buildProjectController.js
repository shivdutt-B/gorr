const { generateSlug } = require("random-word-slugs");
const { RunTaskCommand, StopTaskCommand } = require("@aws-sdk/client-ecs");
const { ecsClient, config } = require("../config/aws");
const { publishLog, subscribeToLogs } = require("../services/redisService");
const { prisma } = require("../services/prismaService");

const buildProject = async (req, res) => {
  try {
    const { gitURL, slug, rootDirectory, envVariables } = req.body;
    const userId = req.body.userId ? parseInt(req.body.userId) : undefined;
    const projectSlug = slug || generateSlug();
    let taskArn = null;
    let responseWasSent = false;
    let temporaryProject = null;
    let createdProject = null;

    try {
      // Validate required parameters
      if (!gitURL) {
        return res.json({
          status: "error",
          message: "Git URL is required",
        });
      }

      // Check if the slug already exists in the database
      const existingProject = await prisma.project.findUnique({
        where: { slug: projectSlug },
      });

      if (existingProject) {
        return res.json({
          status: "error",
          message: "Project with this slug already exists",
        });
      }

      // Start publishing logs after validating the request and checking slug availability
      await publishLog(projectSlug, {
        status: "VALIDATING",
        message: "🔍 Validating project details",
        details: "Checking user and project information",
        timestamp: new Date().toISOString(),
        projectId: projectSlug,
        stage: "validation",
      });

      // Check if user exists, if not create the user
      if (userId) {
        const existingUser = await prisma.user.findUnique({
          where: { userId: userId },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: { userId: userId },
          });
          await publishLog(projectSlug, {
            status: "INFO",
            message: "👤 New user created",
            details: `User ID: ${userId}`,
            timestamp: new Date().toISOString(),
            projectId: projectSlug,
            stage: "user_creation",
          });
        }
      }

      // Store project details temporarily - we'll create it in the database after successful deployment
      temporaryProject = {
        slug: projectSlug,
        gitUrl: gitURL,
        userId: userId,
        status: "QUEUED",
      };

      // Publish initial queued status to Redis
      await publishLog(projectSlug, {
        status: "QUEUED",
        message:
          "🔄 Your build has been added to the queue and will start soon",
        details: "Build environment is being prepared",
        timestamp: new Date().toISOString(),
        projectId: projectSlug,
        stage: "initialization",
      });

      const decodedEnvVars = envVariables.map(({ key, value }) => ({
        key: Buffer.from(key, "base64").toString("utf-8"),
        value: Buffer.from(value, "base64").toString("utf-8"),
      }));

      const FORMATTED_ENV_VARS = await JSON.stringify(decodedEnvVars);

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
                { name: "GIT_REPOSITORY_URL", value: gitURL },
                { name: "PROJECT_ID", value: projectSlug },
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

      // Update temporary project status
      temporaryProject.status = "STARTED";
      temporaryProject.taskArn = taskArn;

      // Publish task started status to Redis
      await publishLog(projectSlug, {
        status: "STARTED",
        message: "🚀 Build process has started successfully",
        details: "Your code is being processed by our build system",
        timestamp: new Date().toISOString(),
        projectId: projectSlug,
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
                  reason: "Build timed out after 15 minutes",
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

          reject(new Error("Build timed out after 15 minutes"));
        }, 15 * 60 * 1000); // 15 minute timeout

        let subscriber = null;

        // Debug subscriber to monitor all log statuses
        // const debugSubscriber = subscribeToLogs(projectSlug, async (log) => {
        //   if (
        //     log.status === "COMPLETED" ||
        //     log.status === "FAILED" ||
        //     log.status === "ERROR" ||
        //     log.status === "INFO"
        //   ) {
        //     console.log(log);
        //   }
        // });

        // Subscribe to logs and store the subscriber reference
        subscriber = subscribeToLogs(projectSlug, async (log) => {
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

            // Send success response to client when build is completed
            if (!responseWasSent) {
              // Use the stored values from subscriber if current ones aren't set
              isAngularProject =
                isAngularProject || subscriber.isAngularProject || false;
              projectName = projectName || subscriber.projectName || null;

              const baseUrl = process.env.PROXY_DOMAIN || "localhost:8000";
              let url;

              if (isAngularProject && projectName) {
                url = `https://${projectSlug}_${projectName}_browser.${baseUrl}`;
                // console.log(`Generated Angular URL: ${url}`);
              } else {
                url = `https://${projectSlug}.${baseUrl}`;
              }

              // Now create the project in database after successful deployment
              try {
                createdProject = await prisma.project.create({
                  data: {
                    slug: projectSlug,
                    gitUrl: gitURL,
                    userId: userId,
                    projectUrl: url,
                  },
                });

                await publishLog(projectSlug, {
                  status: "INFO",
                  message: "📝 Project created in database",
                  details: `Project slug: ${projectSlug}`,
                  timestamp: new Date().toISOString(),
                  projectId: projectSlug,
                  stage: "project_creation",
                });
              } catch (dbError) {
                console.error(
                  "❗ Failed to create project in database:",
                  dbError
                );
                await publishLog(projectSlug, {
                  status: "ERROR",
                  message: "❌ Failed to create project in database",
                  details: dbError.message,
                  timestamp: new Date().toISOString(),
                  projectId: projectSlug,
                  stage: "project_creation_failed",
                });
              }

              res.status(200).json({
                status: "success",
                message: "Project deployment completed successfully",
                data: {
                  projectSlug,
                  url,
                  project: createdProject,
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
                  reason: "Build process failed with error status",
                });
                await ecsClient.send(stopCommand);
              } catch (stopError) {
                console.error(
                  "❗ Failed to stop ECS task after error:",
                  stopError
                );
              }
            }

            // Send error response to client when build fails
            if (!responseWasSent) {
              res.json({
                status: "error",
                message: "Project deployment failed",
                error: log.message || "Build failed",
                data: {
                  projectSlug,
                },
              });
              responseWasSent = true;
            }

            reject(new Error(log.message || "Build failed"));
          }
        });
      });
    } catch (error) {
      console.error("❗ Build project error:", error);

      // If we have a task running, try to stop it
      if (taskArn) {
        try {
          // Send command to stop the ECS task
          const stopCommand = new StopTaskCommand({
            cluster: config.CLUSTER,
            task: taskArn,
            reason: "Build process failed or was terminated",
          });
          await ecsClient.send(stopCommand);
        } catch (stopError) {
          console.error("❗ Failed to stop ECS task:", stopError);
        }
      }

      // Publish error status to Redis
      await publishLog(projectSlug, {
        status: "ERROR",
        message: "❌ Deployment process failed",
        details: error.message,
        error: {
          name: error.name,
          message: error.message,
          stack:
            process.env.NODE_ENV === "production" ? undefined : error.stack,
        },
        timestamp: new Date().toISOString(),
        projectId: projectSlug,
        stage: "failed",
      });

      // Send error response if we haven't already sent a response
      if (!responseWasSent) {
        res.json({
          status: "error",
          message: "Failed to deploy project",
          error: error.message,
          data: {
            projectSlug,
          },
        });
        responseWasSent = true;
      }
    }
  } catch (globalError) {
    console.error("❗ Unexpected deployment error:", globalError);

    // Only send response if headers haven't been sent yet
    if (!res.headersSent) {
      return res.json({
        status: "error",
        message: "Deployment failed due to an unexpected error",
        error: globalError.message || "Unknown error occurred",
      });
    }
  }
};

module.exports = { buildProject };
