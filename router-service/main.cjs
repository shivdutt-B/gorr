const express = require("express");
const httpProxy = require("http-proxy");
const axios = require("axios");
require("dotenv").config();
const heimdall = require("heimdall-nodejs-sdk");

// Initialize Express and set up the proxy
const app = express();
const PORT = process.env.PORT || 8000;
const BASE_PATH = process.env.S3_BASE_PATH;
const MAIN_SERVER_URL = process.env.MAIN_SERVER_URL || "http://localhost:5000";
const proxy = httpProxy.createProxy();

// Add Heimdall ping endpoint
heimdall.ping(app);

// Middleware to handle incoming requests and proxy them to the correct S3 path
app.use((req, res) => {
  const hostname = req.hostname;
  let subdomain;

  // Check if the hostname contains underscores (for Angular projects)
  if (hostname.includes("_")) {
    const parts = hostname.split(".");
    const subdomainPart = parts[0];
    subdomain = subdomainPart.replace(/_/g, "/");
  } else {
    // Handle regular subdomains
    subdomain = hostname.split(".").slice(0, -2).join("/");
  }

  // Extract base project slug for view counter tracking
  const projectSlug = subdomain ? subdomain.split("/")[0].split("_")[0] : null;

  // Check if request is a main document page view (excluding iframe previews from dashboard)
  const isMainPageView =
    req.url === "/" ||
    req.url === "/index.html" ||
    (req.headers.accept && req.headers.accept.includes("text/html"));
  const isIframe = req.headers["sec-fetch-dest"] === "iframe";

  if (projectSlug && isMainPageView && !isIframe) {
    axios
      .post(`${MAIN_SERVER_URL}/projects/increment-view`, { slug: projectSlug })
      .catch((err) => {
        console.error("⚠️ Failed to increment project view:", err.message);
      });
  }

  // Constructing the target URL for the proxy based on the subdomain
  const resolvesTo = `${BASE_PATH}/${subdomain}`;

  // Proxying the request to the constructed URL
  return proxy.web(req, res, { target: resolvesTo, changeOrigin: true });
});

// Event listener for proxy requests to modify the path if necessary
proxy.on("proxyReq", (proxyReq, req) => {
  const url = req.url;
  if (url === "/") {
    // Appending 'index.html' to the path if the URL is the root
    proxyReq.path += "index.html";
  }
});

// Starting the server and logging the port number
app.listen(PORT, () => console.log(`Reverse Proxy Running on port ${PORT}`));
