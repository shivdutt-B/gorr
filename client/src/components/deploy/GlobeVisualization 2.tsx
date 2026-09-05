import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Add type declaration for import.meta.env
interface ImportMeta {
  env: {
    VITE_SOCKET_URL?: string;
  };
}

interface GlobeVisualizationProps {
  projectSlug?: string;
  isDeploying?: boolean;
}

interface BuildLog {
  status: string;
  message: string;
  details?: string;
  timestamp: string;
  stage?: string;
  statusBadge?: string;
  stageBadge?: string;
  type?: string;
}

const GlobeVisualization: React.FC<GlobeVisualizationProps> = ({
  projectSlug,
  isDeploying = false,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [logs, setLogs] = useState<BuildLog[]>([]);

  // Add waiting for logs message when deploy is clicked
  useEffect(() => {
    if (isDeploying && logs.length === 0) {
      const waitingLog: BuildLog = {
        status: "pending",
        message: "⏰Waiting for deployment logs...",
        timestamp: new Date().toISOString(),
        stage: "init",
        type: "info",
      };
      setLogs([waitingLog]);
    }
  }, [isDeploying, logs.length]);

  const getStatusEmoji = (status: string): string => {
    switch (status.toLowerCase()) {
      case "success":
        return "✅ ";
      case "error":
        return "❌ ";
      case "warning":
        return "⚠️ ";
      case "info":
        return "ℹ️ ";
      case "pending":
        return "⏳ ";
      case "running":
        return "🔄 ";
      case "complete":
        return "🎉 ";
      default:
        return "📝 ";
    }
  };

  const getStageStyle = (stage?: string): { emoji: string; color: string } => {
    if (!stage) return { emoji: "🔍", color: "text-gray-400" };

    switch (stage.toLowerCase()) {
      case "build":
        return { emoji: "🏗️", color: "text-blue-400" };
      case "deploy":
        return { emoji: "🚀", color: "text-green-400" };
      case "test":
        return { emoji: "🧪", color: "text-purple-400" };
      case "install":
        return { emoji: "📦", color: "text-yellow-400" };
      case "compile":
        return { emoji: "⚙️", color: "text-orange-400" };
      case "lint":
        return { emoji: "🧹", color: "text-pink-400" };
      case "init":
        return { emoji: "🔰", color: "text-teal-400" };
      case "cleanup":
        return { emoji: "🧼", color: "text-indigo-400" };
      default:
        return { emoji: "🔹", color: "text-gray-400" };
    }
  };

  useEffect(() => {
    if (!projectSlug) return;

    // Initialize socket connection using environment variable with fallback
    const socketInstance = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:7000",
      {
        withCredentials: true,
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      }
    );

    socketInstance.on("connect", () => {
      // Subscribe to the project's log channel
      socketInstance.emit("subscribe", `logs:${projectSlug}`);
    });

    socketInstance.on("message", (message) => {
      try {
        // Parse the message if it's a string
        let log = typeof message === "string" ? JSON.parse(message) : message;

        // Format the log object
        log = {
          ...log,
          timestamp: log.timestamp || new Date().toISOString(),
          message: log.message?.trim() || "No message provided",
          status: log.status || "info",
          type: log.type || log.status?.toLowerCase() || "info",
          details:
            typeof log.details === "object"
              ? JSON.stringify(log.details, null, 2)
              : log.details?.toString()?.trim(),
          statusBadge:
            log.statusBadge?.trim() ||
            `${getStatusEmoji(log.status)} ${log.status?.toUpperCase()}`,
          stageBadge:
            log.stageBadge?.trim() ||
            (log.stage
              ? `${getStageStyle(log.stage).emoji} ${log.stage}`
              : undefined),
        };

        setLogs((prevLogs) => [...prevLogs, log]);
      } catch (error) {
        console.error("Error parsing log message:", error);
      }
    });

    socketInstance.on("error", (error) => {
      console.error("Socket error:", error);
    });

    socketInstance.on("disconnect", (reason) => {
      // Attempt to reconnect if disconnected unexpectedly
      if (reason === "io server disconnect") {
        socketInstance.connect();
      }
    });

    socketInstance.on("reconnect", (attemptNumber) => {
      // Resubscribe to the channel after reconnection
      socketInstance.emit("subscribe", `logs:${projectSlug}`);
    });

    // Listen for build logs
    socketInstance.on("build-log", (log: BuildLog) => {
      const getStageEmoji = (stage?: string): string => {
        switch (stage?.toLowerCase()) {
          case "building":
            return "🏗️ ";
          case "initialization":
            return "🚀 ";
          case "completed":
            return "✨ ";
          default:
            return "📝 ";
        }
      };

      const formattedLog = {
        ...log,
        message: `${getStageEmoji(log.stage)}${log.message}`,
      };

      setLogs((prevLogs) => [...prevLogs, formattedLog]);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        socketInstance.emit("unsubscribe", `logs:${projectSlug}`);
        socketInstance.disconnect();
      }
    };
  }, [projectSlug]);

  return (
    <div className="bg-[#0a0a0a] w-full rounded-lg p-8 mt-8 shadow-lg border border-gray-800">
      <h3 className="text-2xl font-bold mb-4 text-white">Deployment</h3>

      {/* Globe Visualization */}
      <div className="w-full aspect-[2/1] h-[500px] flex bg-[#1a1a1a] rounded-lg p-4 mb-8">
        <div className="w-full   flex flex-col h-full">
          <div className="bg-[#1a1a1a] rounded-lg overflow-y-auto h-full">
            {logs.length === 0 ? (
              <div className="flex-1 h-full flex items-center justify-center">
                <svg viewBox="0 0 200 100" className="w-full h-full opacity-40">
                  <ellipse
                    cx="100"
                    cy="50"
                    rx="80"
                    ry="40"
                    stroke="white"
                    fill="none"
                    strokeWidth="0.5"
                  />
                  <ellipse
                    cx="100"
                    cy="50"
                    rx="80"
                    ry="40"
                    stroke="white"
                    fill="none"
                    strokeWidth="0.5"
                    transform="rotate(30 100 50)"
                  />
                  <ellipse
                    cx="100"
                    cy="50"
                    rx="80"
                    ry="40"
                    stroke="white"
                    fill="none"
                    strokeWidth="0.5"
                    transform="rotate(60 100 50)"
                  />
                  <ellipse
                    cx="100"
                    cy="50"
                    rx="80"
                    ry="40"
                    stroke="white"
                    fill="none"
                    strokeWidth="0.5"
                    transform="rotate(90 100 50)"
                  />
                </svg>
              </div>
            ) : (
              [...logs].reverse().map((log, index) => (
                <div
                  key={index}
                  className="mb-4 p-3 border-b border-gray-800 text-sm"
                >
                  <div className="flex flex-col mob:flex-row mob:items-center gap-2 mb-1">
                    <span className="text-gray-500 text-xs">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    {log.statusBadge && (
                      <span
                        className={`px-2 py-0.5 ${
                          log.type?.toLowerCase() === "error"
                            ? "bg-red-900/30 text-red-400"
                            : log.type?.toLowerCase() === "warning"
                            ? "bg-yellow-900/30 text-yellow-400"
                            : "bg-blue-900/30 text-blue-400"
                        } rounded-md text-xs`}
                      >
                        {log.statusBadge}
                      </span>
                    )}
                    {log.stageBadge && (
                      <span className="text-purple-400 px-2 py-0.5 bg-purple-900/30 rounded-md text-xs">
                        {log.stageBadge}
                      </span>
                    )}
                  </div>
                  <div className="text-gray-300 font-medium">{log.message}</div>
                  {log.details && (
                    <div className="text-gray-500 mt-2 ml-2 p-2 bg-gray-800/30 rounded border-l-2 border-gray-700 text-xs">
                      {log.details}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobeVisualization;
