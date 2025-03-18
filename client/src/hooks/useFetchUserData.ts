import { useLoading } from "../hooks/useLoading";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../states/userAtom";
import axios from "axios";
import { useCallback } from "react";
import GetCookie from "../utils/GetCookie";
import { requestMapAtom } from "../states/loadingAtom";

export function useFetchUserData() {
    const { startLoading, stopLoading } = useLoading();
    const setUser = useSetRecoilState(userAtom);
    const user = useRecoilValue(userAtom);
    
    const requestMap = useRecoilValue(requestMapAtom)

    const fetchUser = useCallback(async () => {
        const token = GetCookie("github_token");
        if (!token) return;

        const signal = startLoading("FetchUser");

        await new Promise(resolve => setTimeout(resolve, 5000));

        try {
            const response = await axios.get("https://api.github.com/user", {
                headers: { Authorization: `Bearer ${token}` },
                signal,
            });

            console.log("✅ GitHub API Response:", response.data);

            setTimeout(() => {
                setUser(response.data);
                stopLoading("FetchUser");
            }, 0);
            console.log('SYS USER', requestMap)
        } catch (error) {
            stopLoading("FetchUser");

            if (error.name === "AbortError") {
                console.log("✅ Abort user request");
            }
            else {
                console.log(error)
            }
        }
    }, [setUser, user, startLoading, stopLoading]);

    return fetchUser;
}
