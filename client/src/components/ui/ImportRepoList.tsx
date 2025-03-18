import React, { useState, useEffect, useRef } from "react";
import ImportRepoListSource from "./ImportRepoListSource";
import { useRecoilValue } from "recoil";
import { useFetchRepos } from "../../hooks/useFetchRepos";
import { reposAtom } from "../../states/reposAtom";
import { loadingAtom, requestMapAtom } from "../../states/loadingAtom";
import { ButtonLoading } from "../ui/LoadingBtn";
import { TryAgainSource } from "../ui/TryAgainSource";
import { useLoading } from "../../hooks/useLoading";
import { Link } from "react-router-dom";
import { userAtom } from "../../states/userAtom";

export default function ImportRepoList() {
  const repos = useRecoilValue(reposAtom) || []; // Ensure repos is always an array
  const isLoading = useRecoilValue(loadingAtom);
  const fetchRepos = useFetchRepos(); // Function to fetch repositories
  const { cancelRequests, stopLoading } = useLoading();
  const user = useRecoilValue(userAtom);
  const hasFetched = useRef(false);
  const isCancelled = useRef(false);
  const requestMap = useRecoilValue(requestMapAtom);

  const [visibleCount, setVisibleCount] = useState(5); // Show 5 repos initially
  const [searchQuery, setSearchQuery] = useState(""); // Store search input

  // Function to load more repositories
  const loadMore = () => {
    setVisibleCount((prev) => prev + 5); // Increase count by 5
  };

  // Filter repositories based on search query
  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    console.log("HII", requestMap);
    if (user && !hasFetched.current && !isCancelled.current) {
      console.log("FETCHING REPOS ONCE");
      fetchRepos();
      hasFetched.current = true;
    }
  }, [user]);

  // Add new effect to handle cancellation
  useEffect(() => {
    if (!isLoading) {
      isCancelled.current = false;
    }
  }, [isLoading]);

  const handleCancel = () => {
    isCancelled.current = true;
    stopLoading("fetchRepos");
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search repositories..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 mb-4 border border-gray-700 rounded-md bg-black text-white"
      />

      {/* Show loading state */}
      {isLoading ? (
        <div onClick={handleCancel}>
          <ButtonLoading />
        </div>
      ) : filteredRepos.length === 0 ? (
        <TryAgainSource retry={fetchRepos} />
      ) : (
        <>
          {/* Repo List Component */}
          <ImportRepoListSource
            repositories={filteredRepos.slice(0, visibleCount)}
          />

          {/* Load More Button */}
          {visibleCount < filteredRepos.length && (
            <button
              onClick={loadMore}
              className="w-full mt-4 bg-white text-black text-sm font-medium px-3 py-2 rounded-md"
            >
              Load More
            </button>
          )}
        </>
      )}
    </div>
  );
}
