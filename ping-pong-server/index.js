require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cron = require("node-cron");

const app = express();
const PORT = process.env.PORT || 3001;

// URL of the main server we want to ping
const MAIN_SERVER_URL =
  process.env.MAIN_SERVER_URL || "https://your-main-server-url.onrender.com";

// Basic health check endpoint for this server
app.get("/", (req, res) => {
  res.status(200).json({
    status: "active",
    message: "Ping-Pong server is running",
    lastPing: new Date().toISOString(),
  });
});

// Function to ping the main server
async function pingMainServer() {
  try {
    const startTime = Date.now();
    const response = await axios.get(MAIN_SERVER_URL);

    const endTime = Date.now();

    console.log(`✅ Ping successful to ${MAIN_SERVER_URL}`);
    console.log(`📊 Response time: ${endTime - startTime}ms`);
    console.log(`📅 Time: ${new Date().toLocaleString()}`);
    // Log server stats from the response
    if (response.data && response.data.data) {
      const { uptime, memoryUsage } = response.data.data;
      console.log(`📈 Server uptime: ${uptime}`);
      console.log(`🧠 Memory usage:`);
      console.log(`   - RSS: ${memoryUsage.rss}`);
      console.log(`   - Heap Total: ${memoryUsage.heapTotal}`);
      console.log(`   - Heap Used: ${memoryUsage.heapUsed}`);
    }
    return true;
  } catch (error) {
    console.error(`❌ Failed to ping ${MAIN_SERVER_URL}:`, error.message);
    return false;
  }
}

// Schedule a ping every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log("⏰ Scheduled ping task running...");
  await pingMainServer();
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Ping-Pong server running on port ${PORT}`);

  // Initial ping when server starts
  console.log("🔄 Performing initial ping...");
  pingMainServer();
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
