import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useFetchUserData } from "../services/FetchUserData";
import { loadingAtom } from "../states/loadingAtom";
import { userAtom } from "../states/userAtom";
import { ButtonLoading } from "../components/ui/LoadingBtn";
import { useLoading } from "../hooks/useLoading";

function AuthDone() {
    const user = useRecoilValue(userAtom);
    const isLoading = useRecoilValue(loadingAtom);
    const { cancelRequests } = useLoading();
    const fetchUser = useFetchUserData();

    const [hasFetchedUser, setHasFetchedUser] = useState(false);

    useEffect(() => {
        if (!user && !hasFetchedUser) {
            fetchUser();
            setHasFetchedUser(true);
        }
    }, [user]);

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
                <p>Failed to load user data. Please try logging in again.</p>
            )}
        </div>
    );
}

export default AuthDone;
