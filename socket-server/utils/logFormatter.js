/**
 * Utility functions for formatting log messages
 */

// Format log message for better display
function formatLogMessage(message) {
  try {
    const parsedMessage =
      typeof message === "string" ? JSON.parse(message) : message;

    // Create a cleanly formatted message
    const formattedMessage = {
      ...parsedMessage,
      formattedTimestamp: new Date(parsedMessage.timestamp).toISOString(),
      statusBadge: getStatusBadge(parsedMessage.status),
      stageBadge: getStageBadge(parsedMessage.stage),
    };

    return formattedMessage;
  } catch (err) {
    console.error(`[BUILD SERVICE] Error formatting message: ${err.message}`);
    return message;
  }
}

// Get status badge based on status
function getStatusBadge(status) {
  switch (status ? status.toUpperCase() : "") {
    case "QUEUED":
      return "QUEUED";
    case "STARTED":
      return "STARTED";
    case "BUILDING":
      return "BUILDING";
    case "INFO":
      return "INFO";
    case "WARNING":
    case "WARN":
      return "WARN";
    case "ERROR":
      return "ERROR";
    case "COMPLETED":
    case "SUCCESS":
      return "SUCCESS";
    default:
      return status ? status.toUpperCase() : "INFO";
  }
}

// Get stage badge based on stage
function getStageBadge(stage) {
  switch (stage ? stage.toLowerCase() : "") {
    case "initialization":
      return "[INIT]";
    case "setup":
      return "[SETUP]";
    case "building":
      return "[BUILD]";
    case "built":
      return "[BUILT]";
    case "uploading":
      return "[DEPLOY]";
    case "completed":
      return "[SUCCESS]";
    case "failed":
      return "[FAILED]";
    default:
      return stage ? `[${stage.toUpperCase()}]` : "[BUILD]";
  }
}

module.exports = {
  formatLogMessage,
  getStatusBadge,
  getStageBadge,
};