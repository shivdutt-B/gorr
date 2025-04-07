const express = require("express");
const httpProxy = require("http-proxy");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;
const BASE_PATH = process.env.S3_BASE_PATH;
const proxy = httpProxy.createProxy();

// Middleware to handle requests
app.use((req, res) => {
  // Extract the project name from the query parameter
  const projectName = req.query.project;

  if (!projectName) {
    return res.status(400).send("Missing 'project' query parameter.");
  }

  // Construct the target S3 URL
  const resolvesTo = `${BASE_PATH}/${projectName}`;
  console.log("resolvesTo:", resolvesTo);

  // Proxy the request to the target S3 path
  proxy.web(req, res, {
    target: resolvesTo,
    changeOrigin: true,
  });
});

// Optional: Handle root path for HTML fallback
proxy.on("proxyReq", (proxyReq, req) => {
  if (req.url === "/") {
    proxyReq.path += "index.html";
  }
});

// Start the server
app.listen(PORT, () =>
  console.log(`Reverse Proxy running on port ${PORT}`)
);
