const { prisma } = require("../services/prismaService");
const { publishLog } = require("../services/redisService");
const { executeDeployment } = require("../services/deploymentService");

/**
 * Handles redeploying an existing project.
 * Validates project ownership, runs ECS build task, and updates project URL in database.
 */
const redeployProject = async (req, res) => {
  const { gitURL, slug, rootDirectory, envVariables, userId } = req.body;
  const parsedUserId = userId ? parseInt(userId) : undefined;

  // 1. Validate required payload
  if (!slug) {
    return res.status(400).json({
      status: "error",
      message: "Project slug is required for redeployment",
    });
  }

  try {
    // 2. Verify project exists in database
    const existingProject = await prisma.project.findUnique({
      where: { slug },
    });

    if (!existingProject) {
      return res.status(404).json({
        status: "error",
        message: "Project not found. Cannot redeploy a non-existent project.",
      });
    }

    // 3. Verify user permissions
    if (parsedUserId && existingProject.userId !== parsedUserId) {
      return res.status(403).json({
        status: "error",
        message: "You don't have permission to redeploy this project",
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
            where: { slug },
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
    console.error("❗ Redeploy project error:", error);

    await publishLog(slug, {
      status: "ERROR",
      message: "❌ Redeployment process failed",
      details: error.message,
      timestamp: new Date().toISOString(),
      projectId: slug,
      stage: "failed",
    }).catch(() => {});

    if (!res.headersSent) {
      return res.status(500).json({
        status: "error",
        message: "Project redeployment failed",
        error: error.message || "Unknown error occurred",
        data: { projectSlug: slug },
      });
    }
  }
};

module.exports = { redeployProject };
