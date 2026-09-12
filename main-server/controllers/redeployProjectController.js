const { prisma } = require("../services/prismaService");
const { checkRedisConnection, publishLog } = require("../services/redisService");
const { executeDeployment } = require("../services/deploymentService");

/**
 * Handles redeploying an existing project.
 * Enforces project ownership using req.user.userId directly in database query.
 */
const redeployProject = async (req, res) => {
  const { gitURL, slug, rootDirectory, envVariables } = req.body;
  const userId = req.user.userId;

  // 1. Validate required payload
  if (!slug) {
    return res.status(400).json({
      status: "error",
      message: "Project slug is required for redeployment",
    });
  }

  // 2. Ensure Redis is connected before starting redeployment
  const isRedisReady = await checkRedisConnection();
  if (!isRedisReady) {
    return res.status(503).json({
      status: "error",
      message: "Redis service is not connected. Redeployment cannot proceed.",
    });
  }

  try {
    // 3. Verify project exists in database and belongs to the authenticated user
    const existingProject = await prisma.project.findFirst({
      where: {
        slug,
        userId,
      },
    });

    if (!existingProject) {
      return res.status(404).json({
        status: "error",
        message: "Project not found or access denied",
      });
    }

    // 4. Execute containerized redeployment
    const result = await executeDeployment({
      slug,
      gitUrl: gitURL || existingProject.gitUrl,
      rootDirectory,
      envVariables,
      type: "redeployment",
      onComplete: async ({ slug, url }) => {
        let project = existingProject;

        // Update project URL if changed
        if (existingProject.projectUrl !== url) {
          project = await prisma.project.update({
            where: { id: existingProject.id },
            data: { projectUrl: url },
          });

          await publishLog(slug, {
            status: "INFO",
            message: "Project deployment URL updated in database",
            timestamp: new Date().toISOString(),
            projectId: slug,
          });
        }

        return project;
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Project redeployment completed successfully",
      data: {
        projectSlug: result.projectSlug,
        url: result.url,
        project: result.customData,
        isAngularProject: result.isAngularProject,
        projectName: result.projectName,
      },
    });
  } catch (error) {
    console.error("[BUILD SERVICE] Project redeployment failed:", error);

    await publishLog(slug, {
      status: "ERROR",
      message: "Redeployment process failed",
      timestamp: new Date().toISOString(),
      projectId: slug,
    }).catch(() => {});

    if (!res.headersSent) {
      return res.status(500).json({
        status: "error",
        message: "Project redeployment failed",
        data: { projectSlug: slug },
      });
    }
  }
};

module.exports = { redeployProject };