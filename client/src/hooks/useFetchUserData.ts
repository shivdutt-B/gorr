import { useLoading } from "../hooks/useLoading";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../states/userAtom";
import axios from "axios";
import { useCallback, useRef } from "react";
import GetCookie from "../utils/GetCookie";
import { requestMapAtom } from "../states/loadingAtom";
import { useRecoilState } from "recoil";

export function useFetchUserData() {
  const { startLoading, stopLoading, isRequestLoading } = useLoading();
  const setUser = useSetRecoilState(userAtom);
  const user = useRecoilValue(userAtom);
  const requestInProgress = useRef(false);
  const [requestMap, setRequestMap] = useRecoilState(requestMapAtom);

  const fetchUser = useCallback(async () => {
    console.log("=============fetchUser===========");
    if (requestInProgress.current || isRequestLoading("FetchUser")) {
      return;
    }

    const token = GetCookie("github_token");
    console.log("=============token===========", token);
    if (!token) {
      setUser(null);
      return;
    }
    // console.log("=============token===========", token);

    requestInProgress.current = true;
    startLoading("FetchUser", true);

    try {
      const response = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("=============response===========", response.data);
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      requestInProgress.current = false;
      stopLoading("FetchUser");
    }
  }, [setUser, startLoading, stopLoading, isRequestLoading]);

  return fetchUser;
}
