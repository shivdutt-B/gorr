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
    startLoading("FetchRepos");

    try {

      const response = await fetch(user.repos_url, { 
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });


      const data = await response.json();

      const filteredData = data.map((repo) => ({
        name: repo.name,
        git_url: repo.git_url,
        clone_url: repo.clone_url,
        html_url: repo.html_url,
        lastUpdated: repo.updated_at,
      }));

      console.log('REPO RES', data)
      setRepos(filteredData);
      setError(null);
    } catch (error) {
      setError("Error fetching repositories");
      setRepos([]);

    } finally {
      stopLoading("FetchRepos");
      setIsLoading(false);
    }
  }, [setRepos, user, startLoading, stopLoading]);

  return { FetchRepos, isLoading, error };
}
