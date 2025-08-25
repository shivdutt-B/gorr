const { prisma } = require("../services/prismaService");

/*
  * Get the slug from the request query
  * Validate that slug is provided
  * Check if the slug already exists in the database
  * If the slug exists, return a response indicating it is not available
  * If the slug does not exist, return a response indicating it is available
  * If any error occurs during the process, log the error and return an error response
*/
const checkSlugAvailability = async (req, res) => {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({
      status: "error",
      message: "Slug parameter is required",
    });
  }

  try {
    const existingProject = await prisma.project.findUnique({
      where: { slug },
    });

    return res.status(200).json({
      available: !existingProject,
    });
  } catch (error) {
    console.error("❌ Error checking slug availability:", error);
    return res.status(500).json({
      error: "Failed to check availability",
    });
  }
};

module.exports = { checkSlugAvailability };
