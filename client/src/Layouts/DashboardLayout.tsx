import React, { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";

import { userAtom } from "../states/userAtom";
import { projectsAtom } from "../states/projectsAtom";

import SearchProjectInput from "../components/dashboard/SearchProjectInput";
import DashBoardHeader from "../components/dashboard/DashBoardHeader";
import { ProjectsList } from "../components/dashboard/ProjectsList";

import { useLoading } from "../hooks/useLoading";
import { useFetchProjects } from "../hooks/useFetchProjects";
import { useFetchUserData } from "../hooks/useFetchUserData";

function DashboardLayout() {
  const user = useRecoilValue(userAtom);
  const projects = useRecoilValue(projectsAtom);

  const { isRequestLoading } = useLoading();

  const isUserLoading = isRequestLoading("FetchUser");
  const isProjectsLoading = isRequestLoading("FetchProjects");

  const { fetchProjects } = useFetchProjects();
  const { error: projectsError } = useFetchProjects();

  const fetchUser = useFetchUserData();

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

  /* ───────────────────── USER ERROR (if finished loading user and no user) ───────────────────── */

  if (!user && !isUserLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[hsl(var(--bg))] p-4 text-center">
        <p className="mb-4 text-lg font-medium text-red-500">User not found</p>
        <button
          onClick={handleRetry}
          className="rounded-[4px] bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
        >
          Try Again
        </button>
      </div>
    );
  }

  /* ───────────────────── DASHBOARD ───────────────────── */

  const isCardSkeletonVisible = isUserLoading || isProjectsLoading;

  return (
    <div
      className="
        relative
        min-h-screen
        w-full
        overflow-x-hidden
        bg-[hsl(var(--bg))]
      "
    >
      {/* Global Continuous Ambient Light & Grid Overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:96px_96px]" />

      {/* Ambient Global Glow Accent */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[700px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,hsl(var(--accent)/0.10),transparent_70%)]" />

      {/* ───────────────────── HEADER ───────────────────── */}

      <div className="relative z-10">
        <DashBoardHeader />
      </div>

      {/* ───────────────────── MAIN CONTENT ───────────────────── */}

      <main
        className="
          container-gutter
          relative
          w-full
          pt-8
          pb-16
          sm:pt-10
        "
      >
        {/* Search / actions */}
        <SearchProjectInput />

        {/* ───────────────────── PROJECTS ───────────────────── */}

        {isCardSkeletonVisible ? (
          <div
            className="
              mt-10
              grid
              grid-cols-1
              gap-6
              sm:grid-cols-2
              xl:grid-cols-3
            "
          >
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="
                  w-full
                  overflow-hidden
                  rounded-[4px]
                  border
                  border-white/[0.07]
                  bg-white/[0.005]
                  p-4
                "
              >
                {/* Banner */}
                <div
                  className="
                    h-[120px]
                    w-full
                    animate-pulse
                    rounded-[4px]
                    bg-white/[0.06]
                  "
                />

                {/* Content */}
                <div className="mt-5 flex flex-col gap-3">
                  {/* Project title */}
                  <div className="flex items-center gap-2">
                    <div
                      className="
                        h-7
                        w-7
                        animate-pulse
                        rounded-[4px]
                        bg-white/[0.07]
                      "
                    />

                    <div
                      className="
                        h-4
                        w-28
                        animate-pulse
                        rounded-[4px]
                        bg-white/[0.07]
                      "
                    />
                  </div>

                  {/* Git URL */}
                  <div
                    className="
                      mt-1
                      h-6
                      w-40
                      animate-pulse
                      rounded-[4px]
                      bg-white/[0.07]
                    "
                  />

                  {/* Domain */}
                  <div
                    className="
                      h-4
                      w-32
                      animate-pulse
                      rounded-[4px]
                      bg-white/[0.05]
                    "
                  />

                  {/* Date */}
                  <div
                    className="
                      mt-1
                      h-3
                      w-44
                      animate-pulse
                      rounded-[4px]
                      bg-white/[0.05]
                    "
                  />

                  {/* Buttons */}
                  <div className="mt-2 flex gap-2">
                    <div
                      className="
                        h-9
                        w-24
                        animate-pulse
                        rounded-[4px]
                        bg-white/[0.06]
                      "
                    />

                    <div
                      className="
                        h-9
                        w-24
                        animate-pulse
                        rounded-[4px]
                        bg-white/[0.06]
                      "
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !projects && !isProjectsLoading ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-[4px] border border-white/10 p-8 text-center">
            <p className="mb-4 text-sm text-red-400">
              Error fetching projects
            </p>
            <button
              onClick={handleRetryProject}
              className="rounded-[4px] bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="mt-10">
            <ProjectsList />
          </div>
        )}
      </main>
    </div>
  );
}

export default DashboardLayout;