import React from "react";
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
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { projectsAtom } from "../states/projectsAtom";

function DashboardLayout() {
  const user = useRecoilValue(userAtom);
  const { isRequestLoading, stopLoading } = useLoading();
  const isUserLoading = isRequestLoading("FetchUser");
  const isProjectsLoading = isRequestLoading("FetchProjects");
  const { fetchProjects } = useFetchProjects();
  const fetchUser = useFetchUserData();
  const projects = useRecoilValue(projectsAtom);
  const { error: projectsError } = useFetchProjects();

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (user?.id && !hasFetchedRef.current) {
      fetchProjects();
      hasFetchedRef.current = true;
    }
  }, [user, fetchProjects]);


  const handleRetry = () => {
    fetchUser();
    hasFetchedRef.current = false;
  };

  const handleRetryProject = () => {
    fetchProjects();
    hasFetchedRef.current = true;
  };

  // Show loading state for initial user fetch
  if (isUserLoading) {
    return <LoadingSpinner message="Loading user..." />;
  }

  // Show canceled or error state for user fetch
  if (!user && !isUserLoading) {
    return <TryAgainSource message="User not found" onClick={handleRetry} />;
  }

  // Show main dashboard content
  if (user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <DashBoardHeader />
        <main className="container mx-auto px-4 py-8">
          <SearchProjectInput />
          {isProjectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center justify-center mt-10">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-[#1a1a1a] p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow max-w-[400px] w-full mx-auto"
                >
                  {/* Gradient banner skeleton */}
                  <div className="h-[120px] w-full mb-4 rounded-md bg-[gray] animate-pulse" />

                  {/* Project title area */}
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[gray] rounded-full animate-pulse" />
                      <div className="h-5 w-24 bg-[gray] rounded animate-pulse" />
                    </div>

                    {/* Git URL skeleton */}
                    <div className="mt-1">
                      <div className="h-7 w-36 bg-[gray] rounded animate-pulse" />
                    </div>

                    {/* Domain URL skeleton */}
                    <div>
                      <div className="h-4 w-32 bg-[gray] rounded animate-pulse" />
                    </div>

                    {/* Date skeleton */}
                    <div className="mb-2">
                      <div className="h-3 w-44 bg-[gray] rounded animate-pulse" />
                    </div>

                    {/* Action buttons skeleton */}
                    <div className="flex gap-2">
                      <div className="h-8 w-24 bg-[gray] rounded animate-pulse" />
                      <div className="h-8 w-24 bg-[gray] rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !projects && !isProjectsLoading ? (
            <TryAgainSource
              message="Error fetching projects"
              onClick={handleRetryProject}
            />
          ) : (
            <>
              <ProjectsList />
            </>
          )}
        </main>
      </div>
    );
  }

  return null;
}

export default DashboardLayout;
