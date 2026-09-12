/**
 * Utility functions for formatting log messages
 */

// Helper to strip ANSI escape codes, emojis, and unprintable glyphs
function sanitizeLogText(str) {
  if (!str || typeof str !== "string") return str || "";
  return str
    // Strip ANSI escape sequences (e.g. \u001b[32m)
    .replace(/\u001b\[[0-9;]*[a-zA-Z]/g, "")
    // Strip Unicode Emojis
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    // Strip Private Use & Replacement characters
    .replace(/[\uE000-\uF8FF]|\uFFFD/g, "")
    .trim();
}

// Format log message for better display
function formatLogMessage(message) {
  try {
    let parsedMessage = typeof message === "string" ? JSON.parse(message) : message;

    if (typeof parsedMessage === "string") {
      parsedMessage = { message: parsedMessage };
    }

    const cleanMsg = sanitizeLogText(parsedMessage.message || "");
    const status = parsedMessage.status ? parsedMessage.status.toUpperCase() : "INFO";

    const formattedMessage = {
      projectId: parsedMessage.projectId,
      timestamp: parsedMessage.timestamp || new Date().toISOString(),
      formattedTimestamp: new Date(parsedMessage.timestamp || Date.now()).toISOString(),
      type: parsedMessage.type || "info",
      status,
      statusBadge: getStatusBadge(status),
      message: cleanMsg,
    };

    return formattedMessage;
  } catch (err) {
    console.error(`[SOCKET SERVER] Error formatting message: ${err.message}`);
    return message;
  }
}

// Get status badge based on status
function getStatusBadge(status) {
  const cleanStatus = status ? status.toUpperCase().replace(/[\[\]]/g, "") : "";
  switch (cleanStatus) {
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
      return cleanStatus || "INFO";
  }
}

module.exports = {
  sanitizeLogText,
  formatLogMessage,
  getStatusBadge,
};