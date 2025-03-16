import { useCallback, useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../states/userAtom";
import { reposAtom } from "../states/reposAtom";
import { useLoading } from "../hooks/useLoading";

export const useFetchRepos = () => {
  const user = useRecoilValue(userAtom);
  const [repos, setRepos] = useRecoilState(reposAtom);
  const { startLoading, stopLoading } = useLoading();
  const hasFetched = useRef(false);

  const fetchRepos = useCallback(async () => {
    if (!user?.repos_url || hasFetched.current) return;
    
    const signal = startLoading("FetchRepos"); // Start loading state

    try {
      const response = await fetch(user.repos_url, { signal });
      if (!response.ok) throw new Error("Failed to fetch repositories");

      const data = await response.json();
      console.log("✅ GitHub Repositories:", data);
      setRepos(data);
      
      hasFetched.current = true; // Prevent duplicate fetch
    } catch (error) {
      console.error("Error fetching repositories:", error);
    } finally {
      stopLoading("FetchRepos"); // Stop loading state
    }
  }, [user?.repos_url, setRepos, startLoading, stopLoading]); // ✅ Memoized function

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]); // ✅ Only runs when `fetchRepos` changes

  return fetchRepos;
};
