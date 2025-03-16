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
    const repos = useRecoilValue(reposAtom) || []; // Ensure repos is always an array
    const isLoading = useRecoilValue(loadingAtom);
    const fetchRepos = useFetchRepos(); // Fetch repositories
    const { cancelRequests } = useLoading();
    const user = useRecoilValue(userAtom);
    const hasFetched = useRef(false);

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
        if (user && !hasFetched.current) {
            fetchRepos();
            hasFetched.current = true;
        }
    }, [fetchRepos, repos, user]);

    return (
        <div>
            <div className="bg-[#0a0a0a] text-white p-6 rounded-xl border border-gray-800 max-w-[800px] w-full m-4 mx-auto shadow-lg">
                {isLoading ? (
                    <div onClick={cancelRequests}>
                        <ButtonLoading />
                    </div>
                ) : repos.length > 0 ? (
                    <>
                        <h2 className="text-xl font-semibold mb-4">Import Git Repository</h2>

                        {/* Dropdown & Search */}
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="bg-[#0a0a0a] p-2 px-4 rounded-lg flex items-center justify-between w-1/2 cursor-pointer border border-gray-700">
                                <span className="truncate">{user?.login}</span>
                                <svg
                                    className="ml-2"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    width="20px"
                                    height="20px"
                                    viewBox="0 0 1024 1024"
                                >
                                    <path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0 1 38.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z" />
                                </svg>
                            </div>

                            <div className="bg-[#0a0a0a] p-[10px] px-4 rounded-lg flex items-center w-full border border-gray-700 transition-all duration-200 focus-within:border-gray-500">
                                <svg
                                    className="w-5 h-5 text-gray-400 mr-2"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0z"
                                    />
                                </svg>
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
                        {filteredRepos.length > 0 ? (
                            <ImportRepoListSource repositories={filteredRepos.slice(0, visibleCount)} />
                        ) : (
                            <p className="text-gray-400 text-center mt-4">No Such Repo Found</p>
                        )}

                        {/* Footer */}
                        <div className="flex flex-col items-center">
                            {/* Load More Button */}
                            {visibleCount < filteredRepos.length && (
                                <div
                                    onClick={loadMore}
                                    className="flex mt-3 text-gray-400 text-sm cursor-pointer hover:text-white transition group"
                                >
                                    <p className="transition-transform group-hover:translate-x-1">
                                        Load More
                                    </p>
                                </div>
                            )}

                            {/* Import Third-Party Repository Link */}
                            <Link
                                to="/"
                                className="mt-3 text-gray-400 text-sm cursor-pointer hover:text-white transition group"
                            >
                                <span className="transition-transform group-hover:translate-x-1">
                                    Import Third-Party Git Repository →
                                </span>
                            </Link>
                        </div>
                    </>
                ) : (
                    <div onClick={cancelRequests}>
                        <TryAgainSource onClick={cancelRequests} />
                    </div>
                )}
            </div>
        </div>
    );
}
