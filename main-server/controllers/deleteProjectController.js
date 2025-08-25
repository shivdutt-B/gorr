const { prisma } = require("../services/prismaService");
const AWS = require("aws-sdk");
require("dotenv").config();

// Configure AWS S3
const s3 = new AWS.S3({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/*
  * Get the userId and slug from the request body
  * Validate that both userId and slug are provided
  * Check if the project exists in the database for the given userId and slug
  * If the project does not exist, return an error response
  * If the project exists, proceed to delete the project files from S3
  * List all objects in the S3 bucket under the project slug
  * If no objects are found, log a message and continue
  * If objects are found, prepare a delete request for all objects in the project folder
  * Send the delete request to S3 to remove all project files
  * After deleting the files from S3, delete the project record from the database
  * Return a success response with the project slug
  * If any error occurs during the process, log the error and return an error response
*/
const deleteProject = async (req, res) => {
  try {
    const { userId, slug } = req.body;

    if (!userId || !slug) {
      return res.json({
        status: "error",
        message: "User ID and project slug are required",
      });
    }

    // Find the project to ensure it exists and belongs to the user
    const project = await prisma.project.findFirst({
      where: {
        slug: slug,
        userId: parseInt(userId),
      },
    });

    if (!project) {
      return res.json({
        status: "error",
        message: "Project not found or doesn't belong to the user",
      });
    }

    // Delete the project from S3
    try {
      const bucketName = process.env.AWS_S3_BUCKET_NAME;
      const folderKey = `${slug}/`;

      // List all objects in the folder
      const listParams = {
        Bucket: bucketName,
        Prefix: folderKey,
      };

      const listedObjects = await s3.listObjectsV2(listParams).promise();

      if (listedObjects.Contents.length === 0) {
        console.log(`No objects found in S3 for project: ${slug}`);
      } else {
        // Delete all objects in the folder
        const deleteParams = {
          Bucket: bucketName,
          Delete: { Objects: [] },
        };

        listedObjects.Contents.forEach(({ Key }) => {
          deleteParams.Delete.Objects.push({ Key });
        });

        await s3.deleteObjects(deleteParams).promise();
        console.log(
          `Deleted ${deleteParams.Delete.Objects.length} objects from S3 for project: ${slug}`
        );
      }
    } catch (s3Error) {
      console.error("Error deleting project files from S3:", s3Error);
      // Continue with database deletion even if S3 deletion fails
    }

    // Delete the project from the database
    await prisma.project.delete({
      where: {
        id: project.id,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Project deleted successfully",
      data: {
        slug: slug,
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
