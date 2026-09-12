import { useState } from 'react';
import axios from 'axios';

interface DeployProjectParams {
  gitURL?: string;
  slug: string;
  rootDirectory: string;
  userId?: string;
  envVariables?: { key: string; value: string }[];
}

interface DeployResponse {
  status: string;
  message: string;
  data?: {
    projectSlug: string;
    url: string;
    project?: any;
  };
  error?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const useDeployProject = () => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [deploymentData, setDeploymentData] = useState<DeployResponse | null>(null);
  const [isQueued, setIsQueued] = useState(false);
  const [queuedTimestamp, setQueuedTimestamp] = useState<string | null>(null);
  const [projectSlug, setProjectSlug] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("QUEUED");

  const deployProject = async ({
    gitURL,
    slug,
    rootDirectory,
    envVariables = [],
  }: DeployProjectParams) => {
    // Reset states at the start of new deployment
    setIsDeploying(true);
    setError(null);
    setDeploymentData(null);
    setIsQueued(true);
    setQueuedTimestamp(new Date().toISOString());
    setProjectSlug(slug);
    setLogs([]);
    setStatus("QUEUED");

    try {
      const response = await axios.post<DeployResponse>(
        `${API_BASE_URL}/deploy-project`,
        {
          gitURL,
          slug,
          rootDirectory,
          envVariables,
        },
        { withCredentials: true }
      );

      if (response.data.status === "error") {
        setError(new Error(response.data.message));
        setStatus("FAILED");
        setIsQueued(false);
        setIsDeploying(false);
        return null;
      }

      setDeploymentData(response.data);
      setIsQueued(false);

      return response.data;
    } catch (err: any) {
      setIsQueued(false);
      setError(new Error(err?.response?.data?.message || 'Unknown error occurred'));
      setStatus("FAILED");
      return null;
    } finally {
      setIsDeploying(false);
    }
  };

  return {
    deployProject,
    isDeploying,
    error,
    deploymentData,
    isQueued,
    queuedTimestamp,
    projectSlug,
    logs,
    status
  };
};