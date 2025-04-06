import React from "react";
import { Search, ChevronDown, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { searchQueryAtom } from "../../states/searchQueryAtom";
import { useLoading } from "../../hooks/useLoading";
import axios from "axios";
import { userAtom } from "../../states/userAtom";
import { projectsAtom } from "../../states/projectsAtom";
import { useSetRecoilState } from "recoil";

function SearchProjectInput() {
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryAtom);
  const { startLoading, stopLoading } = useLoading();
  const user = useRecoilValue(userAtom);
  const setProjects = useSetRecoilState(projectsAtom);

  const handleRefresh = async () => {
    try {
      startLoading("FetchProjects");

      const url = `${
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
      }/projects?userId=${user?.id}`;

      const response = await axios.get(url);

      console.log("response: ", response);
      if (response.status === 200) {
        setProjects(response.data);
      }
    } catch (error: any) {
      setProjects(null);
    } finally {
      stopLoading("FetchProjects");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex items-center rounded-lg space-x-2 max-w-[1300px] mx-auto">
      {/* Refresh Button */}
      <button
        onClick={() => handleRefresh()}
        className="p-2 bg-[#0a0a0a] text-gray-400 hover:text-white border border-gray-600 rounded-[3px] flex items-center justify-center transition-colors"
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
          className="pl-10 pr-3 py-[8px] bg-[#0a0a0a] text-white placeholder-gray-500 border border-gray-600 rounded-[3px] focus:border-gray-400 focus:outline-none w-full text-[15px]"
        />
      </div>

      {/* Add New Button - Changes to '+' on small screens */}
      <Link
        to="/import"
        className="px-3 py-[8px] flex items-center space-x-1 bg-white text-black border border-gray-300 rounded-[3px] hover:bg-gray-200"
      >
        <span className="text-[14px] font-[600] hidden sm:block">
          Add New...
        </span>
        <Plus className="w-5 h-5 sm:hidden" />
        <ChevronDown className="w-4 h-4 hidden sm:block" />
      </Link>
    </div>
  );
}

export default SearchProjectInput;
