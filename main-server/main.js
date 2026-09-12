require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { RedisStore } = require("connect-redis");
const heimdall = require("heimdall-nodejs-sdk");

const routes = require("./routes");
const { connectToDatabase } = require("./services/prismaService");
const { publisher } = require("./services/redisService");

const app = express();
const PORT = process.env.PORT || 5000;

// Express trust proxy (required for secure cookies behind proxies like Render/Vercel/Nginx)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Standard middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5174",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Adapter to bridge ioredis syntax with connect-redis v10 expected interface
const redisStoreClientAdapter = {
  get: (key) => publisher.get(key),
  set: (key, val, options) => {
    if (options?.expiration?.type === "EX") {
      return publisher.set(key, val, "EX", options.expiration.value);
    }
    if (options?.expiration?.type === "PX") {
      return publisher.set(key, val, "PX", options.expiration.value);
    }
    return publisher.set(key, val);
  },
  del: (keys) => publisher.del(keys),
  expire: (key, ttl) => publisher.expire(key, ttl),
  mGet: (keys) => publisher.mget(keys),
  scanIterator: async function* ({ MATCH, COUNT }) {
    const stream = publisher.scanStream({ match: MATCH, count: COUNT });
    for await (const resultKeys of stream) {
      yield resultKeys;
    }
  },
};

// Initialize Redis session store with ioredis adapter
const redisStore = new RedisStore({
  client: redisStoreClientAdapter,
  prefix: "sess:",
});

// Session middleware configuration
app.use(
  session({
    store: redisStore,
    name: "sid",
    secret: process.env.SESSION_SECRET || "default_gorr_session_secret_2026",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
    },
  })
);

// Ping monitoring endpoint
heimdall.ping(app);

// Application routes
app.use(routes);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("❌ Unhandled error:", err);
  if (res.headersSent) {
    return _next(err);
  }
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
