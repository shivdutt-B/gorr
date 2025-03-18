import { useCallback, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom } from "../states/userAtom";
import { reposAtom } from "../states/reposAtom";
import { useLoading } from "./useLoading";

interface UseFetchReposReturn {
  fetchRepos: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useFetchRepos(): UseFetchReposReturn {
  const setRepos = useSetRecoilState(reposAtom);
  const user = useRecoilValue(userAtom);
  const { startLoading, stopLoading } = useLoading();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRepos = useCallback(async () => {
    if (!user?.repos_url) {
      setError("No repository URL available");
      return;
    }

    setIsLoading(true);
    setError(null);
    const signal = startLoading("fetchRepos");

    try {
      await new Promise(resolve => setTimeout(resolve, 5000));
      const response = await fetch(user.repos_url, { signal });

      if (!response.ok) {
        throw new Error(`Failed to fetch repositories: ${response.statusText}`);
      }

      const data = await response.json();
      setRepos(data);
      setError(null);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch request was aborted");
        setError("Request canceled");
      } else {
        console.error("Error fetching repos:", error);
        setError(error.message || "Failed to fetch repositories");
      }
    } finally {
      stopLoading("fetchRepos");
      setIsLoading(false);
    }
  }, [setRepos, user, startLoading, stopLoading]);

  return { fetchRepos, isLoading, error };
}