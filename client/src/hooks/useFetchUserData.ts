import { useLoading } from "../hooks/useLoading";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../states/userAtom";
import axios from "axios";
import { useCallback } from "react";
import GetCookie from "../utils/GetCookie";

export function useFetchUserData() {
    const { startLoading, stopLoading } = useLoading();
    const setUser = useSetRecoilState(userAtom);
    const user = useRecoilValue(userAtom);

    const fetchUser = useCallback(async () => {
        const token = GetCookie("github_token");
        if (!token) return;

        const signal = startLoading("FetchUser");

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
        } catch (error) {
            stopLoading("FetchUser");
        }
    }, [setUser, user, startLoading, stopLoading]);

    return fetchUser;
}
