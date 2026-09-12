import { useLoading } from "../hooks/useLoading";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../states/userAtom";
import axios from "axios";
import { useCallback, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useFetchUserData() {
  const { startLoading, stopLoading, isRequestLoading } = useLoading();
  const setUser = useSetRecoilState(userAtom);
  const requestInProgress = useRef(false);
  const location = useLocation();

  // Check for token in URL when component mounts
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      try {
        document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      } catch (error) {
        console.error("Failed to save token to cookies:", error);
      }
    }
  }, [location]);

  const fetchUser = useCallback(async () => {
    if (requestInProgress.current || isRequestLoading("FetchUser")) {
      return;
    }

    const token = document.cookie.match(/token=([^;]+)/)?.[1] || null;

    if (!token) {
      setUser(null);
      return;
    }

    requestInProgress.current = true;
    const controller = startLoading("FetchUser", true, 10000);

    try {
      const response = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
        timeout: 10000,
      });

      setUser(response.data);
    } catch (error) {
      document.cookie = "token=; path=/; max-age=0";
      setUser(null);
    } finally {
      requestInProgress.current = false;
      stopLoading("FetchUser");
    }
  }, [setUser, startLoading, stopLoading, isRequestLoading]);

  return fetchUser;
}