import React from "react";

export const ImportRepoListSkeleton = () => {
  return (
    <div className="rounded-md border border-gray-800 flex gap-2 flex-col">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 mob:flex mob:flex-row justify-between items-center p-5 border-b border-gray-800 last:border-0 animate-pulse"
        >
          <div className="w-full mob:w-auto flex justify-between gap-4 d:inline text-md">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-800 rounded-full" />
              <div className="h-4 w-32 bg-gray-800 rounded" />
            </div>
            <div className="h-4 w-20 bg-gray-800 rounded" />
          </div>
          <div className="w-full mob:w-[80px] h-8 bg-gray-800 rounded-[4px]" />
        </div>
      ))}
    </div>
  );
};
