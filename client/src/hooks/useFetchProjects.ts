import { useCallback, useRef } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom } from "../states/userAtom";
import { projectsAtom } from "../states/projectsAtom";
import { useLoading } from "./useLoading";
import axios from "axios";

interface UseFetchProjectsReturn {
  fetchProjects: (force?: boolean) => Promise<void>;
}

export function useFetchProjects(): UseFetchProjectsReturn {
  const setProjects = useSetRecoilState(projectsAtom);
  const projects = useRecoilValue(projectsAtom);
  const user = useRecoilValue(userAtom);
  const { startLoading, stopLoading, isRequestLoading } = useLoading();
  const requestInProgress = useRef(false);

  const fetchProjects = useCallback(
    async (force = false) => {
      console.log("START");

      // If request in progress, or projects already loaded (and not forced), or no user or request loading in map, return
      if (
        requestInProgress.current ||
        (!force && projects?.data) ||
        !user?.id ||
        isRequestLoading("FetchProjects")
      ) {
        return;
      }

      requestInProgress.current = true;
      const controller = startLoading("FetchProjects", true, 10000);

      try {
        const url = `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
        }/projects?userId=${user?.id}`;

        const response = await axios.get(url, {
          signal: controller.signal,
          timeout: 10000,
        });

        if (response.status === 200) {
          setProjects(response.data);
        }
      } catch (error: any) {
        setProjects(null);
      } finally {
        requestInProgress.current = false;
        stopLoading("FetchProjects");
      }
    },
    [
      setProjects,
      projects,
      user,
      startLoading,
      stopLoading,
      isRequestLoading,
    ]
  );

  return { fetchProjects };
}

