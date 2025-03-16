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
        if (!user?.repos_url || hasFetched.current) return; // ✅ Prevent unnecessary calls

        hasFetched.current = true;
        const signal = startLoading("FetchRepos");

        try {
            console.log("⏳ Waiting for 5 seconds before fetching...");
            await new Promise((resolve) => setTimeout(resolve, 5000)); // ✅ Ensure delay before fetching

            const response = await fetch("http://localhost:5000/repos", { signal });
            if (!response.ok) throw new Error("Failed to fetch repositories");

            const data = await response.json();
            console.log("✅ GitHub Repositories:", data);
            setRepos(data);
        } catch (error) {
            console.error("❌ Error fetching repositories:", error);
            hasFetched.current = false;
        } finally {
            stopLoading("FetchRepos");
        }
    }, [user?.repos_url, setRepos, startLoading, stopLoading]);

    useEffect(() => {
        if (repos.length === 0 && !hasFetched.current) {
            fetchRepos();
        }
    }, [fetchRepos, repos.length]);

    return fetchRepos;
};
