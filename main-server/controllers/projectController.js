const { prisma } = require("../services/prismaService");

/*
  * Get the userId from the request query
  * Validate that userId is provided
  * Fetch all projects for the given userId from the database
  * If no projects are found, return an empty array
  * If projects are found, return them in the response
  * If any error occurs during the process, log the error and return an error response
*/
const getUserProjects = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({
      status: "error",
      message: "User ID is required",
    });
  }

  try {
    const projects = await prisma.project.findMany({
      where: {
        userId: parseInt(userId),
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
      error: error.message,
    });
  }
};

module.exports = { getUserProjects };
