import { useCallback, useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../states/userAtom";
import { reposAtom } from "../states/reposAtom";
import { useLoading } from "../hooks/useLoading";

export const useFetchRepos = () => {
  const user = useRecoilValue(userAtom);
  const [repos, setRepos] = useRecoilState(reposAtom);
  const { startLoading, stopLoading } = useLoading();
  const hasFetched = useRef(false); // Prevent infinite requests

  const fetchRepos = useCallback(async () => {
    if (!user?.repos_url || hasFetched.current) return; // Stop multiple requests
    
    hasFetched.current = true; // Mark as fetched before making API request
    const signal = startLoading("FetchRepos");

    try {
      const response = await fetch(user.repos_url, { signal });
      if (!response.ok) throw new Error("Failed to fetch repositories");

      const data = await response.json();
      console.log("✅ GitHub Repositories:", data);
      setRepos(data);
    } catch (error) {
      console.error("❌ Error fetching repositories:", error);
      hasFetched.current = false; // Reset flag on failure
    } finally {
      stopLoading("FetchRepos");
    }
  }, [user?.repos_url, setRepos, startLoading, stopLoading]);

  useEffect(() => {
    if (repos.length === 0) fetchRepos(); // Fetch only if no repos exist
  }, [fetchRepos, repos.length]); // ✅ Prevents re-fetching if data exists

  return fetchRepos;
};
