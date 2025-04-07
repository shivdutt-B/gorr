const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;
const BASE_URL = "http://deployments-container.s3.eu-north-1.amazonaws.com";

// Project cache to remember which project a user is browsing
const sessions = {};

// Add CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Debug route to see what paths are being requested
app.use((req, res, next) => {
  console.log(`Request path: ${req.path}, query: ${JSON.stringify(req.query)}`);
  next();
});

app.get("/*", async (req, res) => {
  try {
    // Extract the project name from the query parameter or session
    let projectName = req.query.project;

    // Get or create a session ID based on IP for simplicity
    const sessionId = req.ip || "default";

    if (projectName) {
      // If project was specified, store it in session
      sessions[sessionId] = projectName;
    } else {
      // If no project specified, try to get from session
      projectName = sessions[sessionId];
    }

    if (!projectName) {
      return res
        .status(400)
        .send("Missing 'project' query parameter. Please specify a project.");
    }

    // Get the file path from the URL
    let filePath = req.path.substring(1); // Remove leading slash
    if (filePath === "" || filePath === "/") {
      filePath = "index.html";
    }

    // Check if this is an absolute URL request (with http/https)
    // If so, use it directly instead of appending to BASE_URL
    let fullUrl;
    if (filePath.startsWith("http")) {
      fullUrl = filePath;
    } else {
      fullUrl = `${BASE_URL}/${projectName}/${filePath}`;
    }

    console.log(`Fetching from S3: ${fullUrl}`);

    // Get the content from S3
    const response = await axios.get(fullUrl, {
      responseType: "arraybuffer",
    });

    // Set the appropriate content type
    const contentType = getContentType(filePath);
    res.setHeader("Content-Type", contentType);

    // If it's HTML content, we'll replace relative paths with our proxy paths
    if (contentType === "text/html") {
      let content = response.data.toString("utf-8");

      // Process HTML content to fix asset paths
      content = fixHtmlPaths(content, projectName);

      console.log(`HTML content processed, sending response...`);
      return res.send(content);
    }

    // If it's a text-based file (CSS, JS), convert from buffer to string and log
    if (contentType.includes("text") || contentType.includes("javascript")) {
      const content = response.data.toString("utf-8");
      console.log(
        `Content preview (${filePath}): ${content.substring(0, 150)}...`
      );
      return res.send(content);
    }

    // Send the file content for binary files
    res.send(response.data);
  } catch (error) {
    console.error(`Error fetching ${req.path}:`, error.message);

    if (error.response) {
      console.log(`S3 response status: ${error.response.status}`);

      if (error.response.status === 404) {
        return res.status(404).send(`File not found: ${req.path}`);
      } else if (error.response.status === 403) {
        return res.status(403).send(`Access denied to resource: ${req.path}`);
      }

      return res
        .status(error.response.status)
        .send(`Error retrieving file: ${error.message}`);
    }

    res.status(500).send(`Error retrieving file: ${error.message}`);
  }
});

// Helper function to fix paths in HTML content
function fixHtmlPaths(html, projectName) {
  // Replace relative links to CSS and JS files
  // This regex looks for href and src attributes with relative paths
  let fixedHtml = html.replace(
    /(href|src)="(?!http|\/\/|#)([^"]+)"/g,
    (match, attr, path) => {
      if (path.startsWith("/")) {
        // Keep the leading slash
        return `${attr}="?project=${projectName}${path}"`;
      }
      return `${attr}="?project=${projectName}/${path}"`;
    }
  );

  return fixedHtml;
}

// Helper function to determine content type
function getContentType(filePath) {
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
    woff: "font/woff",
    woff2: "font/woff2",
    ttf: "font/ttf",
    eot: "application/vnd.ms-fontobject",
    otf: "font/otf",
  };

  return contentTypes[extension] || "application/octet-stream";
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
