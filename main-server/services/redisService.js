const Redis = require("ioredis");
require("dotenv").config();

const redisUrl = process.env.REDIS_URL;

/**
 * Creates a configured Redis client instance with exponential backoff retry.
 * @param {string} name - Connection label for logging
 * @returns {Redis} Configured ioredis client
 */
const createRedisClient = (name = "publisher") => {
  if (!redisUrl) {
    throw new Error("REDIS_URL is required in environment variables");
  }

  const client = new Redis(redisUrl, {
    retryStrategy: (times) => {
      if (times > 5) {
        console.error(`❌ ${name}: Max retry attempts reached.`);
        return null;
      }
      return Math.min(times * 50, 2000);
    },
    maxRetriesPerRequest: 3,
    enableOfflineQueue: false,
    connectionName: name,
  });

  client.on("connect", () => console.log(`✅ Connected to Redis (${name})`));
  client.on("error", (err) => console.error(`❗ Redis (${name}) error:`, err.message));
  client.on("close", () => console.log(`📡 Redis connection closed (${name})`));

  return client;
};

// Global publisher client instance
let publisher;
try {
  publisher = createRedisClient("publisher");
} catch (error) {
  console.error("❌ Failed to initialize Redis publisher:", error.message);
}

/**
 * Synchronously checks if the primary Redis publisher client is currently ready.
 * @returns {boolean}
 */
const isRedisConnected = () => {
  return Boolean(publisher && publisher.status === "ready");
};

/**
 * Waits for a Redis client to transition to "ready" status, or rejects on timeout.
 * @param {Redis} client
 * @param {number} timeoutMs
 * @returns {Promise<void>}
 */
const waitForRedisConnection = (client = publisher, timeoutMs = 3000) => {
  if (client?.status === "ready") return Promise.resolve();
  if (!client) return Promise.reject(new Error("Redis client not initialized"));

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("Redis connection timed out"));
    }, timeoutMs);

    const onReady = () => {
      cleanup();
      resolve();
    };

    const onError = (err) => {
      if (client.status === "end") {
        cleanup();
        reject(err || new Error("Redis connection failed"));
      }
    };

    const cleanup = () => {
      clearTimeout(timer);
      client.off("ready", onReady);
      client.off("error", onError);
    };

    client.on("ready", onReady);
    client.on("error", onError);
  });
};

/**
 * Ensures Redis is connected before performing operations, waiting briefly if reconnecting.
 * @param {number} timeoutMs
 * @returns {Promise<boolean>}
 */
const checkRedisConnection = async (timeoutMs = 2000) => {
  if (isRedisConnected()) return true;
  try {
    await waitForRedisConnection(publisher, timeoutMs);
    return isRedisConnected();
  } catch {
    return false;
  }
};

/**
 * Publishes a structured log event to the project's Redis log channel.
 * @param {string} projectId - Project slug
 * @param {Object} log - Log payload object
 */
const publishLog = async (projectId, log) => {
  if (!projectId) throw new Error("Project ID is required");
  if (!isRedisConnected()) return false;

  try {
    await publisher.publish(`logs:${projectId}`, JSON.stringify(log));
    return true;
  } catch (error) {
    console.error("❗ Error publishing log:", error.message);
    return false;
  }
};

/**
 * Subscribes to build log events for a specific project.
 * @param {string} projectId - Project slug
 * @param {Function} callback - Function receiving parsed log objects
 * @returns {Redis} Subscriber client with custom cleanup unsubscribe() method
 */
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
        } else {
          isSubscribed = true;
        }
      });
    }
  });

  subscriberClient.on("message", (_channel, message) => {
    try {
      callback(JSON.parse(message));
    } catch (error) {
      console.error("❗ Error parsing log message:", error.message);
    }
  });

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

module.exports = {
  checkRedisConnection,
  isRedisConnected,
  publishLog,
  publisher,
  subscribeToLogs,
  waitForRedisConnection,
};
