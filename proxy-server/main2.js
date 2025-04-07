const express = require("express");
const httpProxy = require("http-proxy");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 3000;
const BASE_PATH = "https://gorr-test-bucket.s3.eu-north-1.amazonaws.com";
const proxy = httpProxy.createProxy();

// Middleware to handle incoming requests
app.use("/project/:projectName", (req, res) => {
  const projectName = req.params.projectName; // extract project name from route parameter

  console.log('projectName', projectName)

  if (!projectName) {
    return res.status(400).send("Project name not specified in the URL.");
  }

  //   // Trim project name from URL to forward actual file path
//   const filePath = req.path.replace(`/${projectName}`, "") || "/index.html";

    // console.log('KFSLKJDFSLKFJSLFJSLJFLSFJLSJFLJSLFKJ=====================')
  const targetUrl = `${BASE_PATH}/${projectName}/index.html`;

  console.log('targetUrl', targetUrl)


//   console.log(`🔁 Proxying to: ${targetUrl}${filePath}`);

  proxy.web(req, res, {
    target: targetUrl,
    changeOrigin: true,
    selfHandleResponse: false,
    headers: {
      host: new URL(targetUrl).host,
    }
  }, (err) => {
    console.error("❌ Proxy Error:", err.message);
    res.status(500).send("Proxy error");
  });

  // Rewrite path so S3 receives the correct resource path
//   req.url = filePath;
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Reverse proxy server running at http://localhost:${PORT}`);
});
