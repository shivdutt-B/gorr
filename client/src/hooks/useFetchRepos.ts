import { useCallback, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom } from "../states/userAtom";
import { reposAtom } from "../states/reposAtom";
import { useLoading } from "./useLoading";

interface UseFetchReposReturn {
  FetchRepos: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useFetchRepos(): UseFetchReposReturn {
  const setRepos = useSetRecoilState(reposAtom);
  const user = useRecoilValue(userAtom);
  const { startLoading, stopLoading } = useLoading();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const FetchRepos = useCallback(async () => {
    if (!user?.repos_url) {
      setError("No repository URL available");
      return;
    }

    setIsLoading(true);
    setError(null);
    const controller = startLoading("FetchRepos");

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Abort if request was cancelled before sending
      if (controller.signal.aborted) {
        console.log("Request was aborted before sending.");
        return;
      }

      const response = await fetch(user.repos_url, { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });


      if (!response.ok) {
        throw new Error(`Failed to fetch repositories: ${response.statusText}`);
      }

      const data = await response.json();

      const filteredData = data.map((repo) => ({
        name: repo.name,
        git_url: repo.git_url,
        clone_url: repo.clone_url,
        lastUpdated: repo.updated_at,
      }));

      console.log('REPO RES', filteredData)
      setRepos(filteredData);
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
      if (!controller.signal.aborted) {
        stopLoading("FetchRepos");
      }
      setIsLoading(false);
    }
  }, [setRepos, user, startLoading, stopLoading]);

  return { FetchRepos, isLoading, error };
}
