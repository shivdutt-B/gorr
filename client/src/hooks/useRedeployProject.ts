// client/src/hooks/useRedeployProject.ts
import { useState } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userAtom } from "../states/userAtom";

// Add a utility function to encode environment variables
const encodeEnvVariables = (envVariables: { key: string; value: string }[]) => {
  return envVariables.map((variable) => ({
    key: btoa(variable.key),
    value: btoa(variable.value),
  }));
};

export const useRedeployProject = () => {
  const [isRedeploying, setIsRedeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deploymentData, setDeploymentData] = useState<any>(null);
  const [isQueued, setIsQueued] = useState(false);
  const [queuedTimestamp, setQueuedTimestamp] = useState<Date | null>(null);
  const user = useRecoilValue(userAtom);

  const redeployProject = async (
    gitURL: string,
    slug: string,
    rootDirectory: string,
    userId?: string,
    envVariables: { key: string; value: string }[] = []
  ) => {
    // Reset states at the start of new deployment
    setIsRedeploying(true);
    setError(null);
    setDeploymentData(null);
    setIsQueued(true);
    setQueuedTimestamp(new Date().toISOString());

    try {
      // Encode environment variables before sending
      const encodedEnvVariables = encodeEnvVariables(envVariables);
      const url =
        `${import.meta.env.VITE_API_BASE_URL}/redeploy-project` ||
        `http://localhost:5000/redeploy-project`;
      const response = await axios.post(url, {
        gitURL,
        slug,
        rootDirectory,
        envVariables: encodedEnvVariables,
        userId: user?.id,
      });

      if (response.data.status == "error") {
        setDeploymentData(null);
        setIsQueued(false);
        setIsRedeploying(false);
        setError(response.data.message);
        return null;
      }

      console.log(response.data);

      setDeploymentData(response.data);
      setIsQueued(false);

      return response.data;
    } catch (err: any) {
      console.error("Error redeploying project:", err);
      setIsQueued(false);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to redeploy project"
      );
      return null;
    } finally {
      setIsRedeploying(false);
    }
  };

  return {
    redeployProject,
    isRedeploying,
    error,
    deploymentData,
    isQueued,
    queuedTimestamp,
  };
};
