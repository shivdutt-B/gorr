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

const waitForRedisConnection = async (client, maxRetries = 10, retryDelay = 1000) => {
  let retries = 0;
  return new Promise((resolve, reject) => {
    if (client.status === "ready") return resolve();
    const onConnect = () => {
      client.off("error", onError);
      resolve();
    };
    const onError = (err) => {
      retries++;
      if (retries >= maxRetries) {
        client.off("connect", onConnect);
        reject(new Error("Could not connect to Redis after max retries"));
      } else {
        setTimeout(() => {
          if (client.status === "ready") {
            client.off("error", onError);
            resolve();
          }
        }, retryDelay);
      }
    };
    client.once("connect", onConnect);
    client.on("error", onError);
  });
};

// Setup Redis client with improved retry strategy and error handling
const createRedisClient = (name = "publisher") => {
  if (!redisUrl) {
    console.error(
      `❌ Redis URL is not configured. Please check your environment variables.`
    );
    throw new Error("Redis URL is required");
  }

  const client = new Redis(redisUrl, {
    retryStrategy: (times) => {
      // Maximum retry attempts (e.g., 5 times)
      const maxRetryAttempts = 5;

      if (times > maxRetryAttempts) {
        console.error(
          `❌ ${name}: Max retry attempts (${maxRetryAttempts}) reached. Giving up.`
        );
        return null; // Stop retrying
      }

      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
    enableOfflineQueue: false, // Don't queue commands when disconnected
    connectionName: name,
  });

  client.on("connect", () => {
    console.log(`✅ Successfully connected to Redis (${name})`);
  });

  client.on("error", (err) => {
    console.error(`❗ Redis ${name} connection error:`, err.message);
    if (err.code === "ENOTFOUND") {
      console.error(
        `❗ Could not resolve Redis host. Please check your REDIS_URL configuration.`
      );
    }
  });

  client.on("close", () => {
    console.log(`📡 Redis connection closed (${name})`);
  });

  return client;
};

// Create Redis clients
let publisher;
let subscriber;

try {
  publisher = createRedisClient("publisher");
  subscriber = createRedisClient("subscriber");
} catch (error) {
  console.error("❌ Failed to initialize Redis clients:", error.message);
  // You might want to implement a fallback mechanism here
}

const publishLog = async (projectId, log) => {
  if (!projectId) {
    console.error("Project ID is required for Redis channel");
    throw new Error("Project ID is required");
  }

  // If Redis is not ready, also send a special error log for build controller to catch
  if (!publisher || publisher.status !== "ready") {
    console.error("Redis publisher is not ready");
    // Attempt to send a fallback error log to the build log handler
    // This is a no-op if Redis is truly down, but allows for local error handling
    try {
      if (log && log.status !== "ERROR") {
        await publisher?.publish?.(
          `logs:${projectId}`,
          JSON.stringify({
            status: "ERROR",
            message: "Could not connect to Redis. Could not deploy your project.",
            details: "Redis publisher is not ready",
            timestamp: new Date().toISOString(),
            projectId,
            stage: "failed",
          })
        );
      }
    } catch (e) {}
    return false;
  }

  try {
    await publisher.publish(`logs:${projectId}`, JSON.stringify(log));
    return true;
  } catch (error) {
    console.error("❗ Error publishing log:", error.message);
    // Attempt to send a fallback error log
    try {
      await publisher.publish(
        `logs:${projectId}`,
        JSON.stringify({
          status: "ERROR",
          message: "Could not connect to Redis. Could not deploy your project.",
          details: error.message,
          timestamp: new Date().toISOString(),
          projectId,
          stage: "failed",
        })
      );
    } catch (e) {}
    return false;
  }
};

const subscribeToLogs = (projectId, callback) => {
  if (!projectId || !callback) {
    throw new Error("Project ID and callback are required");
  }

  const subscriberClient = createRedisClient(`subscriber-${projectId}`);
  let isSubscribed = false;

  subscriberClient.on("ready", () => {
    if (!isSubscribed) {
      subscriberClient.subscribe(`logs:${projectId}`, (err) => {
        if (err) {
          console.error("❗ Error subscribing to logs:", err.message);
          return;
        }
        isSubscribed = true;
      });
    }
  });

  subscriberClient.on("message", (channel, message) => {
    try {
      const log = JSON.parse(message);
      callback(log);
    } catch (error) {
      console.error("❗ Error parsing log message:", error.message);
    }
  });

  // Enhanced unsubscribe method
  subscriberClient.unsubscribe = async () => {
    try {
      if (isSubscribed) {
        await subscriberClient.unsubscribe(`logs:${projectId}`);
        isSubscribed = false;
      }

      if (subscriberClient.status === "ready") {
        await subscriberClient.quit();
      }
    } catch (error) {
      console.error("❗ Error unsubscribing:", error.message);
    }
  };

  return subscriberClient;
};

// Update exports to include subscribeToLogs
module.exports = { publishLog, publisher, subscribeToLogs, waitForRedisConnection };
