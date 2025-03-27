/*
 * Redis Service Module
 *
 * This module provides functionality for Redis pub/sub messaging, primarily used for real-time build logs.
 *
 * Key components:
 *
 * 1. Connection Setup:
 *    - Creates two Redis clients (publisher and subscriber) using ioredis
 *    - Configures connection using environment variables (REDIS_URL)
 *    - Implements retry strategy with exponential backoff (50ms to 2000ms)
 *    - Sets up event listeners for connection management
 *
 * 2. Publisher Functionality:
 *    - The publishLog() function sends messages to Redis channels
 *    - Each project has its own channel named "logs:{projectId}"
 *    - Messages are JSON-serialized before publishing
 *    - Includes error handling and validation
 *
 * 3. Subscriber Functionality:
 *    - The subscribeToLogs() function listens for messages on a project channel
 *    - Takes a callback function that processes incoming messages
 *    - Automatically parses JSON messages
 *    - Returns an unsubscribe function for cleanup
 *
 * Usage:
 *   - Used by build controllers to send real-time updates about build status
 *   - Allows clients to subscribe to build logs for specific projects
 *   - Provides a clean way to handle pub/sub messaging with proper cleanup
 */

const Redis = require("ioredis");
require("dotenv").config();

// Use environment variables instead of hardcoded credentials
const redisUrl = process.env.REDIS_URL;

// Setup Redis client with retry strategy
const publisher = new Redis(redisUrl, {
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    console.log(`🔄 Redis connection attempt ${times}, retrying in ${delay}ms`);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

// Add event listeners for connection management
publisher.on("connect", () => {
  console.log("✅ Successfully connected to Redis");
});

publisher.on("error", (err) => {
  console.error("❗ Redis connection error:", err);
});

// Create a separate subscriber instance
const subscriber = new Redis(redisUrl, {
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    console.log(
      `🔄 Redis subscriber connection attempt ${times}, retrying in ${delay}ms`
    );
    return delay;
  },
  maxRetriesPerRequest: 3,
});

subscriber.on("connect", () => {
  console.log("✅ Successfully connected to Redis subscriber");
});

subscriber.on("error", (err) => {
  console.error("❗ Redis subscriber connection error:", err);
});


const publishLog = async (projectId, log) => {
  if (!projectId) {
    console.error("Project ID is required for Redis channel");
    throw new Error("Project ID is required");
  }

  try {
    await publisher.publish(`logs:${projectId}`, JSON.stringify(log));
    return true;
  } catch (error) {
    console.error("❗ Error publishing log:", error);
    return false;
  }
};

const subscribeToLogs = (projectId, callback) => {
  const subscriberClient = new Redis(process.env.REDIS_URL);

  subscriberClient.subscribe(`logs:${projectId}`, (err) => {
    if (err) {
      console.error("❗ Error subscribing to logs:", err);
      return;
    }
  });

  subscriberClient.on("message", (channel, message) => {
    try {
      const log = JSON.parse(message);
      callback(log);
    } catch (error) {
      console.error("❗ Error parsing log message:", error);
    }
  });

  // Add unsubscribe method to the subscriber
  subscriberClient.unsubscribe = async () => {
    try {
      // Check if the connection is still active before trying to unsubscribe
      if (subscriberClient.status === "ready") {
        await subscriberClient.unsubscribe(`logs:${projectId}`);
      }

      // Check if the connection is still active before trying to quit
      if (subscriberClient.status === "ready") {
        await subscriberClient.quit();
      }
    } catch (error) {
      console.error("❗ Error unsubscribing:", error);
    }
  };

  return subscriberClient;
};

// Update exports to include subscribeToLogs
module.exports = { publishLog, publisher, subscribeToLogs };
