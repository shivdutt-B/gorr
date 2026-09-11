import { useCallback, useState, useRef } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom } from "../states/userAtom";
import { reposAtom } from "../states/reposAtom";
import { useLoading } from "./useLoading";
import axios from "axios";

interface UseFetchReposReturn {
  FetchRepos: (force?: boolean) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useFetchRepos(): UseFetchReposReturn {
  const setRepos = useSetRecoilState(reposAtom);
  const repos = useRecoilValue(reposAtom);
  const user = useRecoilValue(userAtom);
  const { startLoading, stopLoading, isRequestLoading } = useLoading();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestInProgress = useRef(false);

  const FetchRepos = useCallback(
    async (force = false) => {
      if (
        requestInProgress.current ||
        (!force && repos && repos.length > 0) ||
        !user?.repos_url ||
        isRequestLoading("FetchRepos")
      ) {
        return;
      }

      requestInProgress.current = true;
      setIsLoading(true);
      setError(null);
      const controller = startLoading("FetchRepos", true, 10000);

      try {
        const response = await axios.get(user.repos_url, {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
          signal: controller.signal,
          timeout: 10000,
        });

        const data = response.data;

        const filteredData = Array.isArray(data)
          ? data.map((repo: any) => ({
              name: repo.name,
              git_url: repo.git_url,
              clone_url: repo.clone_url,
              html_url: repo.html_url,
              lastUpdated: repo.updated_at,
            }))
          : [];

        setRepos(filteredData);
        setError(null);
      } catch (err: any) {
        setError("Error fetching repositories");
        setRepos(null);
      } finally {
        requestInProgress.current = false;
        stopLoading("FetchRepos");
        setIsLoading(false);
      }
    },
    [setRepos, repos, user, startLoading, stopLoading, isRequestLoading]
  );

  return { FetchRepos, isLoading, error };
}

