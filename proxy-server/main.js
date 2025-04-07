const express = require("express");
const httpProxy = require("http-proxy");
require("dotenv").config();

// Initialize Express and set up the proxy
const app = express();
const PORT = process.env.PORT || 8000;
const BASE_PATH =
  process.env.S3_BASE_PATH ||
  "http://deployments-container.s3.eu-north-1.amazonaws.com";
const proxy = httpProxy.createProxy();

// Middleware to handle incoming requests and proxy them to the correct S3 path
app.use((req, res) => {
  const projectName = req.query.project;

  if (!projectName) {
    return res.status(400).send("Missing 'project' query parameter");
  }

  // Constructing the target URL for the proxy based on the project name
  const resolvesTo = `${BASE_PATH}/${projectName}`;
  console.log("resolvesTo: ", resolvesTo);

  // Proxying the request to the constructed URL
  return proxy.web(req, res, {
    target: resolvesTo,
    changeOrigin: true,
    autoRewrite: true,
  });
});

// Event listener for proxy requests to modify the path if necessary
proxy.on("proxyReq", (proxyReq, req, res) => {
  // If there are query parameters, remove them
  const originalUrl = req.url;
  const urlWithoutParams = originalUrl.split("?")[0];

  // Set the path to the URL without parameters
  proxyReq.path = urlWithoutParams;

  // Handle root path
  if (urlWithoutParams === "/") {
    // Appending 'index.html' to the path if the URL is the root
    proxyReq.path = "/index.html";
  }

  console.log("Original URL:", originalUrl);
  console.log("Modified path:", proxyReq.path);
});

// Handle proxy errors
proxy.on("error", (err, req, res) => {
  console.error("Proxy error:", err);
  res.status(500).send("Proxy error: " + err.message);
});

// Starting the server and logging the port number
app.listen(PORT, () => console.log(`Reverse Proxy Running on port ${PORT}`));
