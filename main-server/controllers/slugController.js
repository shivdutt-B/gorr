const { prisma } = require("../services/prismaService");

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
