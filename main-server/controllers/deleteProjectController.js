const { ListObjectsV2Command, DeleteObjectsCommand } = require("@aws-sdk/client-s3");
const { s3Client, config } = require("../config/aws");
const { prisma } = require("../services/prismaService");

/**
 * Handles project deletion: cleans up S3 build artifacts and removes project record from database.
 */
const deleteProject = async (req, res) => {
  const { userId, slug } = req.body;

  // 1. Validate required fields
  if (!userId || !slug) {
    return res.status(400).json({
      status: "error",
      message: "User ID and project slug are required",
    });
  }

  try {
    const parsedUserId = parseInt(userId);

    // 2. Verify project exists and belongs to the requesting user
    const project = await prisma.project.findFirst({
      where: {
        slug,
        userId: parsedUserId,
      },
    });

    if (!project) {
      return res.status(404).json({
        status: "error",
        message: "Project not found or doesn't belong to the user",
      });
    }

    // 3. Delete project build artifacts from S3
    try {
      const bucketName = config.S3_BUCKET;
      const listCommand = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: `${slug}/`,
      });

      const listedObjects = await s3Client.send(listCommand);

      if (listedObjects.Contents && listedObjects.Contents.length > 0) {
        const deleteCommand = new DeleteObjectsCommand({
          Bucket: bucketName,
          Delete: {
            Objects: listedObjects.Contents.map(({ Key }) => ({ Key })),
          },
        });

        await s3Client.send(deleteCommand);
        console.log(`Deleted ${listedObjects.Contents.length} objects from S3 for: ${slug}`);
      }
    } catch (s3Error) {
      console.error("⚠️ S3 deletion warning (continuing with DB deletion):", s3Error.message);
    }

    // 4. Delete project record from database
    await prisma.project.delete({
      where: {
        id: project.id,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Project deleted successfully",
      data: {
        slug,
      },
    });
  } catch (error) {
    console.error("❌ Error deleting project:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to delete project",
      error: error.message,
    });
  }
};

module.exports = { deleteProject };
