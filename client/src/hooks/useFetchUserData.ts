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
    const sampleVal = queryParams.get('sampleKey');

    console.log("===========token======", token);
    console.log("===========sampleVal======", sampleVal);

    if (token) {
      try {
        // Store token in localStorage - make sure it's actually set
        window.localStorage.setItem('tok', token);
        console.log("Token saved to localStorage:", localStorage.getItem('tok'));

        window.localStorage.setItem('sampleKey', sampleVal);
        console.log("sampleKey saved to localStorage:", localStorage.getItem('sampleKey'));
        
        // Remove token from URL (for security)
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      } catch (error) {
        console.error("Failed to save token to localStorage:", error);
      }
    }
  }, [location]);

  const fetchUser = useCallback(async () => {
    if (requestInProgress.current || isRequestLoading("FetchUser")) {
      return;
    }

    // Get token from localStorage instead of cookie
    const token = localStorage.getItem('tok');
    console.log("Fetching user with token:", token);
    
    // const token = GetCookie("tok");
    if (!token) {
      setUser(null);
      return;
    }

    requestInProgress.current = true;
    startLoading("FetchUser", true);

    try {
      const response = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true, // 👈 Important!
      });
      setUser(response.data);
    } catch (error) {
      // If token is invalid, remove it
      localStorage.removeItem('tok');
      setUser(null);
    } finally {
      requestInProgress.current = false;
      stopLoading("FetchUser");
    }
  }, [setUser, startLoading, stopLoading, isRequestLoading]);

  return fetchUser;
}