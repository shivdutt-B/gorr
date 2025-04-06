import { useCallback, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom } from "../states/userAtom";
import { projectsAtom } from "../states/projectsAtom";
import { useLoading } from "./useLoading";
import axios from "axios";
import GetCookie from "../utils/GetCookie";

interface UseFetchProjectsReturn {
  fetchProjects: () => Promise<void>;
}

export function useFetchProjects(): UseFetchProjectsReturn {
  const setProjects = useSetRecoilState(projectsAtom);
  const projects = useRecoilValue(projectsAtom);
  const user = useRecoilValue(userAtom);
  const { startLoading, stopLoading, isRequestLoading } = useLoading();

  const fetchProjects = useCallback(async () => {
    // If projects are already loaded or request is in progress, don't fetch again
    if (projects?.data || !user?.id || isRequestLoading("FetchProjects")) {
      return;
    }
    startLoading("FetchProjects");

    try {
      const url = `${
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
      }/projects?userId=${user?.id}`;


      const response = await axios.get(url);

      console.log("response: ", response);
      if (response.status === 200) {
        setProjects(response.data);
      }
    } catch (error: any) {
      setProjects(null);
      // }
    } finally {
      stopLoading("FetchProjects");
    }
  }, [
    setProjects,
    projects,
    user,
    startLoading,
    stopLoading,
    isRequestLoading,
  ]);

  return { fetchProjects };
}
