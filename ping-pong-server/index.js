require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cron = require("node-cron");

const app = express();
const PORT = process.env.PORT || 3001;

// URLs of the servers we want to ping
const MAIN_SERVER_URL =
  process.env.MAIN_SERVER_URL || "https://gorr-main-server.onrender.com/ping";
const PROXY_SERVER_URL =
  process.env.PROXY_SERVER_URL || "https://gorr-proxy-server.onrender.com/ping";
const SOCKET_SERVER_URL =
  process.env.SOCKET_SERVER_URL ||
  "https://gorr-socket-server.onrender.com/ping";

// Basic health check endpoint for this server
app.get("/", (req, res) => {
  res.status(200).json({
    status: "active",
    message: "Ping-Pong server is running",
    lastPing: new Date().toISOString(),
  });
});

// Function to ping a server
async function pingServer(serverUrl, serverName) {
  try {
    const startTime = Date.now();
    const response = await axios.get(serverUrl);
    const endTime = Date.now();

    console.log(`✅ [${serverName}] Ping successful to ${serverUrl}`);
    console.log(`📊 [${serverName}] Response time: ${endTime - startTime}ms`);
    console.log(`📅 Time: ${new Date().toLocaleString()}`);
    return true;
  } catch (error) {
    console.error(
      `❌ [${serverName}] Failed to ping ${serverUrl}:`,
      error.message
    );
    return false;
  }
}

// Function to ping all servers
async function pingAllServers() {
  await pingServer(MAIN_SERVER_URL, "Main Server");
  await pingServer(PROXY_SERVER_URL, "Proxy Server");
  await pingServer(SOCKET_SERVER_URL, "Socket Server");
}

// Schedule a ping every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log("⏰ Scheduled ping task running...");
  await pingAllServers();
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Ping-Pong server running on port ${PORT}`);

  // Initial ping when server starts
  console.log("�� Performing initial ping...");
  pingAllServers();
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received. Shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("👋 SIGINT received. Shutting down gracefully");
  process.exit(0);
});
