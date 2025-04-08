// const http = require("http");
// const io = require("socket.io");
// const { createClient } = require("redis");

// // Create HTTP server and Socket.io instance
// const server = http.createServer();
// const socketIo = io(server);

// // Create Redis client and subscribe to logs
// const redisClient = createClient({
//   url: process.env.REDIS_URL, // Update if Redis is hosted elsewhere
// });

// async function initRedis() {
//   await redisClient.connect();
//   console.log("Connected to Redis...");

//   // Subscribe to all Redis events
//   const subscriber = redisClient.duplicate();
//   subscriber.on('message', (channel, message) => {
//     console.log(`Message received from channel ${channel}:`, message);
//   });
//   await subscriber.connect();

//   await subscriber.subscribe("__redis__:logger", (message) => {
//     console.log("Log received:", message);
//     // Send log to all connected clients
//     socketIo.emit("log", message);
//   });

//   console.log("Subscribed to Redis logs...");
// }

// // Handle socket connection
// socketIo.on("connection", (socket) => {
//   console.log("Client connected:", socket.id);
//   socket.emit("message", "Connected to Redis log stream.");

//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//   });
// });

// // Start server
// const PORT = 3000;
// server.listen(PORT, async () => {
//   console.log(`Socket server running on http://localhost:${PORT}`);
//   await initRedis();
// });
