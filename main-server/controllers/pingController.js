/**
 * Controller to handle ping requests to keep the server active
 */

/**
 * Handle ping requests to the server
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const pingHandler = (req, res) => {
  try {
    // Get server stats
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    const currentTime = new Date().toISOString();

    // Return success with some basic server info
    return res.status(200).json({
      status: "success",
      message: "Server is active",
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
      },
    });
  } catch (error) {
    console.error("Error handling ping request:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = {
  pingHandler,
};
