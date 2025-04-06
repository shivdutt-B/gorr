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

// Add a utility function to encode environment variables
const encodeEnvVariables = (envVariables: { key: string; value: string }[]) => {
  return envVariables.map(variable => ({
    key: btoa(variable.key),
    value: btoa(variable.value)
  }));
};

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
      // Encode environment variables before sending
      const encodedEnvVariables = encodeEnvVariables(envVariables);

      console.log('BEFORE ENCODING: ', envVariables)
      console.log('AFTER ENCODING ', encodedEnvVariables)

      console.log('DATA: ', {
        gitURL,
        slug,
        rootDirectory,
        userId,
        envVariables: encodedEnvVariables, // Send encoded variables
      })

      const response = await axios.post<DeployResponse>(
        `${import.meta.env.VITE_API_BASE_URL}/deploy-project` || "http://localhost:5000/deploy-project",
        {
          gitURL,
          slug,
          rootDirectory,
          userId,
          envVariables: encodedEnvVariables, // Send encoded variables
        }
      );

      console.log('RESPONSE: ', response)
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