const { RunTaskCommand, StopTaskCommand } = require("@aws-sdk/client-ecs");
const { ecsClient, config } = require("../config/aws");
const {
  checkRedisConnection,
  publishLog,
  subscribeToLogs,
} = require("./redisService");

// Maximum allowed build execution duration before auto-canceling (15 minutes)
const TIMEOUT_MS = 15 * 60 * 1000;

/**
 * Builds the live project URL based on project type and slug.
 *
 * @param {string} slug - Project unique identifier
 * @param {boolean} isAngular - Whether project is an Angular app
 * @param {string|null} projectName - Angular sub-project name
 * @returns {string} Fully qualified project URL
 */
const buildProjectUrl = (slug, isAngular, projectName) => {
  const baseUrl = process.env.PROXY_DOMAIN || "localhost:8000";
  return isAngular && projectName
    ? `https://${slug}_${projectName}_browser.${baseUrl}`
    : `https://${slug}.${baseUrl}`;
};

/**
 * Executes a containerized build and deployment on AWS ECS Fargate.
 * Streams real-time build logs via Redis pub/sub and resolves upon build completion.
 *
 * @param {Object} options
 * @param {string} options.slug - Unique project slug
 * @param {string} options.gitUrl - Git repository clone URL
 * @param {string} [options.rootDirectory=""] - Optional sub-directory containing source code
 * @param {Array<{ key: string, value: string }>} [options.envVariables=[]] - Environment variables for build
 * @param {"deployment" | "redeployment"} [options.type="deployment"] - Operation type for logging
 * @param {Function} [options.onComplete] - Async callback invoked on successful build before resolving
 * @returns {Promise<{ projectSlug: string, url: string, isAngularProject: boolean, projectName: string|null, customData?: any }>}
 */
async function executeDeployment({
  slug,
  gitUrl,
  rootDirectory = "",
  envVariables = [],
  type = "deployment",
  onComplete,
}) {
  // 1. Verify Redis connectivity before scheduling deployment
  const isRedisReady = await checkRedisConnection(3000);
  if (!isRedisReady) {
    throw new Error("Unable to start the deployment. Please try again later.");
  }

  const label = type === "redeployment" ? "Redeployment" : "Deployment";
  let taskArn = null;

  // 2. Publish initial queued status
  await publishLog(slug, {
    status: "QUEUED",
    message: `🔄 ${label} has been added to the queue and will start soon`,
    details: `${label} environment is being prepared`,
    timestamp: new Date().toISOString(),
    projectId: slug,
    stage: "initialization",
  });

  // 3. Dispatch AWS ECS Fargate task
  const runTaskCommand = new RunTaskCommand({
    cluster: config.CLUSTER,
    taskDefinition: config.TASK,
    launchType: process.env.ECS_LAUNCH_TYPE || "FARGATE",
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
            { name: "GIT_REPOSITORY_URL", value: gitUrl },
            { name: "PROJECT_ID", value: slug },
            { name: "ROOT_DIRECTORY", value: rootDirectory || "" },
            { name: "ENV_VARS", value: JSON.stringify(envVariables) },
          ],
        },
      ],
    },
  });

  const taskResponse = await ecsClient.send(runTaskCommand);
  taskArn = taskResponse.tasks?.[0]?.taskArn;

  // 4. Publish started status
  await publishLog(slug, {
    status: "STARTED",
    message: `🚀 ${label} process has started successfully`,
    details: "Your code is being processed by our build system",
    timestamp: new Date().toISOString(),
    projectId: slug,
    stage: "building",
    taskArn,
  });

  // Helper to safely terminate ECS task on error or timeout
  const stopTask = async (reason) => {
    if (!taskArn) return;
    try {
      await ecsClient.send(
        new StopTaskCommand({
          cluster: config.CLUSTER,
          task: taskArn,
          reason,
        })
      );
    } catch (err) {
      console.error("❗ Failed to stop ECS task:", err.message);
    }
  };

  // 5. Subscribe to Redis logs and await terminal status
  return new Promise((resolve, reject) => {
    let isSettled = false;
    let subscriber = null;

    // Teardown subscriber and timeout
    const cleanup = async () => {
      clearTimeout(timeout);
      if (subscriber) {
        await subscriber.unsubscribe().catch(() => {});
      }
    };

    // 15-minute hard timeout guard
    const timeout = setTimeout(async () => {
      if (isSettled) return;
      isSettled = true;
      await cleanup();
      await stopTask(`${label} timed out after 15 minutes`);
      reject(new Error(`${label} timed out after 15 minutes`));
    }, TIMEOUT_MS);

    subscriber = subscribeToLogs(slug, async (log) => {
      // Detect Angular project indicator in logs
      if (typeof log.message === "string" && log.message.includes("Detected Angular project")) {
        const match = log.message.match(/Detected Angular project:\s*([^\s]+)/);
        if (match?.[1]) {
          subscriber.isAngularProject = true;
          subscriber.projectName = match[1];
        }
      }

      // Handle successful build completion
      if (log.stage === "completed" && !isSettled) {
        isSettled = true;
        await cleanup();

        const isAngularProject = Boolean(subscriber.isAngularProject);
        const projectName = subscriber.projectName || null;
        const url = buildProjectUrl(slug, isAngularProject, projectName);

        let customData = null;
        if (onComplete) {
          try {
            customData = await onComplete({
              slug,
              gitUrl,
              url,
              isAngularProject,
              projectName,
            });
          } catch (callbackError) {
            console.error("❗ onComplete callback failed:", callbackError);
          }
        }

        resolve({
          projectSlug: slug,
          url,
          isAngularProject,
          projectName,
          customData,
        });
      }

      // Handle build failure
      else if ((log.status === "ERROR" || log.status === "FAILED") && !isSettled) {
        isSettled = true;
        await cleanup();
        await stopTask(`${label} failed with error status`);
        reject(new Error(log.message || `${label} failed`));
      }
    });
  });
}

module.exports = { executeDeployment };
