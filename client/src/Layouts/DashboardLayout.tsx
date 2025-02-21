import React, { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { useFetchUserData } from "../hooks/useFetchUserData";
import { loadingAtom } from "../states/loadingAtom";
import { userAtom } from "../states/userAtom";
import { ButtonLoading } from "../components/ui/LoadingBtn";
import { TryAgainSource } from "../components/ui/TryAgainSource";
import { useLoading } from "../hooks/useLoading";

function DashboardLayout() {
    const user = useRecoilValue(userAtom);
    const isLoading = useRecoilValue(loadingAtom);
    const { cancelRequests } = useLoading();
    const fetchUser = useFetchUserData();

    const hasFetched = useRef(false);

    useEffect(() => {
        if (!user && !hasFetched.current) {
            fetchUser();
            hasFetched.current = true;
        }
    }, [fetchUser, user]);

    return (
        <div>
            {isLoading ? (
                <div onClick={cancelRequests}>
                    <ButtonLoading />
                </div>
            ) : user ? (
                <div>
                    <h2>Welcome, {user.login}!</h2>
                    <img src={user.avatar_url} alt="Profile" width="100" />
                    <p>
                        GitHub Profile:{" "}
                        <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                            {user.html_url}
                        </a>
                    </p>
                </div>
            ) : (
                <div onClick={cancelRequests}>
                    <TryAgainSource onClick={cancelRequests} />
                </div>
            )}
        </div>
    );
}

export default DashboardLayout;
