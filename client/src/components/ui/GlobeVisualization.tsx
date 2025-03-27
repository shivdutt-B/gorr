import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface GlobeVisualizationProps {
  onImportRepo: () => void;
  projectSlug?: string;
}

interface BuildLog {
  status: string;
  message: string;
  details?: string;
  timestamp: string;
  stage?: string;
  statusBadge?: string;
  stageBadge?: string;
}

const GlobeVisualization: React.FC<GlobeVisualizationProps> = ({
  onImportRepo,
  projectSlug,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [logs, setLogs] = useState<BuildLog[]>([]);

  useEffect(() => {
    if (!projectSlug) return;

    // Initialize socket connection
    const socketInstance = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:9002", {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      console.log("Connected to socket server");
      // Subscribe to the project's log channel
      socketInstance.emit("subscribe", `logs:${projectSlug}`);
    });

    socketInstance.on("message", (log: BuildLog) => {
      setLogs((prevLogs) => [...prevLogs, log]);
    });

    socketInstance.on("error", (error) => {
      console.error("Socket error:", error);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
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
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-500 text-xs">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    {log.statusBadge && (
                      <span className="text-blue-400 px-2 py-0.5 bg-blue-900/30 rounded-md text-xs">
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

      {/* <div className="flex flex-col items-center gap-3">
        <button
          onClick={onImportRepo}
          className="text-gray-400 hover:text-blue-300 transition-colors text-sm flex items-center gap-1 px-4 py-2 rounded-md hover:bg-[#1a1a1a]"
        >
          <span>Import a different Git Repository</span>
          <span className="ml-1">→</span>
        </button>
      </div> */}
    </div>
  );
};

export default GlobeVisualization;
