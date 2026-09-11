import React, { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";

import { userAtom } from "../states/userAtom";
import { projectsAtom } from "../states/projectsAtom";

import SearchProjectInput from "../components/dashboard/SearchProjectInput";
import DashBoardHeader from "../components/dashboard/DashBoardHeader";
import { ProjectsList } from "../components/dashboard/ProjectsList";
import { TryAgain } from "../components/common/TryAgain";

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
    hasFetchedRef.current = false;
    fetchProjects(true);
  };

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

        {/* ───────────────────── PROJECTS CONTENT ───────────────────── */}

        {!user && !isUserLoading ? (
          <div className="mt-10">
            <TryAgain message="User not found" onClick={handleRetry} />
          </div>
        ) : isCardSkeletonVisible ? (
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
          <div className="mt-10">
            <TryAgain
              message="Error fetching projects"
              onClick={handleRetryProject}
            />
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