const { RunTaskCommand, StopTaskCommand } = require("@aws-sdk/client-ecs");
const { ecsClient, config } = require("../config/aws");
const {
  publishLog,
  subscribeToLogs,
  publisher,
  waitForRedisConnection,
} = require("./redisService");

const TIMEOUT_MS = 15 * 60 * 1000; // 15-minute maximum task execution duration

/**
 * Runs a containerized build/deployment task on AWS ECS Fargate, streaming logs over Redis.
 *
 * @param {Object} options
 * @param {string} options.slug - Project slug (unique identifier)
 * @param {string} options.gitUrl - Git repository URL
 * @param {string} [options.rootDirectory] - Optional sub-directory containing project files
 * @param {Array} [options.envVariables] - Array of { key, value } environment variables
 * @param {string} [options.type] - "deployment" | "redeployment"
 * @param {Function} [options.onComplete] - Hook executed on successful build before resolving
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
  // Ensure Redis publisher is ready before starting the task
  await waitForRedisConnection(publisher, 10, 1000);

  const label = type === "redeployment" ? "Redeployment" : "Deployment";
  let taskArn = null;

  // Publish queued status
  await publishLog(slug, {
    status: "QUEUED",
    message: `🔄 ${label} has been added to the queue and will start soon`,
    details: `${label} environment is being prepared`,
    timestamp: new Date().toISOString(),
    projectId: slug,
    stage: "initialization",
  });

  const formattedEnvVars = JSON.stringify(envVariables);

  // Dispatch AWS ECS Fargate task
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
            { name: "ENV_VARS", value: formattedEnvVars },
          ],
        },
      ],
    },
  });

  const taskResponse = await ecsClient.send(runTaskCommand);
  taskArn = taskResponse.tasks?.[0]?.taskArn;

  await publishLog(slug, {
    status: "STARTED",
    message: `🚀 ${label} process has started successfully`,
    details: "Your code is being processed by our build system",
    timestamp: new Date().toISOString(),
    projectId: slug,
    stage: "building",
    taskArn,
  });

  // Helper to terminate ECS task if needed
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

  // Subscribe to Redis log events and wait for completion/failure
  return new Promise((resolve, reject) => {
    let isSettled = false;
    let subscriber = null;

    const timeout = setTimeout(async () => {
      if (isSettled) return;
      isSettled = true;
      if (subscriber) await subscriber.unsubscribe().catch(() => {});
      await stopTask(`${label} timed out after 15 minutes`);
      reject(new Error(`${label} timed out after 15 minutes`));
    }, TIMEOUT_MS);

    subscriber = subscribeToLogs(slug, async (log) => {
      // Check if project is Angular
      if (typeof log.message === "string" && log.message.includes("Detected Angular project")) {
        const match = log.message.match(/Detected Angular project:\s*([^\s]+)/);
        if (match?.[1]) {
          subscriber.isAngularProject = true;
          subscriber.projectName = match[1];
        }
      }

      if (log.stage === "completed" && !isSettled) {
        isSettled = true;
        clearTimeout(timeout);
        await subscriber.unsubscribe().catch(() => {});

        const isAngularProject = Boolean(subscriber.isAngularProject);
        const projectName = subscriber.projectName || null;
        const baseUrl = process.env.PROXY_DOMAIN || "localhost:8000";
        const url =
          isAngularProject && projectName
            ? `https://${slug}_${projectName}_browser.${baseUrl}`
            : `https://${slug}.${baseUrl}`;

        let customData = null;
        if (onComplete) {
          customData = await onComplete({
            slug,
            gitUrl,
            url,
            isAngularProject,
            projectName,
          });
        }

        resolve({
          projectSlug: slug,
          url,
          isAngularProject,
          projectName,
          customData,
        });
      } else if ((log.status === "ERROR" || log.status === "FAILED") && !isSettled) {
        isSettled = true;
        clearTimeout(timeout);
        await subscriber.unsubscribe().catch(() => {});
        await stopTask(`${label} failed with error status`);
        reject(new Error(log.message || `${label} failed`));
      }
    });
  });
}

module.exports = { executeDeployment };
