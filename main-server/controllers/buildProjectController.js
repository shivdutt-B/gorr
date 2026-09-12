const { generateSlug } = require("random-word-slugs");
const { prisma } = require("../services/prismaService");
const { checkRedisConnection, publishLog } = require("../services/redisService");
const { executeDeployment } = require("../services/deploymentService");

/**
 * Handles initial project build & deployment.
 * Validates request, provisions user, runs ECS build task, and creates project record in database.
 */
const buildProject = async (req, res) => {
  const { gitURL, slug, rootDirectory, envVariables, userId } = req.body;
  const projectSlug = slug || generateSlug();
  const parsedUserId = userId ? parseInt(userId) : undefined;

  // 1. Validate required payload
  if (!gitURL) {
    return res.status(400).json({
      status: "error",
      message: "Git URL is required",
    });
  }

  // 2. Ensure Redis is connected before starting deployment
  const isRedisReady = await checkRedisConnection();
  if (!isRedisReady) {
    return res.status(503).json({
      status: "error",
      message: "Unable to start the deployment. Please try again later.",
    });
  }

  try {
    // 3. Check slug uniqueness in database
    const existingProject = await prisma.project.findUnique({
      where: { slug: projectSlug },
    });

    if (existingProject) {
      return res.status(409).json({
        status: "error",
        message: "Project with this slug already exists",
      });
    }

    // 4. Publish validation status to Redis
    await publishLog(projectSlug, {
      status: "INFO",
      message: "Validating project configuration and credentials",
      timestamp: new Date().toISOString(),
      projectId: projectSlug,
    });

    // 5. Upsert user record if userId provided
    if (parsedUserId) {
      await prisma.user.upsert({
        where: { userId: parsedUserId },
        create: { userId: parsedUserId },
        update: {},
      });
    }

    // 6. Execute containerized deployment
    const result = await executeDeployment({
      slug: projectSlug,
      gitUrl: gitURL,
      rootDirectory,
      envVariables,
      type: "deployment",
      onComplete: async ({ slug, gitUrl, url }) => {
        // Persist project in database on successful deployment
        const project = await prisma.project.create({
          data: {
            slug,
            gitUrl,
            userId: parsedUserId,
            projectUrl: url,
          },
        });

        await publishLog(slug, {
          status: "INFO",
          message: "Project record successfully persisted to database",
          timestamp: new Date().toISOString(),
          projectId: slug,
        });

        return project;
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Project deployment completed successfully",
      data: {
        projectSlug: result.projectSlug,
        url: result.url,
        project: result.customData,
        isAngularProject: result.isAngularProject,
        projectName: result.projectName,
      },
    });
  } catch (error) {
    console.error("[BUILD SERVICE] Project deployment failed:", error);

    await publishLog(projectSlug, {
      status: "ERROR",
      message: "Deployment process failed",
      timestamp: new Date().toISOString(),
      projectId: projectSlug,
    }).catch(() => {});

    if (!res.headersSent) {
      return res.status(500).json({
        status: "error",
        message: "Failed to deploy project",
        error: error.message || "Unknown error occurred",
        data: { projectSlug },
      });
    }
  }
};

module.exports = { buildProject };