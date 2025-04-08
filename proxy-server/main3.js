import express from "express";
import pkg from "aws-sdk";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const { S3 } = pkg;

// Configure AWS S3 exactly like the reference code
const s3 = new S3({
  region: process.env.AWS_ECS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const app = express();

// Debug endpoint to list all objects in the bucket
app.get("/list-bucket", async (req, res) => {
  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    console.log(`Listing all objects in bucket: ${bucketName}`);
    
    const listParams = {
      Bucket: bucketName
    };
    
    const listedObjects = await s3.listObjectsV2(listParams).promise();
    
    console.log(`Found ${listedObjects.Contents.length} objects in bucket`);
    
    const keys = listedObjects.Contents.map(item => ({
      key: item.Key,
      size: item.Size,
      lastModified: item.LastModified
    }));
    
    res.json({
      bucket: bucketName,
      objectCount: listedObjects.Contents.length,
      objects: keys
    });
  } catch (error) {
    console.error("Error listing bucket contents:", error);
    res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
});

// Original S3 SDK approach
app.get("/project/:projectId/*", async (req, res) => {
  const projectId = req.params.projectId;
  const filePath = req.params[0] || 'index.html'; // Default to index.html if no file specified
  const fullPath = `${projectId}/${filePath}`;
  
  console.log("Requested project (SDK):", fullPath);

  try {
    // Use the bucket name directly from env
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    console.log(`Fetching from bucket: ${bucketName}, key: ${fullPath}`);

    const contents = await s3
      .getObject({
        Bucket: bucketName,
        Key: fullPath,
      })
      .promise();

    // Determine content type based on file extension
    const extension = path.extname(filePath).toLowerCase();
    let contentType = "application/octet-stream";
    
    if (extension === ".html") contentType = "text/html";
    else if (extension === ".css") contentType = "text/css";
    else if (extension === ".js") contentType = "application/javascript";
    else if (extension === ".png") contentType = "image/png";
    else if (extension === ".jpg" || extension === ".jpeg") contentType = "image/jpeg";
    else if (extension === ".gif") contentType = "image/gif";
    else if (extension === ".svg") contentType = "image/svg+xml";
    else if (extension === ".json") contentType = "application/json";

    res.set("Content-Type", contentType);
    res.send(contents.Body);
  } catch (error) {
    console.error("Error fetching from S3:", error);
    res.status(404).send("File not found");
  }
});

// Alternative direct URL approach
app.get("/direct/:projectId/*", async (req, res) => {
  const projectId = req.params.projectId;
  const filePath = req.params[0] || 'index.html'; // Default to index.html if no file specified
  const fullPath = `${projectId}/${filePath}`;
  
  console.log("Requested project (direct):", fullPath);

  try {
    // Use the S3 base path from env
    const url = `${process.env.S3_BASE_PATH}/${fullPath}`;
    console.log(`Fetching from URL: ${url}`);

    const response = await axios.get(url, {
      responseType: "arraybuffer",
      validateStatus: false,
    });

    if (response.status !== 200) {
      throw new Error(`Failed with status: ${response.status}`);
    }

    // Determine content type based on file extension
    const extension = path.extname(filePath).toLowerCase();
    let contentType = "application/octet-stream";
    
    if (extension === ".html") contentType = "text/html";
    else if (extension === ".css") contentType = "text/css";
    else if (extension === ".js") contentType = "application/javascript";
    else if (extension === ".png") contentType = "image/png";
    else if (extension === ".jpg" || extension === ".jpeg") contentType = "image/jpeg";
    else if (extension === ".gif") contentType = "image/gif";
    else if (extension === ".svg") contentType = "image/svg+xml";
    else if (extension === ".json") contentType = "application/json";

    res.set("Content-Type", contentType);
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching directly:", error.message);
    res.status(404).send("File not found");
  }
});

// Handle requests with media paths that need project prefix
app.get("/:mediaPath(*)", async (req, res) => {
  const mediaPath = req.params.mediaPath;
  
  // Check if this is a media request without a project prefix
  if (mediaPath.includes("media/") || mediaPath.includes("Media/")) {
    // Determine the project slug from the first part of the path
    // Default to "apple-clone" for the example case
    const projectSlug = "apple-clone";
    const fullPath = `${projectSlug}/${mediaPath}`;
    
    console.log("Redirecting media request to project path:", fullPath);
    
    try {
      // Use the bucket name directly from env
      const bucketName = process.env.AWS_S3_BUCKET_NAME;
      
      console.log(`Fetching from bucket: ${bucketName}, key: ${fullPath}`);
      
      const contents = await s3
        .getObject({
          Bucket: bucketName,
          Key: fullPath,
        })
        .promise();
      
      // Determine content type based on file extension
      const extension = path.extname(mediaPath).toLowerCase();
      let contentType = "application/octet-stream";
      
      if (extension === ".png") contentType = "image/png";
      else if (extension === ".jpg" || extension === ".jpeg") contentType = "image/jpeg";
      else if (extension === ".gif") contentType = "image/gif";
      else if (extension === ".svg") contentType = "image/svg+xml";
      
      res.set("Content-Type", contentType);
      res.send(contents.Body);
    } catch (error) {
      console.error("Error fetching media from S3:", error);
      res.status(404).send("Media file not found");
    }
  } else {
    // Not a media path, pass to next handler or return 404
    res.status(404).send("Not found");
  }
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
  console.log(`Using S3 bucket: ${process.env.AWS_S3_BUCKET_NAME}`);
  console.log(`S3 base path: ${process.env.S3_BASE_PATH}`);
});
