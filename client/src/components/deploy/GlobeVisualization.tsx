import React, { useEffect, useState, useRef } from "react";
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
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal container to bottom when new logs arrive
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Initial waiting log
  useEffect(() => {
    if (isDeploying && logs.length === 0) {
      const waitingLog: BuildLog = {
        status: "INFO",
        message: "Waiting for deployment logs...",
        timestamp: new Date().toISOString(),
        stage: "init",
        type: "info",
        statusBadge: "INFO",
        stageBadge: "INIT",
      };
      setLogs([waitingLog]);
    }
  }, [isDeploying, logs.length]);

  // Clean emoji characters and missing glyph placeholders
  const sanitizeText = (str?: string): string => {
    if (!str) return "";
    return str
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
      .replace(/[\uE000-\uF8FF]|\uFFFD/g, "")
      .trim();
  };

  useEffect(() => {
    if (!projectSlug) return;

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
      socketInstance.emit("subscribe", `logs:${projectSlug}`);
    });

    socketInstance.on("message", (message) => {
      try {
        let log = typeof message === "string" ? JSON.parse(message) : message;

        const formattedMessage = sanitizeText(log.message) || "No message provided";
        const rawDetails =
          typeof log.details === "object"
            ? JSON.stringify(log.details, null, 2)
            : log.details?.toString();
        const formattedDetails = sanitizeText(rawDetails);

        log = {
          ...log,
          timestamp: log.timestamp || new Date().toISOString(),
          message: formattedMessage,
          status: log.status || "INFO",
          type: log.type || log.status?.toLowerCase() || "info",
          details: formattedDetails,
          statusBadge: sanitizeText(log.statusBadge) || log.status?.toUpperCase() || "INFO",
          stageBadge: sanitizeText(log.stageBadge) || log.stage?.toUpperCase() || "BUILD",
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
      if (reason === "io server disconnect") {
        socketInstance.connect();
      }
    });

    socketInstance.on("reconnect", () => {
      socketInstance.emit("subscribe", `logs:${projectSlug}`);
    });

    setSocket(socketInstance);

    return () => {
      if (socketInstance) {
        socketInstance.emit("unsubscribe", `logs:${projectSlug}`);
        socketInstance.disconnect();
      }
    };
  }, [projectSlug]);

  return (
    <div className="bg-white/[0.025] w-full rounded-[4px] p-4 shadow-lg border border-white/[0.07]">
      <h3 className="text-2xl font-[450] mb-4 text-white">Deployment logs will appear here</h3>

      {/* Globe Visualization Container */}
      <div className="bg-white/[0.025] w-full aspect-[2/1] h-[500px] flex rounded-[4px] mb-8">
        <div className="w-full flex flex-col h-full">
          <div
            ref={logContainerRef}
            className="rounded-[4px] overflow-y-auto h-full font-mono text-xs p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-800"
          >
            {logs.length === 0 ? (
              <div className="flex-1 h-full flex items-center justify-center text-gray-500">
                No active deployment logs available.
              </div>
            ) : (
              logs.map((log, index) => {
                const cleanMsg = log.message.trim();
                const cleanDet = log.details ? log.details.trim() : "";
                
                // Show details only if it is non-empty and NOT identical to the message
                const showDetails = Boolean(cleanDet && cleanDet !== cleanMsg);

                return (
                  <div
                    key={index}
                    className="py-1 px-1 border-b border-gray-800/40 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-start gap-2 leading-relaxed">
                      {/* Timestamp */}
                      <span className="text-gray-500 shrink-0 select-none">
                        [{new Date(log.timestamp).toLocaleTimeString()}]
                      </span>

                      {/* Status Badge */}
                      {log.statusBadge && (
                        <span className="text-gray-400 font-semibold shrink-0 uppercase">
                          [{log.statusBadge}]
                        </span>
                      )}

                      {/* Stage Badge */}
                      {log.stageBadge && (
                        <span className="text-gray-500 font-semibold shrink-0 uppercase">
                          [{log.stageBadge}]
                        </span>
                      )}

                      {/* Log Message */}
                      <span className="text-gray-300 font-mono whitespace-pre-wrap break-all flex-1">
                        {cleanMsg}
                      </span>
                    </div>

                    {/* Distinct Details Output */}
                    {/* {showDetails && (
                      <pre className="mt-1 ml-16 p-2 bg-black/30 text-gray-400 text-[11px] rounded border-l-2 border-gray-700 whitespace-pre-wrap break-all overflow-x-auto">
                        {cleanDet}
                      </pre>
                    )} */}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobeVisualization;