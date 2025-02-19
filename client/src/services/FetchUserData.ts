import { useLoading } from "../hooks/useLoading";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../states/userAtom";
import axios from "axios";
import GetCookie from "../utils/GetCookie";
import { useCallback } from "react";

export const useFetchUserData = () => {
  const { startLoading, stopLoading } = useLoading();
  const setUser = useSetRecoilState(userAtom);

  return async () => {
    const token = GetCookie("github_token");

    if (!token) {
      console.error("❌ No GitHub token found.");
      stopLoading("FetchUserData");
      return;
    }

    console.log("🔍 Using GitHub Token:", token);


    const signal = startLoading("FetchUserData");

    try {

        const userResponse = await axios.get("https://api.github.com/user", {
          headers: { Authorization: `Bearer ${token}` }, 
          signal,
        });
        
        console.log("✅ GitHub API Response:", userResponse.data);
        
        // ✅ Update Recoil state **outside of async function**
        setTimeout(() => {
          setUser(userResponse.data);
          stopLoading("FetchUserData"); // ✅ Safe state update
        }, 0);

    } catch (error) {
      console.error("❌ Failed to fetch user data:", error);
      stopLoading("FetchUserData"); // ✅ Ensure this runs
    }
  };
};
