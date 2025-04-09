const express = require("express");
const { Server } = require("socket.io");
const Redis = require("ioredis");
require("dotenv").config();

const app = express();
const PORT = parseInt(process.env.SOCKET_PORT) || 7000;

// Redis connection string from environment variables
const subscriber = new Redis(process.env.REDIS_URL);

// Set up Socket.io server with CORS enabled
const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Handle subscription requests from clients
  socket.on("subscribe", (channel) => {
    console.log(`Client ${socket.id} subscribed to ${channel}`);
    socket.join(channel);
    socket.emit("message", `Joined ${channel}`);
  });

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start the socket server
io.listen(PORT, () => console.log(`✅ Socket Server running on port ${PORT}`));

// Initialize Redis subscription to listen for logs
async function initRedisSubscribe() {
  console.log("Subscribing to build logs...");

  try {
    // Subscribe to all log channels with the pattern "logs:*"
    subscriber.psubscribe("logs:*");

    // Forward Redis messages to the corresponding socket channel
    subscriber.on("pmessage", (pattern, channel, message) => {
      // console.log(`📡 Received message on ${channel}:`, message)
      io.to(channel).emit("message", message);
    });

    subscriber.on("error", (err) => {
      console.error("❗ Redis subscription error:", err);
    });
  } catch (error) {
    console.error("❗ Error subscribing to Redis:", error);
  }
}

// Start Redis subscription
initRedisSubscribe();

// Basic health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("✅ Socket server is running");
});

// Add ping endpoint to keep the server active
app.get("/ping", (req, res) => {
  console.log("=============pingHandler===========", process);
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  const currentTime = new Date().toISOString();

  return res.status(200).json({
    status: "success",
    message: "Socket Server is active",
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
      socketConnections: io.engine.clientsCount,
    },
  });
});

// Start a simple Express server (for health checks)
app.listen(PORT + 1, () =>
  console.log(`✅ Express health check server running on port ${PORT + 1}`)
);
