import React, { useState, useEffect, useRef } from "react";
import ImportRepoListSource from "./ImportRepoListSource";
import { useRecoilValue } from "recoil";
import { useFetchRepos } from "../../hooks/useFetchRepos";
import { reposAtom } from "../../states/reposAtom";
import { ButtonLoading } from "../ui/LoadingBtn";
import { TryAgainSource } from "../ui/TryAgainSource";
import { useLoading } from "../../hooks/useLoading";
import { Link } from "react-router-dom";
import { userAtom } from "../../states/userAtom";
import { ImportRepoListSkeleton } from "./ImportRepoListSkeleton";
import { useFetchUserData } from "../../hooks/useFetchUserData";
import { LoadingSpinner } from "../ui/LoadingSpinner";

export default function ImportRepoList() {
  const repos = useRecoilValue(reposAtom);
  const { FetchRepos, error: repoError } = useFetchRepos();
  const { stopLoading, isRequestLoading } = useLoading();
  const user = useRecoilValue(userAtom);
  const hasFetched = useRef(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const isUserLoading = isRequestLoading("FetchUser");
  const isRepoLoading = isRequestLoading("FetchRepos");
  const isLoading = isRepoLoading || isUserLoading;

  const fetchUser = useFetchUserData();

  // Reset states when component unmounts or on hard refresh
  useEffect(() => {
    // Reset states on mount
    hasFetched.current = false;
    setIsCanceled(false);
    setError(null);

    // Cleanup on unmount
    return () => {
      hasFetched.current = false;
      setIsCanceled(false);
      setError(null);
    };
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    const shouldFetch =
      user &&
      !hasFetched.current &&
      !isCanceled &&
      (!repos || repos.length === 0) &&
      !isRequestLoading("FetchRepos");

    if (shouldFetch) {
      setError(null);
      hasFetched.current = true;
      FetchRepos().catch((err) => {
        console.error("Failed to fetch repos:", err);
        setError(err.message || "Failed to fetch repositories");
      });
    }
  }, [user, isCanceled, repos, FetchRepos, isRequestLoading]);

  const handleCancel = () => {
    stopLoading("FetchRepos");
    setIsCanceled(true);
    hasFetched.current = true;
    setError(null);
  };

  const handleRetry = () => {
    // setIsCanceled(false);
    // hasFetched.current = false;
    setError(null);
    setIsCanceled(false);
    hasFetched.current = false;
    fetchUser();
  };

  const filteredRepos =
    repos?.filter((repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  // Render header section
  const renderHeader = () => (
    <>
      <h2 className="text-xl font-semibold mb-4">Import Git Repository</h2>
      <div className="flex items-center space-x-2 mb-4">
        <div className="bg-[#0a0a0a] p-2 px-4 rounded-lg flex items-center justify-start w-1/2 cursor-pointer border border-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
            fill="currentColor"
            width="20px"
            height="20px"
            viewBox="0 0 1024 1024"
          >
            <path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0 1 38.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z" />
          </svg>
          <span className="truncate">{user?.login || "Loading..."}</span>
        </div>
        <div className="bg-[#0a0a0a] p-[10px] px-4 rounded-lg flex items-center w-full border border-gray-700 transition-colors focus-within:border-gray-500">
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none w-full text-sm"
            disabled={isLoading || isCanceled || !repos}
          />
        </div>
      </div>
    </>
  );

  // Render footer section
  const renderFooter = () => (
    <div className="mt-4">
      {visibleCount < filteredRepos.length && (
        <div className="flex justify-center my-3 text-gray-400 text-sm">
          <span
            className="group-hover:translate-x-1 text-center cursor-pointer hover:text-white transition group flex items-center gap-1"
            onClick={() => setVisibleCount(visibleCount + 5)}
          >
            Load More{" "}
            <svg
              className="w-5 h-5 transition transform group-hover:translate-y-1"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#00000"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M7 10L12 15L17 10"
                  stroke="#fff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
              </g>
            </svg>
          </span>
        </div>
      )}
    </div>
  );

  // Render main content based on state
  const renderContent = () => {
    if (isUserLoading) {
      return (
        <p className="text-gray-400 text-center mt-4">
          <LoadingSpinner />
        </p>
      );
    }

    if (!user && !isUserLoading) {
      return <TryAgainSource message="User not found" onClick={handleRetry} />;
    }

    if (isRepoLoading) {
      return <ImportRepoListSkeleton />;
    }

    if (repos.length === 0 && !isRepoLoading) {
      if (repoError) {
        return (
          <TryAgainSource
            message="Error loading repositories"
            onClick={handleRetry}
          />
        );
      }
      return (
        <div className="text-center py-8">
          <svg
            aria-hidden="true"
            height="40"
            viewBox="0 0 16 16"
            version="1.1"
            width="40"
            data-view-component="true"
            className="octicon octicon-repo mx-auto text-gray-400"
            fill="currentColor"
          >
            <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
          </svg>
          <h3 className="mt-4 text-xl font-semibold text-gray-200">
            No Repositories Found
          </h3>
          <p className="mt-2 text-gray-400">
            We couldn't find any repositories in your GitHub account.
          </p>
          <p className="text-gray-500 mt-1">
            Create one{" "}
            <a
              href="https://github.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              here.
            </a>
          </p>
        </div>
      );
    }

    if (filteredRepos.length === 0) {
      return (
        <p className="text-gray-400 text-center mt-4">
          No repositories match your search
        </p>
      );
    }

    return (
      <ImportRepoListSource
        repositories={filteredRepos.slice(0, visibleCount)}
      />
    );
  };

  return (
    <div className="bg-[#0a0a0a] text-white p-6 rounded-xl border border-gray-800 max-w-[800px] w-full m-4 mx-auto shadow-lg">
      {renderHeader()}
      {renderContent()}
      {!isLoading && !isCanceled && filteredRepos.length > 0 && renderFooter()}
    </div>
  );
}
