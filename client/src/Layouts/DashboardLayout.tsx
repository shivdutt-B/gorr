import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { userAtom } from "../states/userAtom";
import { ButtonLoading } from "../components/ui/LoadingBtn";
import { TryAgainSource } from "../components/ui/TryAgainSource";
import { useLoading } from "../hooks/useLoading";
import SearchProjectInput from "../components/ui/SearchProjectInput";
import DashBoardHeader from "../components/ui/DashBoardHeader";
import { ProjectsList } from "../components/ui/ProjectsList";
import { useFetchProjects } from "../hooks/useFetchProjects";
import { useEffect, useRef } from "react";
import { useFetchUserData } from "../hooks/useFetchUserData";

function DashboardLayout() {
  const user = useRecoilValue(userAtom);
  const { isRequestLoading, stopLoading } = useLoading();
  const isUserLoading = isRequestLoading("FetchUser");
  const [isCanceled, setIsCanceled] = useState(false);
  const { fetchProjects, isLoading: isProjectsLoading } = useFetchProjects();
  const fetchUser = useFetchUserData();

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (user?.id && !hasFetchedRef.current && !isCanceled) {
      fetchProjects();
      hasFetchedRef.current = true;
    }
  }, [user, fetchProjects, isCanceled]);

  const handleCancel = () => {
    console.log("Cancelling requests");
    stopLoading("FetchUser");
    // stopLoading("FetchProjects");
    setIsCanceled(true);
    hasFetchedRef.current = false;
  };

  const handleCancelProject = () => {
    console.log("Cancelling requests");
    stopLoading("FetchProjects");
    setIsCanceled(true);
    hasFetchedRef.current = false;
  };

  const handleRetry = () => {
    console.log("Retrying requests");
    setIsCanceled(false);
    fetchUser();
    hasFetchedRef.current = false;
  };

  const handleRetryProject = () => {
    setIsCanceled(false);
    fetchProjects();
    hasFetchedRef.current = true;
  };

  // Show loading state for initial user fetch
  if (isUserLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ButtonLoading onClick={handleCancel} />
      </div>
    );
  }

  // Show canceled or error state for user fetch
  if (!user && !isUserLoading) {
    return <TryAgainSource onClick={handleRetry} />;
  }

  // Show main dashboard content
  if (user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <DashBoardHeader />
        <main className="container mx-auto px-4 py-8">
          <SearchProjectInput />
          {isProjectsLoading && !isCanceled ? (
            <div className="h-[450px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="flex flex-col items-center justify-center min-h-screen">
                  <ButtonLoading onClick={handleCancelProject} />
                </div>
              </div>
            </div>
          ) : isCanceled ? (
            <TryAgainSource onClick={handleRetryProject} />
          ) : (
            <ProjectsList />
          )}
        </main>
      </div>
    );
  }

  return null;
}

export default DashboardLayout;
