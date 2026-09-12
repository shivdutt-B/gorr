const express = require("express");
const httpProxy = require("http-proxy");
const axios = require("axios");
const path = require("path");
require("dotenv").config();
const heimdall = require("heimdall-nodejs-sdk");

// Initialize Express and set up the proxy
const app = express();
const PORT = process.env.PORT || 8000;
const BASE_PATH = process.env.S3_BASE_PATH;
const BASE_DOMAIN = process.env.BASE_DOMAIN || "localhost";
const MAIN_SERVER_URL = process.env.MAIN_SERVER_URL || "http://localhost:5000";
const proxy = httpProxy.createProxy();

if (!BASE_DOMAIN) {
  console.warn("BASE_DOMAIN is not set in .env — subdomain parsing will fail.");
}

// Add Heimdall ping endpoint
heimdall.ping(app);

// Middleware to handle incoming requests and proxy them to the correct S3 path
app.use((req, res) => {
  const hostname = req.hostname;
  let subdomain;

  // --- Derive subdomain by stripping the known base domain, not by counting labels ---
  if (hostname === BASE_DOMAIN) {
    // Request hit the bare base domain directly (no subdomain)
    subdomain = "";
  } else if (BASE_DOMAIN && hostname.endsWith(`.${BASE_DOMAIN}`)) {
    subdomain = hostname.slice(0, -(BASE_DOMAIN.length + 1));
  } else {
    // Fallback: shouldn't normally happen, but avoid crashing
    subdomain = hostname;
  }

  // Support underscore-based nested paths (e.g. for Angular projects: foo_bar -> foo/bar)
  if (subdomain.includes("_")) {
    subdomain = subdomain.replace(/_/g, "/");
  }

  // Extract base project slug for view counter tracking
  const projectSlug = subdomain ? subdomain.split("/")[0] : null;

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
        console.error("Failed to increment project view:", err.message);
      });
  }

  // --- SPA fallback: rewrite extensionless routes to index.html ---
  // Real static assets (bundle.js, style.css, logo.png, etc.) have an extension
  // and pass through untouched. Anything else (client-side routes like /movie,
  // /movie/123, or a hard refresh on any non-root page) gets index.html so the
  // SPA shell loads and the client-side router can take over.
  const [rawPath, queryString] = req.url.split("?");
  const hasExtension = path.extname(rawPath) !== "";

  if (!hasExtension) {
    req.url = queryString ? `/index.html?${queryString}` : "/index.html";
  }

  // Constructing the target URL for the proxy based on the subdomain
  const resolvesTo = subdomain ? `${BASE_PATH}/${subdomain}` : BASE_PATH;

  // Proxying the request to the constructed URL
  return proxy.web(req, res, { target: resolvesTo, changeOrigin: true }, (err) => {
    console.error("Proxy error:", err.message);
    if (!res.headersSent) {
      res.status(502).send("Bad gateway");
    }
  });
});

// Starting the server and logging the port number
app.listen(PORT, () => console.log(`Reverse Proxy Running on port ${PORT}`));