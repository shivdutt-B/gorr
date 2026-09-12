import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Terminal } from "lucide-react";

interface GlobeVisualizationProps {
  projectSlug?: string;
  isDeploying?: boolean;
}

interface BuildLog {
  status: string;
  message: string;
  timestamp: string;
  statusBadge?: string;
  type?: string;
}

const GlobeVisualization: React.FC<GlobeVisualizationProps> = ({
  projectSlug,
  isDeploying = false,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [logs, setLogs] = useState<BuildLog[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Helper to sanitize ANSI escape codes, emojis, and unprintable glyphs
  const sanitizeText = (str?: string): string => {
    if (!str) return "";
    return (
      str
        // Strip ANSI escape sequences (e.g. \u001b[32m)
        .replace(/\u001b\[[0-9;]*[a-zA-Z]/g, "")
        // Strip Unicode Emojis
        .replace(
          /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
          "",
        )
        // Strip Private Use & Replacement characters
        .replace(/[\uE000-\uF8FF]|\uFFFD/g, "")
        .trim()
    );
  };

  // Clean raw badge strings (remove any existing square brackets)
  const cleanBadgeStr = (badge?: string): string => {
    if (!badge) return "";
    return sanitizeText(badge)
      .replace(/[\[\]]/g, "")
      .toUpperCase();
  };

  // Initial waiting log setup
  useEffect(() => {
    if (isDeploying && logs.length === 0) {
      const waitingLog: BuildLog = {
        status: "INFO",
        message: "Initializing deployment environment...",
        timestamp: new Date().toISOString(),
        type: "info",
        statusBadge: "INFO",
      };
      setLogs([waitingLog]);
    }
  }, [isDeploying, logs.length]);

  useEffect(() => {
    if (!projectSlug) return;

    const socketUrl =
      import.meta.env.VITE_SOCKET_URL || "http://localhost:7000";
    const socketInstance = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      socketInstance.emit("subscribe", `logs:${projectSlug}`);
    });

    socketInstance.on("message", (message) => {
      try {
        let log = typeof message === "string" ? JSON.parse(message) : message;
        if (typeof log === "string") {
          try {
            log = JSON.parse(log);
          } catch {
            log = { message: log };
          }
        }

        const formattedMessage =
          sanitizeText(log.message) || "No log content provided";

        const statusStr = cleanBadgeStr(
          log.statusBadge || log.status || "INFO",
        );

        const normalizedLog: BuildLog = {
          timestamp: log.timestamp || new Date().toISOString(),
          message: formattedMessage,
          status: log.status || "INFO",
          type: log.type || log.status?.toLowerCase() || "info",
          statusBadge: statusStr,
        };

        // Prepend the new log to the top of the array
        setLogs((prevLogs) => [normalizedLog, ...prevLogs]);
      } catch (error) {
        console.error("Error parsing socket log message:", error);
      }
    });

    socketInstance.on("error", (error) => {
      console.error("Socket connection error:", error);
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

  const getStatusBadgeStyle = (statusBadge?: string) => {
    switch (statusBadge) {
      case "SUCCESS":
      case "COMPLETED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "ERROR":
      case "FAILED":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "WARN":
      case "WARNING":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "BUILDING":
      case "STARTED":
      case "QUEUED":
        return "bg-sky-500/10 text-sky-400 border-sky-500/30";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700/50";
    }
  };

  return (
    <div
      ref={logContainerRef}
      className="bg-white/[0.025] w-full h-[500px] rounded-[4px] shadow-lg border border-white/[0.07] overflow-y-auto text-xs p-2 space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent"
    >
      {logs.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center select-none">
          <div className="flex flex-col items-center gap-3">
            <Terminal className="h-10 w-10 text-zinc-600" />
            <p className="text-lg text-zinc-500 font-medium">
              Deployment logs will appear here
            </p>
          </div>
        </div>
      ) : (
        logs.map((log, index) => {
          const cleanMsg = log.message.trim();

          return (
            <div key={index} className="group py-1 px-2 text-mono border-b border-white/[0.03] last:border-b-0">
              <div className="flex items-center gap-2.5 leading-relaxed">
                {/* Timestamp */}
                <span className="text-zinc-500 shrink-0 select-none text-sm">
                  {new Date(log.timestamp).toLocaleTimeString([], {
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>

                {/* Status Badge */}
                {log.statusBadge && (
                  <span
                    className={`px-1.5 py-0.5 text-xs tracking-wider rounded font-semibold uppercase shrink-0 border ${getStatusBadgeStyle(
                      log.statusBadge,
                    )}`}
                  >
                    {log.statusBadge}
                  </span>
                )}
              </div>
              {/* Log Message */}
              <div className="text-zinc-200 whitespace-pre-wrap break-all flex-1 text-xs font-mono py-2">
                {cleanMsg}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default GlobeVisualization;