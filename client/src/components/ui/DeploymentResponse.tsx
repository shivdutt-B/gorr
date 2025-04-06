import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DeploymentResponseProps {
  isDeploying: boolean;
  isQueued: boolean;
  queuedTimestamp?: string | Date | null;
  error?: Error | null | any;
  deploymentData?: {
    status: string;
    message: string;
    data?: {
      projectSlug?: string;
      url?: string;
      project?: {
        id: number;
        slug: string;
        gitUrl: string;
        userId: number;
        createdAt: string;
      };
    };
    error?: string;
  } | null;
}

const DeploymentResponse: React.FC<DeploymentResponseProps> = ({
  isDeploying,
  isQueued,
  queuedTimestamp,
  error,
  deploymentData,
}) => {
  // Track when a new deployment starts to clear previous UI state
  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
    // When deployment starts, reset the UI
    if (isDeploying && isQueued) {
      setShowResponse(true);
    }

    // If there's no deployment activity and no data to show, hide the response
    if (!isDeploying && !isQueued && !error && !deploymentData?.data?.url) {
      setShowResponse(false);
      console.log("URL: ", deploymentUrl);
    }
  }, [isDeploying, isQueued, error, deploymentData]);

  const getErrorMessage = (error: any): string => {
    if (!error) return "An unknown error occurred";

    if (typeof error === "string") return error;
    if (error.message) return error.message;
    if (error.response?.data?.message) return error.response.data.message;
    if (error.response?.data) return error.response.data;

    return "An unexpected error occurred during deployment";
  };

  console.log("Deployment Data: ", deploymentData);
  const deploymentUrl = deploymentData?.data?.url;
  const projectDetails = deploymentData?.data?.project;
  const formattedTimestamp = queuedTimestamp
    ? queuedTimestamp instanceof Date
      ? queuedTimestamp.toLocaleString()
      : new Date(queuedTimestamp).toLocaleString()
    : null;

  return (
    <AnimatePresence>
      {showResponse && (isDeploying || error || deploymentData) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="mt-6 overflow-hidden rounded-lg"
        >
          {error && (
            <div className="bg-red-900/20 border border-red-900/50 text-red-500 p-4 rounded-md">
              <h4 className="font-semibold mb-1">Deployment Failed</h4>
              <p className="text-sm">{getErrorMessage(error)}</p>
            </div>
          )}

          {isQueued && !error && (
            <div className="bg-blue-900/20 border border-blue-900/50 text-blue-500 p-4 rounded-md">
              <h4 className="font-semibold mb-1">Deployment Queued!</h4>
              <p className="text-sm mb-2">
                {deploymentData?.message ||
                  "Project creation initiated, deployment in progress"}
              </p>
              <div className="text-sm space-y-2">
                <p>Your project will be live at: loading...</p>
                {formattedTimestamp && <p>Created: {formattedTimestamp}</p>}
              </div>
            </div>
          )}

          {isDeploying && !isQueued && (
            <div className="bg-[#1A1A1A] p-4 rounded-md">
              <div className="flex items-center space-x-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span className="text-gray-300">
                  {deploymentData?.message || "Deploying your project..."}
                </span>
              </div>
            </div>
          )}

          {deploymentUrl && !isDeploying && !error && !isQueued && (
            <div className="bg-green-900/20 border border-green-900/50 text-green-500 p-4 rounded-md">
              <h4 className="font-semibold mb-1">Deployment Successful!</h4>
              <p className="text-sm mb-2">
                {deploymentData?.message ||
                  "Project deployment completed successfully"}
              </p>
              <div className="text-sm space-y-2">
                <p className=" rounded-md">
                  Your project is live at:{" "}
                  <a
                    href={deploymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono bg-green-900/30 px-2 py-1 rounded text-green-400 hover:text-green-300 transition-colors"
                  >
                    {deploymentUrl}
                  </a>
                </p>
                {formattedTimestamp && <p>Created: {formattedTimestamp}</p>}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeploymentResponse;
