import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

interface DirectorySelectorProps {
  onSelectDirectory: (directory: string) => void;
  onClose: () => void;
  initialPath?: string;
}

interface FolderStructure {
  [key: string]: FolderStructure;
}

const DirectorySelector: React.FC<DirectorySelectorProps> = ({
  onSelectDirectory,
  onClose,
  initialPath = "./",
}) => {
  const [searchParams] = useSearchParams();
  const [folderStructure, setFolderStructure] = useState<FolderStructure>({});
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [selectedPath, setSelectedPath] = useState<string>(initialPath);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const owner = searchParams.get("owner") || "";
  const repo = searchParams.get("repo") || "";
  const branch = searchParams.get("branch") || "main";

  const toggleFolder = (path: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }

    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const selectDirectory = (path: string) => {
    path = path.slice(1); // changing path from /f1/f2 -> f1/f2
    setSelectedPath(path);
  };

  const handleContinue = () => {
    // Format the path before sending it to the parent
    const formattedPath = selectedPath === "/" || selectedPath === "" ? "./" : selectedPath;
    onSelectDirectory(formattedPath);
    onClose();
  };

  // Get repository tree from GitHub API
  const getRepoTree = async (
    owner: string,
    repo: string,
    branch: string = "main"
  ) => {
    // Add a 5-second delay for development/testing purposes
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const url = `https://api.github.com/repos/${owner.trim()}/${repo.trim()}/git/trees/${branch.trim()}?recursive=1`;
    try {
      setIsLoading(true);
      const response = await fetch(url);
      const data = await response.json();

      if (data.tree) {
        const hierarchy = buildHierarchy(data.tree);
        setFolderStructure(hierarchy);
      } else {
        setError("Failed to get repository data");
      }
    } catch (error) {
      setError("Error fetching repository structure");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Build folder hierarchy from GitHub API response
  const buildHierarchy = (tree: any[]) => {
    const root: FolderStructure = {};
    tree
      .filter((item) => item.type === "tree") // Only keep folders
      .forEach((item) => {
        const parts = item.path.split("/");
        let current = root;
        parts.forEach((part) => {
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        });
      });
    return root;
  };

  // Render folder structure recursively
  const renderFolderItem = (
    name: string,
    subFolders: FolderStructure,
    path: string
  ) => {
    const currentPath = path === "/" ? `/${name}` : `${path}/${name}`;
    const hasChildren = Object.keys(subFolders).length > 0;
    const isExpanded = expandedFolders.has(currentPath);
    const isSelected = selectedPath === currentPath.slice(1);

    return (
      <div key={name} className="w-full">
        <div
          className={`flex items-center w-full p-2 hover:bg-[#2A2A2A] rounded-sm text-gray-200 gap-2 cursor-pointer ${
            isSelected ? "bg-[#2A2A2A] font-medium text-white" : ""
          }`}
          onClick={() => selectDirectory(currentPath)}
        >
          {hasChildren && (
            <span
              onClick={(e) => toggleFolder(currentPath, e)}
              className="text-gray-400"
            >
              {isExpanded ? (
                <PlayIcon className="h-4 w-4 transform rotate-90" />
              ) : (
                <PlayIcon className="h-4 w-4" />
              )}
            </span>
          )}
          <FolderIcon className={`h-4 w-4 ${isSelected ? "text-white" : "text-gray-400"}`} />
          <span>{name}</span>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-6 mt-1">
            {Object.entries(subFolders).map(([childName, childFolders]) =>
              renderFolderItem(childName, childFolders, currentPath)
            )}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (owner && repo) {
      getRepoTree(owner, repo, branch);
    }
  }, [owner, repo, branch]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-[#0a0a0a] text-center rounded-lg p-6 max-w-md w-full max-h-[80vh] flex flex-col">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white mb-4">
            Root Directory
          </h2>
          <p className="text-[#7d7d7d] text-[13px] mb-2">
            Select the directory where your source code is located. To deploy a
            monorepo, create separate projects for other directories in the
            future.
          </p>

          {/* GitHub Repository Button */}
          <button className="flex justify-center w-full bg-transparent text-center cursor-auto rounded-md pb-3 mb-4 items-center gap-2 text-white ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 1024 1024"
              className="h-5 w-5"
            >
              <path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0 1 38.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z" />
            </svg>
            <span>{repo}</span>
          </button>

          {/* Horizontal line separator */}
          <div className="border-t border-gray-800 my-4"></div>
        </div>

        {/* Scrollable directory content */}
        <div className="overflow-auto flex-grow mb-4 scrollbar-custom">
          {isLoading && (
            <div className="space-y-2 py-4">
              {/* Root skeleton */}
              <div className="flex items-center w-full p-2 animate-pulse">
                <div className="h-4 w-4 bg-gray-700 rounded-sm mr-2"></div>
                <div className="h-4 w-40 bg-gray-700 rounded-sm"></div>
              </div>

              {/* Folder skeletons with varying widths */}
              {[...Array(7)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center w-full p-2 animate-pulse ml-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="h-4 w-4 bg-gray-700 rounded-sm mr-2"></div>
                  <div className="h-4 w-4 bg-gray-700 rounded-sm mr-2"></div>
                  <div
                    className="h-4 bg-gray-700 rounded-sm"
                    style={{ width: `${Math.random() * (160 - 80) + 80}px` }}
                  ></div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-red-500 py-4 text-center">{error}</div>
          )}

          {!isLoading && !error && (
            <div className="space-y-1 mb-6">
              {/* Root item */}
              <div
                className={`flex items-center w-full p-2 hover:bg-[#2A2A2A] rounded-md text-gray-200 gap-2 cursor-pointer ${
                  selectedPath === "" ? "bg-[#2A2A2A] font-medium text-white" : ""
                }`}
                onClick={() => selectDirectory("/")}
              >
                <FolderIcon className={`h-4 w-4 ${selectedPath === "" ? "text-white" : "text-gray-400"}`} />
                <span>{repo}</span>
              </div>

              {/* Folder structure */}
              {Object.entries(folderStructure).map(([folderName, subFolders]) =>
                renderFolderItem(folderName, subFolders, "/")
              )}
            </div>
          )}
        </div>

        <div className="mt-auto">
          {/* Horizontal line separator */}
          <div className="border-t border-gray-800 my-4"></div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-[#2A2A2A] text-gray-200 hover:bg-[#3A3A3A]"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              className="px-4 py-2 rounded-md bg-white text-black hover:bg-gray-200"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the icons separately
export const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    fill="#fff"
    height="200px"
    width="200px"
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 511.736 511.736"
    xmlSpace="preserve"
    stroke="#fff"
    strokeWidth="25"
    className={className}
  >
    <g>
      <path d="M463.973,246.776L58.853,1.549c-5.013-3.093-11.627-1.387-14.613,3.627c-1.067,1.6-1.6,3.52-1.6,5.44v490.453 c0,5.867,4.8,10.667,10.667,10.667c1.92,0,3.84-0.533,5.547-1.493l404.907-245.12c3.2-1.92,5.44-5.44,5.333-9.28 C469.093,251.896,467.066,248.589,463.973,246.776z M63.973,482.296v-452.8l374.08,226.347L63.973,482.296z"></path>
    </g>
  </svg>
);

export const FolderIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    fill="#fff"
    height="15px"
    width="15px"
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 24 24"
    xmlSpace="preserve"
    stroke="#fff"
    className={className}
  >
    <path d="M22,5.5H10.5L7.5,2.5H2c-1.1,0-2,0.9-2,2v15c0,1.1,0.9,2,2,2h20c1.1,0,2-0.9,2-2v-12C24,6.4,23.1,5.5,22,5.5z M22,19.5H2v-12h20V19.5z" />
  </svg>
);

export default DirectorySelector;
