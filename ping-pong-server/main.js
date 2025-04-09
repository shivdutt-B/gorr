require("dotenv").config();
const express = require("express");
const axios = require("axios");

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

// Store ping results for display
const pingResults = {
  mainServer: {
    status: "Unknown",
    responseTime: 0,
    lastPing: null,
    url: MAIN_SERVER_URL,
    successCount: 0,
    failureCount: 0,
    uptime: "0%",
    resourceUsage: "N/A",
  },
  proxyServer: {
    status: "Unknown",
    responseTime: 0,
    lastPing: null,
    url: PROXY_SERVER_URL,
    successCount: 0,
    failureCount: 0,
    uptime: "0%",
    resourceUsage: "N/A",
  },
  socketServer: {
    status: "Unknown",
    responseTime: 0,
    lastPing: null,
    url: SOCKET_SERVER_URL,
    successCount: 0,
    failureCount: 0,
    uptime: "0%",
    resourceUsage: "N/A",
  },
};

// Basic health check endpoint for this server
app.get("/", (req, res) => {
  res.status(200).json({
    status: "active",
    message: "Ping-Pong server is running",
    lastPing: new Date().toISOString(),
    pingResults,
  });
});

// Ping endpoint to keep the server active
// ping endpoint for ping-pong server also.
app.get("/ping", (req, res) => {
  console.log("═════════════ Ping Handler ═════════════");

  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  const currentTime = new Date().toISOString();

  const minutes = Math.floor(uptime / 60);
  const seconds = Math.floor(uptime % 60);

  return res.status(200).json({
    status: "success",
    message: "Ping-Pong Server is active",
    data: {
      serverTime: currentTime,
      uptime: `${minutes} minutes, ${seconds} seconds`,
      memoryUsage: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
      },
      pingResults,
    },
  });
});

/**
 * Function to ping a server
 * @param {string} serverUrl - URL of the server to ping
 * @param {string} serverName - Name of the server
 * @param {string} resultKey - Key to store results in pingResults object
 * @returns {Promise<boolean>} - Success or failure of ping
 */
async function pingServer(serverUrl, serverName, resultKey) {
  try {
    const startTime = Date.now();
    const response = await axios.get(serverUrl);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const timestamp = new Date().toISOString();

    // Update ping results
    pingResults[resultKey].status = "Success";
    pingResults[resultKey].responseTime = responseTime;
    pingResults[resultKey].lastPing = timestamp;
    pingResults[resultKey].successCount += 1;

    // Extract message usage data if available
    if (response.data && response.data.data) {
      if (response.data.data.socketConnections) {
        pingResults[
          resultKey
        ].resourceUsage = `${response.data.data.socketConnections} connections`;
      } else if (response.data.data.memoryUsage) {
        pingResults[resultKey].resourceUsage =
          response.data.data.memoryUsage.heapUsed || "N/A";
      }
    }

    // Calculate uptime percentage
    const totalAttempts =
      pingResults[resultKey].successCount + pingResults[resultKey].failureCount;
    pingResults[resultKey].uptime =
      totalAttempts > 0
        ? `${Math.round(
            (pingResults[resultKey].successCount / totalAttempts) * 100
          )}%`
        : "0%";

    return true;
  } catch (error) {
    // Update ping results with error
    pingResults[resultKey].status = "Failed";
    pingResults[resultKey].responseTime = 0;
    pingResults[resultKey].lastPing = new Date().toISOString();
    pingResults[resultKey].error = error.message;
    pingResults[resultKey].failureCount += 1;
    pingResults[resultKey].resourceUsage = "N/A";

    // Calculate uptime percentage
    const totalAttempts =
      pingResults[resultKey].successCount + pingResults[resultKey].failureCount;
    pingResults[resultKey].uptime =
      totalAttempts > 0
        ? `${Math.round(
            (pingResults[resultKey].successCount / totalAttempts) * 100
          )}%`
        : "0%";

    return false;
  }
}

/**
 * Function to ping all servers
 * @returns {Promise<void>}
 */
async function pingAllServers() {
  console.log("┌─────────────────────────────────────┐");
  console.log("│         Starting Server Pings       │");
  console.log("└─────────────────────────────────────┘");

  await Promise.all([
    pingServer(MAIN_SERVER_URL, "Main Server", "mainServer"),
    pingServer(PROXY_SERVER_URL, "Proxy Server", "proxyServer"),
    pingServer(SOCKET_SERVER_URL, "Socket Server", "socketServer"),
  ]);

  // Display results in tabular format
  console.table(pingResults);

  console.log("─────────────────────────────────────────");
}

// Schedule a ping every 5 minutes
setInterval(async () => {
  console.log("⏰ Scheduled ping task running...");
  await pingAllServers();
}, 300000); // 5 minutes = 300,000 milliseconds

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Ping-Pong server running on port ${PORT}`);

  // Initial ping when server starts
  console.log("🔍 Performing initial ping...");
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
