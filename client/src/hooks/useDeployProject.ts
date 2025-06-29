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
    userId,
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
      console.log("env vars:", envVariables);
      const response = await axios.post<DeployResponse>(
        `${import.meta.env.VITE_API_BASE_URL}/deploy-project` || "http://localhost:5000/deploy-project",
        {
          gitURL,
          slug,
          rootDirectory,
          userId,
          envVariables,
        }
      );

      if (response.data.status == "error") {
        setError(response.data.message);
        setStatus("FAILED");
        setIsQueued(false);
        setIsDeploying(false);
        return null;
      }

      const data = response.data;
      setDeploymentData(response.data);
      setIsQueued(false);

      return response.data;
    } catch (err: any) {
      console.error("Error redeploying project:", err);
      setIsQueued(false);
      setError(err as Error);
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