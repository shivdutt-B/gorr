const express = require("express");
const httpProxy = require("http-proxy");
require("dotenv").config();

// Initialize Express and set up the proxy
const app = express();
const PORT = process.env.PORT || 8000;
// const BASE_PATH = process.env.S3_BASE_PATH;
const BASE_PATH = process.env.S3_BASE_PATH;
const proxy = httpProxy.createProxy();

// Middleware to handle incoming requests and proxy them to the correct S3 path
app.use(async (req, res) => {
  const hostname = req.hostname;

  console.log("hostname: ", hostname);
  console.log("query params: ", req.query);

  // Extract app name from query parameter instead of hostname
  let projectPath = "";
  if (req.query && req.query.app) {
    // Get the app name from the query parameter
    projectPath = req.query.app;
    // Replace dots with slashes to create the path structure (if needed)
    projectPath = projectPath.replace(/\./g, "/");
    console.log("projectPath: ", projectPath);

    // Constructing the target URL for the proxy based on the app parameter
    const resolvesTo = `${BASE_PATH}/${projectPath}`;
    console.log(`Proxying request to ${resolvesTo}`);

    // Proxying the request to the constructed URL
    return proxy.web(req, res, { target: resolvesTo, changeOrigin: true });
  } else {
    // If no app parameter is provided, return an error or redirect to a default page
    return res
      .status(400)
      .send("Missing app parameter. Use ?app=your-app-name");
  }
});

// Event listener for proxy requests to modify the path if necessary
proxy.on("proxyReq", (proxyReq, req, res) => {
  const url = req.url;

  // Remove the app query parameter from the proxied URL
  if (proxyReq.path.includes("?app=")) {
    const cleanPath = proxyReq.path.split("?")[0];
    proxyReq.path = cleanPath;
  }

  if (proxyReq.path === "/" || proxyReq.path === "") {
    // Appending 'index.html' to the path if the URL is the root
    proxyReq.path += "index.html";
  }
});

// Starting the server and logging the port number
app.listen(PORT, () => console.log(`Reverse Proxy Running on port ${PORT}`));
