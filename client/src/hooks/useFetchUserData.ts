import { useLoading } from "../hooks/useLoading";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../states/userAtom";
import axios from "axios";
import { useCallback, useRef, useEffect } from "react";
import { requestMapAtom } from "../states/loadingAtom";
import { useRecoilState } from "recoil";
import { useLocation } from "react-router-dom";
import GetCookie from "../utils/GetCookie";

export function useFetchUserData() {
  const { startLoading, stopLoading, isRequestLoading } = useLoading();
  const setUser = useSetRecoilState(userAtom);
  const user = useRecoilValue(userAtom);
  const requestInProgress = useRef(false);
  const [requestMap, setRequestMap] = useRecoilState(requestMapAtom);
  const location = useLocation();

  // Check for token in URL when component mounts
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      try {
        // Store token in cookies instead of localStorage
        document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
        
        // Remove token from URL (for security)
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

    // Get token from cookie instead of localStorage
    const token = GetCookie("token");
    
    if (!token) {
      setUser(null);
      return;
    }

    requestInProgress.current = true;
    startLoading("FetchUser", true);

    try {
      const response = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${token}` },
  
      });
      setUser(response.data);
    } catch (error) {
      // If token is invalid, remove it
      document.cookie = "token=; path=/; max-age=0";
      setUser(null);
    } finally {
      requestInProgress.current = false;
      stopLoading("FetchUser");
    }
  }, [setUser, startLoading, stopLoading, isRequestLoading]);

  return fetchUser;
}