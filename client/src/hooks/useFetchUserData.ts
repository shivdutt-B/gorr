import { useLoading } from "../hooks/useLoading";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../states/userAtom";
import axios from "axios";
import { useCallback, useRef } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export function useFetchUserData() {
  const { startLoading, stopLoading, isRequestLoading } = useLoading();
  const setUser = useSetRecoilState(userAtom);
  const requestInProgress = useRef(false);

  const fetchUser = useCallback(async () => {
    if (requestInProgress.current || isRequestLoading("FetchUser")) {
      return;
    }

    requestInProgress.current = true;
    const controller = startLoading("FetchUser", true, 10000);

    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        withCredentials: true,
        signal: controller.signal,
        timeout: 10000,
      });

      if (response.data?.status === "success" && response.data?.data) {
        setUser(response.data.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      requestInProgress.current = false;
      stopLoading("FetchUser");
    }
  }, [setUser, startLoading, stopLoading, isRequestLoading]);

  return fetchUser;
}