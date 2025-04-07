const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3000;

const BUCKET_NAME = 'deployments-container';
const REGION = 'eu-north-1'; // Stockholm (as per your screenshot)

app.use('/project/:name', (req, res, next) => {
  const projectName = req.params.name;

  // Construct the base S3 URL
  const target = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com`;

  // Dynamically build the proxy for this project
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      [`^/project/${projectName}`]: `/${projectName}`, // Keep path under project folder
    },
    onProxyReq(proxyReq, req, res) {
      console.log(`[Proxy] ${req.method} ${req.originalUrl} → ${target}${req.originalUrl.replace(`/project/${projectName}`, `/${projectName}`)}`);
    },
    onError(err, req, res) {
      console.error('Proxy error:', err);
      res.status(500).send('Something went wrong.');
    }
  })(req, res, next);
});

app.listen(PORT, () => {
  console.log(`🚀 Reverse proxy server running at http://localhost:${PORT}`);
});
