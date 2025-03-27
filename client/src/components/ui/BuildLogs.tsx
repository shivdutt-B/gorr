import React, { useRef, useState, useEffect } from "react";

interface BuildLogsProps {
  logs: string[];
  status: "QUEUED" | "STARTED" | "COMPLETED" | "FAILED";
}

export const BuildLogs: React.FC<BuildLogsProps> = ({ logs, status }) => {
  const logsEndRef = useRef<HTMLDivElement>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  useEffect(() => {
    if (isAutoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isAutoScroll]);


  return (
    <div className="bg-gray-900 text-gray-300 rounded-lg p-4 h-96 overflow-auto">
      <div className="mb-2 flex justify-between items-center">
        <div className="font-semibold">Build Status: {status}</div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isAutoScroll}
            onChange={() => setIsAutoScroll(!isAutoScroll)}
            className="mr-2"
          />
          Auto-scroll
        </label>
      </div>
      <div className="font-mono text-sm">
        {logs.length === 0 ? (
          <div className="text-gray-500 italic">Waiting for logs...</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="py-1 border-b border-gray-800">
              {log}
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
};
