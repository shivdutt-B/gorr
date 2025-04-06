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
app.use((req, res) => {
  const hostname = req.hostname;
  console.log('hostname: ', hostname)
  const subdomain = hostname.split(".").slice(0, -1).join("/");
  console.log('subdomomain: ', subdomain)

  // Constructing the target URL for the proxy based on the subdomain
  const resolvesTo = `${BASE_PATH}/${subdomain}`;

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
