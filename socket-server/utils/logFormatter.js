/**
 * Utility functions for formatting log messages
 */

// Format log message for better display
function formatLogMessage(message) {
  try {
    const parsedMessage =
      typeof message === "string" ? JSON.parse(message) : message;

    // Create a beautifully formatted message
    const formattedMessage = {
      ...parsedMessage,
      formattedTimestamp: new Date(parsedMessage.timestamp).toLocaleString(),
      statusBadge: getStatusBadge(parsedMessage.status),
      stageBadge: getStageBadge(parsedMessage.stage),
    };

    return formattedMessage;
  } catch (err) {
    console.error(`❗ Error formatting message: ${err.message}`);
    return message;
  }
}

// Get status badge based on status
function getStatusBadge(status) {
  switch (status) {
    case "QUEUED":
      return "⏳ QUEUED";
    case "STARTED":
      return "🚀 STARTED";
    case "BUILDING":
      return "🔨 BUILDING";
    case "INFO":
      return "ℹ️ INFO";
    case "WARNING":
      return "⚠️ WARNING";
    case "ERROR":
      return "❌ ERROR";
    case "COMPLETED":
      return "✅ COMPLETED";
    default:
      return status;
  }
}

// Get stage badge based on stage
function getStageBadge(stage) {
  switch (stage) {
    case "initialization":
      return "🏁 Initialization";
    case "setup":
      return "🔧 Setup";
    case "building":
      return "🏗️ Building";
    case "built":
      return "📦 Built";
    case "uploading":
      return "📤 Uploading";
    case "completed":
      return "🎉 Completed";
    case "failed":
      return "💥 Failed";
    default:
      return stage;
  }
}

module.exports = {
  formatLogMessage,
  getStatusBadge,
  getStageBadge,
};
