const { prisma } = require("../services/prismaService");

/**
 * Retrieves all projects owned by the currently authenticated user.
 */
const getUserProjects = async (req, res) => {
  try {
    const userId = req.user.userId;

    const projects = await prisma.project.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      status: "success",
      data: projects,
    });
  } catch (error) {
    console.error("❌ Error fetching user projects:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch projects",
    });
  }
};

/**
 * Increments the view counter for a project when visited via the proxy router.
 */
const incrementProjectView = async (req, res) => {
  const { slug } = req.body;

  if (!slug) {
    return res.status(400).json({
      status: "error",
      message: "Project slug is required",
    });
  }

  try {
    const updatedProject = await prisma.project.update({
      where: { slug },
      data: {
        views: {
          increment: 1,
        },
      },
      select: {
        id: true,
        slug: true,
        views: true,
      },
    });

    return res.status(200).json({
      status: "success",
      data: updatedProject,
    });
  } catch (error) {
    console.error("❌ Error incrementing project view:", error.message);
    return res.status(404).json({
      status: "error",
      message: "Project not found",
    });
  }
};

module.exports = { getUserProjects, incrementProjectView };
