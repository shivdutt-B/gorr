import { useCallback, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom } from "../states/userAtom";
import { projectsAtom } from "../states/projectsAtom";
import { useLoading } from "./useLoading";
import axios from "axios";
import GetCookie from "../utils/GetCookie";

interface UseFetchProjectsReturn {
  fetchProjects: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useFetchProjects(): UseFetchProjectsReturn {
  const setProjects = useSetRecoilState(projectsAtom);
  const projects = useRecoilValue(projectsAtom);
  const user = useRecoilValue(userAtom);
  const { startLoading, stopLoading, isRequestLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    // If projects are already loaded or request is in progress, don't fetch again
    if (projects?.data || !user?.id || isRequestLoading("FetchProjects")) {
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);
    startLoading("FetchProjects");

    try {
      // Add artificial 5 second delay for development/testing purposes
      // await new Promise(resolve => setTimeout(resolve, 5000));
      const url = `${import.meta.env.VITE_API_BASE_URL}/projects?userId=${user.id}` || `http://localhost:5000/projects?userId=${user.id}`
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${GetCookie("token")}`,
        },
        signal: controller.signal,
      });
    //   await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('response: ',response)
      if (response.status === 200) {
        setProjects(response.data);
      }
    } catch (error: any) {
      if (axios.isCancel(error)) {
        setError("Request canceled");
      } else {
        setError(error.message || "Failed to fetch projects");
      }
    } finally {
      if (!controller.signal.aborted) {
        stopLoading("FetchProjects");
      }
      setIsLoading(false);
    }
  }, [setProjects, projects, user, startLoading, stopLoading, isRequestLoading]);

  return { fetchProjects, isLoading, error };
} 