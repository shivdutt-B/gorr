import React, { useState, useEffect } from "react";

interface DeploymentStatusProps {
  response: DeployResponse | null;
}

export const DeploymentStatus: React.FC<DeploymentStatusProps> = ({
  response,
}) => {
  const [message, setMessage] = useState(
    "Deployment Queued!\nProject creation initiated, deployment in progress\n\nYour project will be live at: loading...\n\nCreated: " +
      new Date().toLocaleString()
  );

  useEffect(() => {
    if (response) {
      setMessage(response.message);
    }
  }, [response]);

  const getStatusColor = () => {
    if (!response) return "text-gray-500";
    return response.status === "success" ? "text-green-500" : "text-red-500";
  };

  return (
    <div className={`p-4 ${getStatusColor()}`}>
      <pre>{message}</pre>
    </div>
  );
};
