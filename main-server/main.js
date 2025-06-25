require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const heimdall = require('heimdall-nodejs-sdk');
const authRoutes = require("./routes/authRoutes");
const buildRoutes = require("./routes/buildRoutes");
const slugRoutes = require("./routes/slugRoutes");
const projectRoutes = require("./routes/projectRoutes");
const deleteProjectRoutes = require("./routes/deleteProjectRoutes");
const { connectToDatabase } = require("./services/prismaService");
const redeployProjectRoutes = require("./routes/redeployProjectRoute");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Add Heimdall ping endpoint
heimdall.ping(app);

// Routes
app.use("/auth", authRoutes);
app.use("/", buildRoutes);
app.use("/", slugRoutes);
app.use("/", projectRoutes);
app.use("/", deleteProjectRoutes);
app.use("/", redeployProjectRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);
  res.status(500).json({
    status: "error",
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Improve database initialization
async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () =>
      console.log(`✅ API Server running on port ${PORT}`)
    );
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
    process.exit(1);
  }
}

startServer();
