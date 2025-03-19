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

export default function ImportRepoList() {
  const repos = useRecoilValue(reposAtom);
  const { fetchRepos, isLoading: isRepoLoading } = useFetchRepos();
  const { stopLoading, isRequestLoading } = useLoading();
  const user = useRecoilValue(userAtom);
  const hasFetched = useRef(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const isUserLoading = isRequestLoading("FetchUser");
  const isLoading = isRepoLoading || isUserLoading;

  // Reset states when component unmounts
  useEffect(() => {
    return () => {
      hasFetched.current = false;
      setIsCanceled(false);
      setError(null);
    };
  }, []);

  useEffect(() => {
    const shouldFetch =
      user &&
      !hasFetched.current &&
      !isCanceled &&
      (!repos || repos.length === 0) &&
      !isRequestLoading("fetchRepos");

    if (shouldFetch) {
      console.log("🚀 Initiating repo fetch");
      setError(null);
      hasFetched.current = true;
      fetchRepos().catch((err) => {
        console.error("Failed to fetch repos:", err);
        setError(err.message || "Failed to fetch repositories");
      });
    }
  }, [user, isCanceled, repos, fetchRepos, isRequestLoading]);

  const handleCancel = () => {
    console.log("Cancelling repo fetch request");
    stopLoading("fetchRepos");
    setIsCanceled(true);
    hasFetched.current = true;
    setError(null);
  };

  const handleRetry = () => {
    console.log("Retrying repo fetch request");
    setIsCanceled(false);
    hasFetched.current = false;
    setError(null);
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
        <div className="bg-[#0a0a0a] p-2 px-4 rounded-lg flex items-center justify-between w-1/2 cursor-pointer border border-gray-700">
          <span>{user?.login || "Loading..."}</span>
        </div>
        <div className="bg-[#0a0a0a] p-[10px] px-4 rounded-lg flex items-center w-full border border-gray-700">
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
        <div
          onClick={() => setVisibleCount(visibleCount + 5)}
          className="flex mt-3 text-gray-400 text-sm cursor-pointer hover:text-white transition group"
        >
          <p className="transition-transform group-hover:translate-x-1 text-center">
            Load More
          </p>
        </div>
      )}

      <Link
        to="/"
        className="mt-3 text-gray-400 text-sm cursor-pointer hover:text-white transition group"
      >
        <span className="transition-transform group-hover:translate-x-1">
          Import Third-Party Git Repository →
        </span>
      </Link>
    </div>
  );

  // Render main content based on state
  const renderContent = () => {
    if (isUserLoading) {
      return (
        <p className="text-gray-400 text-center mt-4">
          Loading user information...
        </p>
      );
    }

    if (!user) {
      return (
        <p className="text-gray-400 text-center mt-4">
          Please log in to view repositories
        </p>
      );
    }

    if (error) {
      return (
        <div onClick={handleRetry}>
          <TryAgainSource />
          <p className="text-red-500 text-center mt-2">{error}</p>
        </div>
      );
    }

    if (isCanceled) {
      return (
        <div onClick={handleRetry}>
          <TryAgainSource />
        </div>
      );
    }

    if (isRepoLoading) {
      return (
        <div onClick={handleCancel}>
          <ButtonLoading />
        </div>
      );
    }

    if (!repos || repos.length === 0) {
      return (
        <p className="text-gray-400 text-center mt-4">No repositories found</p>
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
