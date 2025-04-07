const express = require("express");
const httpProxy = require("http-proxy");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;
const BASE_PATH = process.env.S3_BASE_PATH;
const proxy = httpProxy.createProxy();

// Middleware to handle path-based proxying
app.use("/:site", (req, res) => {
  const site = req.params.site;
  console.log("site: ", site);
  // console.log("req.path: ", req);
  // console.log("req.url: ", req.url);
  // let pathFromUrl = req.path.substring(1); // remove leading slash

  // pathFromUrl = pathFromUrl.replaceAll(".", "/");

  // console.log("pathFromUrl: ", pathFromUrl);

  // This constructs: http://s3-bucket-url/my-ang-app/angular-fresh/browser
  const resolvesTo = `${BASE_PATH}/${site}`;
  console.log("resolvesTo: ", resolvesTo);

  // Forward the request to S3
  proxy.web(req, res, {
    target: resolvesTo,
    changeOrigin: true,
    ignorePath: true, // important to avoid appending original path to the end again
  });
});

// Automatically serve index.html if root is requested
proxy.on("proxyReq", (proxyReq, req) => {
  if (req.url === "/" || req.url.endsWith("/")) {
    proxyReq.path += "index.html";
  }
});

// Log proxy errors
proxy.on("error", (err, req, res) => {
  console.error("Proxy error:", err);
  res.writeHead(500, { "Content-Type": "text/plain" });
  res.end("Proxy error: " + err.message);
});

// Log successful proxying
proxy.on("proxyRes", (proxyRes, req, res) => {
  console.log(`Proxied ${req.method} ${req.url} -> ${proxyRes.statusCode}`);
});

app.listen(PORT, () => console.log(`Reverse Proxy Running on port ${PORT}`));
