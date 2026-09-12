import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectDetails {
  id: number;
  slug: string;
  gitUrl: string;
  userId: number;
  createdAt: string;
}

interface DeploymentData {
  status: string;
  message: string;
  data?: {
    projectSlug?: string;
    url?: string;
    project?: ProjectDetails;
    isAngularProject?: boolean;
    projectName?: string | null;
  };
  error?: string;
}

interface DeploymentResponseProps {
  isDeploying: boolean;
  isQueued: boolean;
  queuedTimestamp?: string | Date | null;
  error?: unknown;
  deploymentData?: DeploymentData | null;
}

/**
 * Extracts a user-friendly error string from various error payload formats.
 */
const getErrorMessage = (error: unknown): string => {
  if (!error) return "An unknown error occurred";
  if (typeof error === "string") return error;
  if (typeof error === "object") {
    const err = error as Record<string, any>;
    if (err.response?.data?.message) return String(err.response.data.message);
    if (err.response?.data && typeof err.response.data === "string") return err.response.data;
    if (err.message && typeof err.message === "string") return err.message;
  }
  return "An unexpected error occurred during deployment";
};

/**
 * Formats a queue/deployment timestamp into a localized string.
 */
const formatTimestamp = (timestamp?: string | Date | null): string | null => {
  if (!timestamp) return null;
  try {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return isNaN(date.getTime()) ? null : date.toLocaleString();
  } catch {
    return null;
  }
};

const DeploymentResponse: React.FC<DeploymentResponseProps> = ({
  isDeploying,
  isQueued,
  queuedTimestamp,
  error,
  deploymentData,
}) => {
  const deploymentUrl = deploymentData?.data?.url;
  const formattedTimestamp = formatTimestamp(queuedTimestamp);
  const shouldRender = isDeploying || isQueued || Boolean(error) || Boolean(deploymentUrl);

  return (
    <AnimatePresence mode="wait">
      {shouldRender && (
        <motion.div
          key={error ? "error" : isQueued ? "queued" : isDeploying ? "deploying" : "success"}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="mt-6 overflow-hidden"
        >
          {/* Error State */}
          {error && (
            <div className="bg-red-950/30 border border-red-800/50 text-red-400 p-4 rounded-[4px]">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-red-400 font-semibold">Deployment Failed</span>
              </div>
              <p className="text-sm text-red-300/90">{getErrorMessage(error)}</p>
            </div>
          )}

          {/* Queued State */}
          {isQueued && !error && (
            <div className="bg-blue-950/30 border border-blue-800/50 text-blue-400 p-4 rounded-[4px]">
              <h4 className="font-semibold mb-1">Deployment Queued</h4>
              <p className="text-sm text-blue-300/90 mb-2">
                {deploymentData?.message || "Project build initiated, awaiting build container..."}
              </p>
              <div className="text-xs text-blue-300/70 space-y-1">
                <p>Status: Preparing build environment</p>
                {formattedTimestamp && <p>Queued at: {formattedTimestamp}</p>}
              </div>
            </div>
          )}

          {/* Deploying State */}
          {isDeploying && !isQueued && !error && (
            <div className="bg-[#1A1A1A] border border-neutral-800 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin h-4 w-4 border-2 border-emerald-400 border-t-transparent rounded-full shrink-0" />
                <span className="text-sm text-neutral-300">
                  {deploymentData?.message || "Building and deploying your project..."}
                </span>
              </div>
            </div>
          )}

          {/* Success State */}
          {deploymentUrl && !isDeploying && !isQueued && !error && (
            <div className="bg-emerald-950/30 border border-emerald-800/50 text-emerald-400 p-4 rounded-lg">
              <h4 className="font-semibold mb-1">Deployment Successful</h4>
              <p className="text-sm text-emerald-300/90 mb-3">
                {deploymentData?.message || "Project deployment completed successfully."}
              </p>
              <div className="text-sm space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-neutral-300">Live URL:</span>
                  <a
                    href={deploymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-emerald-400 bg-emerald-900/40 border border-emerald-700/40 px-2.5 py-1 rounded hover:bg-emerald-800/50 hover:text-emerald-300 transition-colors underline-offset-2"
                  >
                    {deploymentUrl}
                  </a>
                </div>
                {formattedTimestamp && (
                  <p className="text-xs text-neutral-400">Deployed at: {formattedTimestamp}</p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeploymentResponse;
