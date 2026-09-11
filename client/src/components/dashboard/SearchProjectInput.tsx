import React from "react";
import { Search, ChevronDown, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { searchQueryAtom } from "../../states/searchQueryAtom";
import { useLoading } from "../../hooks/useLoading";
import { userAtom } from "../../states/userAtom";
import { useFetchProjects } from "../../hooks/useFetchProjects";
import { cn } from "../../utils/cn";

function SearchProjectInput() {
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryAtom);
  const { isRequestLoading } = useLoading();
  const user = useRecoilValue(userAtom);
  const { fetchProjects } = useFetchProjects();

  const isUserLoading = isRequestLoading("FetchUser");
  const isProjectsLoading = isRequestLoading("FetchProjects");
  const isLoading = isUserLoading || isProjectsLoading;

  const handleRefresh = async () => {
    if (isLoading || !user) return;
    await fetchProjects(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const isUserDisabled = isUserLoading || !user;

  return (
    <div className="flex items-center rounded-lg space-x-2 w-full">
      {/* Refresh Button */}
      <button
        disabled={isLoading || !user}
        onClick={() => !isLoading && user && handleRefresh()}
        className={cn(
          "p-2 bg-[hsl(var(--accent))] text-black rounded-[4px] flex items-center justify-center transition-all",
          (isLoading || !user) && "opacity-50 cursor-not-allowed"
        )}
        title="Refresh projects"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(isLoading && "animate-spin")}
        >
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
      </button>
      {/* Search Input */}
      <div className="relative flex items-center flex-grow">
        <Search className="absolute left-3 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search Repositories and Projects..."
          disabled={isUserDisabled}
          className={cn(
            "pl-10 pr-3 py-[8px] bg-[hsl(var(--bg))] text-white placeholder-gray-500 border border-gray-600 rounded-[4px] focus:border-gray-400 focus:outline-none w-full text-[15px]",
            isUserDisabled && "opacity-60 cursor-not-allowed"
          )}
        />
      </div>

      {/* Add New Button - Changes to '+' on small screens */}
      <Link
        to={isUserDisabled ? "#" : "/import"}
        onClick={(e) => {
          if (isUserDisabled) e.preventDefault();
        }}
        className={cn(
          "p-2 flex items-center space-x-1 bg-[hsl(var(--accent))] text-black rounded-[4px] transition-all",
          isUserDisabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <Plus className="w-5 h-5" strokeWidth={1.5} />
      </Link>
    </div>
  );
}

export default SearchProjectInput;
