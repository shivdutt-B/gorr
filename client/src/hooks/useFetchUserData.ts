import { useLoading } from "../hooks/useLoading";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../states/userAtom";
import axios from "axios";
import { useCallback, useRef } from "react";
import GetCookie from "../utils/GetCookie";

export function useFetchUserData() {
  const { startLoading, stopLoading, isRequestLoading } = useLoading();
  const setUser = useSetRecoilState(userAtom);
  const user = useRecoilValue(userAtom);
  const requestInProgress = useRef(false);

  const fetchUser = useCallback(async () => {
    if (requestInProgress.current || isRequestLoading("FetchUser")) {
      console.log("⚠️ User fetch already in progress, skipping new request");
      return;
    }

    const token = GetCookie("github_token");
    if (!token) {
      console.log("❌ No GitHub token found");
      setUser(null);
      return;
    }

    requestInProgress.current = true;
    const controller = startLoading("FetchUser", true);
    const source = axios.CancelToken.source(); // ⬅️ Create cancel token

    try {

      const response = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${token}` },
        cancelToken: source.token, // ✅ Use cancelToken here
      });

      if (!controller.signal.aborted) {
        console.log("✅ GitHub API Response:", response.data);
        setUser(response.data);
      } else {
        console.log("⚠️ Request was cancelled, not updating user");
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("✅ Request was cancelled");
      } else {
        console.error("❌ Error fetching user:", error);
        setUser(null);
      }
    } finally {
      requestInProgress.current = false;
      if (!controller.signal.aborted) {
        stopLoading("FetchUser");
      }
    }
  }, [setUser, startLoading, stopLoading, isRequestLoading]);

  return fetchUser;
}
