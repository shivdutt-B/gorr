require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const heimdall = require("heimdall-nodejs-sdk");
const routes = require("./routes");
const { connectToDatabase } = require("./services/prismaService");

const app = express();
const PORT = process.env.PORT || 5000;

// Standard middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5174",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Ping monitoring endpoint
heimdall.ping(app);

// Application routes
app.use(routes);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("❌ Unhandled error:", err);
  res.status(500).json({
    status: "error",
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// 404 route handler
app.use((_req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Initialize database and start HTTP server
async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () =>
      console.log(`✅ API Server running on port ${PORT}`)
    );
  } catch (error) {
    console.error("❌ Failed to initialize server:", error);
    process.exit(1);
  }
}

startServer();
