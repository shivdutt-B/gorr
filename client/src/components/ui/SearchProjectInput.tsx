import React from "react";
import { Search, ChevronDown, Plus } from "lucide-react";
import { Link } from "react-router-dom";

function SearchProjectInput() {
  return (
    <div className="flex items-center rounded-lg space-x-2 max-w-[1300px] mx-auto">
      {/* Search Input */}
      <div className="relative flex items-center flex-grow">
        <Search className="absolute left-3 text-gray-400 w-5 h-5" />
        <input
          type="text"
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
