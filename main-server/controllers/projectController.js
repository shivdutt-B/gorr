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

module.exports = { getUserProjects };
