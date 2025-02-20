import { useLoading } from "../hooks/useLoading";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../states/userAtom";
import axios from "axios";
import GetCookie from "../utils/GetCookie";
import { useCallback } from "react";

export const useFetchUserData = () => {
  const { startLoading, stopLoading } = useLoading();
  const setUser = useSetRecoilState(userAtom);

  return useCallback(async () => {
    const token = GetCookie("github_token");

    if (!token) {
      console.error("❌ No GitHub token found.");
      stopLoading("FetchUserData");
      return;
    }

    console.log("🔍 Using GitHub Token:", token);

    const signal = startLoading("FetchUserData");

    try {
      const request = axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });

      const userResponse = await request;
      console.log("✅ GitHub API Response:", userResponse.data);

      setTimeout(() => {
        setUser(userResponse.data);
        stopLoading("FetchUserData");
      }, 0);
    } catch (error) {
      console.error("❌ Request aborted or failed:", error);
      stopLoading("FetchUserData");
    }
}, [setUser, startLoading, stopLoading]); // ✅ Memoized to prevent re-renders
};


