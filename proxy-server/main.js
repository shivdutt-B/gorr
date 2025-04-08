const express = require("express");
const AWS = require("aws-sdk");
require("dotenv").config();

// Configure AWS S3 client
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "eu-north-1",
});

const app = express();
const PORT = 1000;
const BUCKET_NAME = "deployments-container";

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Hostname: ${req.hostname}`);
  next();
});

// Main route handler for all paths
app.get("/*", async (req, res) => {
  try {
    // Get project ID from path or query parameter
    let projectId = null;
    let filePath = req.path;

    // Check if URL follows /project/:projectId pattern
    if (req.path.startsWith("/project/")) {
      const pathParts = req.path.split("/");
      if (pathParts.length > 2) {
        projectId = pathParts[2];
        // Remove /project/projectId from the path
        filePath = "/" + pathParts.slice(3).join("/");
      }
    } else if (req.query.project) {
      // Fallback to query parameter
      projectId = req.query.project;
    }

    if (!projectId) {
      return res.status(400).send(`
        <h1>Project ID Not Found</h1>
        <p>Please specify a project using one of these methods:</p>
        <ul>
          <li>Path: <code>/project/project-name/</code></li>
          <li>Query parameter: <code>?project=project-name</code></li>
        </ul>
      `);
    }

    // Handle root path or directory paths (ending with /)
    if (filePath === "/" || filePath.endsWith("/")) {
      filePath = `${filePath}index.html`;
    }

    // Remove leading slash for S3 key
    if (filePath.startsWith("/")) {
      filePath = filePath.substring(1);
    }

    // Construct the S3 key
    const s3Key = `${projectId}/${filePath}`;
    console.log(`Fetching from S3: Bucket=${BUCKET_NAME}, Key=${s3Key}`);

    // Get the object from S3
    const s3Object = await s3
      .getObject({
        Bucket: BUCKET_NAME,
        Key: s3Key,
      })
      .promise();

    // Determine content type based on file extension
    const extension = filePath.split(".").pop().toLowerCase();
    const contentTypes = {
      html: "text/html",
      css: "text/css",
      js: "application/javascript",
      json: "application/json",
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      gif: "image/gif",
      svg: "image/svg+xml",
      ico: "image/x-icon",
    };

    const contentType = contentTypes[extension] || "application/octet-stream";
    res.set("Content-Type", contentType);

    // Send the file content
    res.send(s3Object.Body);
  } catch (error) {
    console.error("Error:", error);

    // Handle common errors
    if (error.code === "NoSuchKey") {
      // Try SPA fallback for missing files (for single page applications)
      if (!req.path.includes(".")) {
        try {
          let projectId = null;

          if (req.path.startsWith("/project/")) {
            projectId = req.path.split("/")[2];
          } else if (req.query.project) {
            projectId = req.query.project;
          }

          if (projectId) {
            const indexKey = `${projectId}/index.html`;
            console.log(`SPA fallback - trying to fetch: ${indexKey}`);

            const indexObject = await s3
              .getObject({
                Bucket: BUCKET_NAME,
                Key: indexKey,
              })
              .promise();

            res.set("Content-Type", "text/html");
            return res.send(indexObject.Body);
          }
        } catch (fallbackError) {
          console.error("SPA fallback failed:", fallbackError);
        }
      }

      return res
        .status(404)
        .send(
          "<h1>File Not Found</h1><p>The requested file could not be found.</p>"
        );
    }

    if (error.code === "AccessDenied") {
      return res
        .status(403)
        .send(
          "<h1>Access Denied</h1><p>You do not have permission to access this resource.</p>"
        );
    }

    res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Supports path-based routing (/project/project-name/)`);
  console.log(`Supports query parameter (?project=project-name)`);
});
