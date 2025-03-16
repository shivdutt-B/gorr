import React, { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { useFetchUserData } from "../hooks/useFetchUserData";
import { loadingAtom } from "../states/loadingAtom";
import { userAtom } from "../states/userAtom";
import { ButtonLoading } from "../components/ui/LoadingBtn";
import { TryAgainSource } from "../components/ui/TryAgainSource";
import { useLoading } from "../hooks/useLoading";
import { Navbar } from '../components/ui/Navbar';
import SearchProjectInput from '../components/ui/SearchProjectInput';
import DashBoardHeader from "../components/ui/DashBoardHeader";

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
                <div className="">
                    {console.log(user.avatar_url)}
                    <DashBoardHeader />
                    <SearchProjectInput />
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
