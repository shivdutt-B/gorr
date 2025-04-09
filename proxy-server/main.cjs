const express = require("express");
const httpProxy = require("http-proxy");
require("dotenv").config();

// Initialize Express and set up the proxy
const app = express();
const PORT = process.env.PORT || 8000;
const BASE_PATH = process.env.S3_BASE_PATH;
const proxy = httpProxy.createProxy();

// Add a ping endpoint to keep the server active
app.get("/ping", (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  const currentTime = new Date().toISOString();

  return res.status(200).json({
    status: "success",
    message: "Proxy Server is active",
    data: {
      serverTime: currentTime,
      uptime: `${Math.floor(uptime / 60)} minutes, ${Math.floor(
        uptime % 60
      )} seconds`,
      memoryUsage: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
      },
    },
  });
});

// Middleware to handle incoming requests and proxy them to the correct S3 path
app.use((req, res) => {
  const hostname = req.hostname;
  let subdomain;

  // Check if the hostname contains underscores (for Angular projects)
  if (hostname.includes("_")) {
    // Replace underscores with slashes for proper path construction
    // const subdomain = hostname.split(".").slice(0, -2).join("/");
    // https://af1_angular-fresh_browser.gorrproxy.xyz
    const parts = hostname.split(".");
    const subdomainPart = parts[0];
    subdomain = subdomainPart.replace(/_/g, "/");
  } else {
    // Handle regular subdomains
    subdomain = hostname.split(".").slice(0, -2).join("/");
  }
  console.log(
    "=============================subdomain====================: ",
    subdomain
  );
  console.log(
    "=============================hostname====================: ",
    hostname
  );

  // Constructing the target URL for the proxy based on the subdomain
  const resolvesTo = `${BASE_PATH}/${subdomain}`;

  console.log("resolvesTo: ", resolvesTo);

  // Proxying the request to the constructed URL
  return proxy.web(req, res, { target: resolvesTo, changeOrigin: true });
});

// Event listener for proxy requests to modify the path if necessary
// Although this is handled in the AWS S3 bucket itself, we are doing it here for the sake of completeness.
proxy.on("proxyReq", (proxyReq, req, res) => {
  const url = req.url;
  if (url === "/") {
    // Appending 'index.html' to the path if the URL is the root
    proxyReq.path += "index.html";
  }
});

// Starting the server and logging the port number
app.listen(PORT, () => console.log(`Reverse Proxy Running on port ${PORT}`));
