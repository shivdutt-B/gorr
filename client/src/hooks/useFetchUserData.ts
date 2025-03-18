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
    
    const requestMap = useRecoilValue(requestMapAtom);

    const fetchUser = useCallback(async () => {
        const token = GetCookie("github_token");
        if (!token) return;

        const signal = startLoading("FetchUser");

        try {
            await new Promise(resolve => setTimeout(resolve, 5000));

            const response = await axios.get("https://api.github.com/user", {
                headers: { Authorization: `Bearer ${token}` },
                signal,
            });


            console.log("✅ GitHub API Response:", response.data);
            setUser(response.data);
            
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log("✅ Request was cancelled");
            } else {
                console.error("❌ Error fetching user:", error);
            }
        } finally {
            stopLoading("FetchUser");
        }
    }, [setUser, startLoading, stopLoading]);

    return fetchUser;
}
