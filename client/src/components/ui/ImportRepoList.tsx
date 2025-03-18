import React, { useState, useEffect, useRef } from "react";
import ImportRepoListSource from "./ImportRepoListSource";
import { useRecoilValue } from "recoil";
import { useFetchRepos } from "../../hooks/useFetchRepos";
import { reposAtom } from "../../states/reposAtom";
import { loadingAtom } from "../../states/loadingAtom";
import { ButtonLoading } from "../ui/LoadingBtn";
import { TryAgainSource } from "../ui/TryAgainSource";
import { useLoading } from "../../hooks/useLoading";
import { Link } from "react-router-dom";
import { userAtom } from "../../states/userAtom";

export default function ImportRepoList() {
  const repos = useRecoilValue(reposAtom);
  const isLoading = useRecoilValue(loadingAtom);
  const fetchRepos = useFetchRepos();
  const { stopLoading } = useLoading();
  const user = useRecoilValue(userAtom);
  const hasFetched = useRef(false);
  const [isCanceled, setIsCanceled] = useState(false);

  const [visibleCount, setVisibleCount] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (
      user &&
      !hasFetched.current &&
      !isCanceled &&
      (!repos || repos.length === 0)
    ) {
      fetchRepos();
      hasFetched.current = true;
    }
  }, [user, isCanceled, repos, fetchRepos]);

  const handleCancel = () => {
    console.log("Cancelling repo fetch request");
    stopLoading("fetchRepos");
    setIsCanceled(true);
  };

  const handleRetry = () => {
    console.log("Retrying repo fetch request");
    setIsCanceled(false);
    hasFetched.current = false;
    // Reset the request map before retrying
    fetchRepos();
  };

  const filteredRepos =
    repos?.filter((repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <div className="bg-[#0a0a0a] text-white p-6 rounded-xl border border-gray-800 max-w-[800px] w-full m-4 mx-auto shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Import Git Repository</h2>
      {/* Dropdown & Search */}
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
          />
        </div>
      </div>

      {/* Repository List */}
      {isCanceled ? (
        <div onClick={handleRetry}>
          <TryAgainSource />
        </div>
      ) : isLoading ? (
        <div onClick={handleCancel}>
          <ButtonLoading />
        </div>
      ) : filteredRepos.length > 0 ? (
        <ImportRepoListSource
          repositories={filteredRepos.slice(0, visibleCount)}
        />
      ) : (
        <p className="text-gray-400 text-center mt-4">No repositories found</p>
      )}

      {console.log("REP", repos)}
      {/* Footer */}
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
    </div>
  );
}

// ==================================
