import { useLoading } from "../hooks/useLoading";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../states/userAtom";
import axios from "axios";
import { useCallback, useRef, useEffect } from "react";
import { requestMapAtom } from "../states/loadingAtom";
import { useRecoilState } from "recoil";
import { useLocation } from "react-router-dom";

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
      // Store token in localStorage
      localStorage.setItem('github_token', token);
      
      // Remove token from URL (for security)
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [location]);

  const fetchUser = useCallback(async () => {
    console.log("=============fetchUser===========");
    if (requestInProgress.current || isRequestLoading("FetchUser")) {
      return;
    }

    // Get token from localStorage instead of cookie
    const token = localStorage.getItem('github_token');
    console.log("=============token===========", token);
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
      console.log("=============response===========", response.data);
      setUser(response.data);
    } catch (error) {
      // If token is invalid, remove it
      localStorage.removeItem('github_token');
      setUser(null);
    } finally {
      requestInProgress.current = false;
      stopLoading("FetchUser");
    }
  }, [setUser, startLoading, stopLoading, isRequestLoading, location]);

  return fetchUser;
}