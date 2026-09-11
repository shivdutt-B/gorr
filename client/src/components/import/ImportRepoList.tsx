import React, { useState, useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { useFetchRepos } from "../../hooks/useFetchRepos";
import { reposAtom } from "../../states/reposAtom";
import { useLoading } from "../../hooks/useLoading";
import { Link } from "react-router-dom";
import { userAtom } from "../../states/userAtom";
import { ImportRepoListSkeleton } from "./ImportRepoListSkeleton";
import { useFetchUserData } from "../../hooks/useFetchUserData";
import { TryAgain } from "../common/TryAgain";

export default function ImportRepoList() {
  const repos = useRecoilValue(reposAtom);
  const { FetchRepos, error: repoError } = useFetchRepos();
  const { isRequestLoading } = useLoading();
  const user = useRecoilValue(userAtom);
  const hasFetched = useRef(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const isUserLoading = isRequestLoading("FetchUser");
  const isRepoLoading = isRequestLoading("FetchRepos");
  const isLoading = isRepoLoading || isUserLoading;

  const fetchUser = useFetchUserData();

  useEffect(() => {
    hasFetched.current = false;
    return () => {
      hasFetched.current = false;
    };
  }, []);

  useEffect(() => {
    const shouldFetch =
      user &&
      !hasFetched.current &&
      (!repos || repos.length === 0) &&
      !isRequestLoading("FetchRepos");

    if (shouldFetch) {
      hasFetched.current = true;
      FetchRepos().catch((err) => {
        console.error("Failed to fetch repos:", err);
      });
    }
  }, [user, repos, FetchRepos, isRequestLoading]);

  const handleRetryUser = () => {
    hasFetched.current = false;
    fetchUser();
  };

  const handleRetryRepo = () => {
    hasFetched.current = false;
    FetchRepos(true);
  };

  const filteredRepos =
    repos?.filter((repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const renderHeader = () => (
    <>
      <div className="flex items-stretch gap-3 mb-4">
        <div className="bg-white p-2 px-3 rounded-[4px] flex items-center justify-start w-1/3">
          <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="black"
              width="20px"
              height="20px"
              viewBox="0 0 1024 1024"
              className="text-gray-200"
            >
              <path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0 1 38.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z" />
            </svg>
          </div>
          <span className="truncate text-sm font-medium text-black ">
            {user?.login || "Loading..."}
          </span>
        </div>

        <div className="bg-[hsl(var(--bg))] p-2 px-3 rounded-[4px] flex items-center w-full border border-gray-800 transition-colors focus-within:border-gray-700">
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none w-full text-sm text-gray-200 placeholder-gray-500"
            disabled={isLoading || !repos}
          />
        </div>
      </div>
    </>
  );

  const renderFooter = () => (
    <div className="mt-4">
      {visibleCount < filteredRepos.length && (
        <div className="flex justify-center my-2 text-gray-500 text-sm">
          <span
            className="group cursor-pointer hover:text-[hsl(var(--accent))] transition flex items-center gap-1 text-sm font-medium"
            onClick={() => setVisibleCount(visibleCount + 5)}
          >
            Load More{" "}
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-y-0.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
            >
              <path
                d="M7 10L12 15L17 10"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    if (isUserLoading) {
      return <ImportRepoListSkeleton />;
    }

    if (!user && !isUserLoading) {
      return (
        <div className="py-4">
          <TryAgain message="User not found" onClick={handleRetryUser} />
        </div>
      );
    }

    if (isRepoLoading) {
      return <ImportRepoListSkeleton />;
    }

    if ((repoError || repos === null) && !isRepoLoading) {
      return (
        <div className="py-4">
          <TryAgain message="Error loading repositories" onClick={handleRetryRepo} />
        </div>
      );
    }

    if (repos && repos.length === 0 && !isRepoLoading) {
      return (
        <div className="text-center py-8">
          <svg
            aria-hidden="true"
            height="40"
            viewBox="0 0 16 16"
            version="1.1"
            width="40"
            data-view-component="true"
            className="octicon octicon-repo mx-auto text-gray-500 mb-3"
            fill="currentColor"
          >
            <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
          </svg>
          <h3 className="text-lg font-semibold text-gray-200">
            No Repositories Found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            We couldn't find any repositories in your GitHub account.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Create one{" "}
            <a
              href="https://github.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              here.
            </a>
          </p>
        </div>
      );
    }

    if (filteredRepos.length === 0) {
      return (
        <p className="text-gray-500 text-sm text-center py-6">
          No repositories match your search
        </p>
      );
    }

    const displayedRepos = filteredRepos.slice(0, visibleCount);

    return (
      <div className="rounded-[4px] border border-gray-800 flex flex-col divide-y divide-gray-800 overflow-hidden">
        {displayedRepos.map((repo: any, index: number) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 gap-3 bg-transparent hover:bg-[#1a1a1a]/40 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  width="20px"
                  height="20px"
                  viewBox="0 0 1024 1024"
                  className="text-gray-200"
                >
                  <path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0 1 38.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z" />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-gray-200 truncate">
                  {repo.name}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Updated{" "}
                  {repo.lastUpdated
                    ? new Date(repo.lastUpdated).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            <Link
              to={`/deploy?repo=${encodeURIComponent(
                repo.name
              )}&git_url=${encodeURIComponent(
                repo.html_url || ""
              )}&user_id=${encodeURIComponent(
                user?.id || ""
              )}&owner=${encodeURIComponent(
                user?.login || ""
              )}&redeploy=${encodeURIComponent(false)}`}
              className="w-full sm:w-auto text-center text-[12px] px-3 py-1 font-medium rounded-[3px] bg-[hsl(var(--accent))] text-black transition-colors shrink-0"
            >
              Import
            </Link>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="text-white p-6 rounded-[4px] max-w-[800px] w-full my-4 mx-auto">
      {renderHeader()}
      {renderContent()}
      {!isLoading && filteredRepos.length > 0 && renderFooter()}
    </div>
  );
}