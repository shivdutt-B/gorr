import { Folder, FolderCode } from "lucide-react";
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

interface GitHubTreeItem {
  path: string;
  type: "tree" | "blob";
  sha: string;
  url: string;
}

const DirectorySelector: React.FC<DirectorySelectorProps> = ({
  onSelectDirectory,
  onClose,
  initialPath = "./",
}) => {
  const [searchParams] = useSearchParams();
  const [folderStructure, setFolderStructure] = useState<FolderStructure>({});
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set([""]),
  );
  const [selectedPath, setSelectedPath] = useState<string>(
    initialPath === "./" ? "" : initialPath,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const owner = searchParams.get("owner") || "";
  const repo = searchParams.get("repo") || "";
  const branch = searchParams.get("branch") || "main";

  const handleFolderClick = (path: string) => {
    setSelectedPath(path);

    // Toggle expand/collapse simultaneously when row is clicked
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

  const handleContinue = () => {
    const formattedPath =
      selectedPath === "" || selectedPath === "/" ? "./" : `./${selectedPath}`;
    onSelectDirectory(formattedPath);
    onClose();
  };

  const getRepoTree = async (
    ownerParam: string,
    repoParam: string,
    branchParam: string = "main",
  ) => {
    const cleanOwner = ownerParam.trim();
    const cleanRepo = repoParam.trim();
    const cleanBranch = branchParam.trim();

    if (!cleanOwner || !cleanRepo) {
      setError("Missing repository URL parameters.");
      setIsLoading(false);
      return;
    }

    const url = `https://api.github.com/repos/${cleanOwner}/${cleanRepo}/git/trees/${cleanBranch}?recursive=1`;
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.tree && Array.isArray(data.tree)) {
        const hierarchy = buildHierarchy(data.tree);
        setFolderStructure(hierarchy);
      } else {
        setError("Unable to parse repository directory tree.");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error fetching repository tree.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const buildHierarchy = (tree: GitHubTreeItem[]) => {
    const root: FolderStructure = {};
    tree
      .filter((item) => item.type === "tree")
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

  const renderFolderNode = (
    name: string,
    subFolders: FolderStructure,
    currentPath: string,
  ) => {
    const hasChildren = Object.keys(subFolders).length > 0;
    const isExpanded = expandedFolders.has(currentPath);
    const isSelected = selectedPath === currentPath;

    return (
      <div key={currentPath || "root"} className="w-full flex flex-col">
        {/* Directory Item Row */}
        <div
          onClick={() => handleFolderClick(currentPath)}
          className={`group flex items-center h-8 px-2 rounded-md text-[15px] transition-colors cursor-pointer select-none gap-2 ${
            isSelected
              ? "text-[#CCFF00] font-medium"
              : "text-gray-300 hover:text-white"
          }`}
        >
          {/* Chevron Indicator */}
          {hasChildren ? (
            <ChevronIcon
              className={`h-3.5 w-3.5 shrink-0 transition-transform duration-150 ${
                isExpanded ? "rotate-90" : ""
              } ${isSelected ? "text-[#CCFF00]" : "text-gray-400 group-hover:text-white"}`}
            />
          ) : (
            <span className="w-3.5 shrink-0" />
          )}

          {/* Folder Icon */}
          <Folder
            className={`h-4 w-4 shrink-0 ${
              isSelected
                ? "text-[#CCFF00]"
                : "text-gray-400 group-hover:text-gray-200"
            }`}
          />

          {/* Directory Name */}
          <span className="truncate">{name}</span>
        </div>

        {/* Child Subfolders */}
        {hasChildren && isExpanded && (
          <div className="ml-4 pl-3 border-l border-white/10 my-0.5 space-y-0.5">
            {Object.entries(subFolders).map(([childName, childFolders]) => {
              const childPath = currentPath
                ? `${currentPath}/${childName}`
                : childName;
              return renderFolderNode(childName, childFolders, childPath);
            })}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (owner && repo) {
      getRepoTree(owner, repo, branch);
    } else {
      setIsLoading(false);
      setError("Repository details not found in query parameters.");
    }
  }, [owner, repo, branch]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0B0C10] border border-white/10 rounded-md max-w-[520px] w-full h-[520px] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="p-5 pb-4 border-b border-white/10 flex flex-col gap-2 bg-[#090A0F]">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">
              Select Root Directory
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Select the directory where your project source code is located.
          </p>

          {/* GitHub Repository Info Badge */}
          <div className="inline-flex items-center w-max px-[6px] py-[2px] mt-1 bg-gray-200 rounded-[2px] hover:bg-gray-300 transition-colors">
            <GithubIcon className="h-4 w-4 text-black mr-1 shrink-0" />
            <span className="text-black text-[13px] font-[450] whitespace-nowrap">
              {owner || "owner"}/{repo || "repository"}
            </span>
          </div>
        </div>

        {/* Scrollable Folder Tree View */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 scrollbar-custom bg-[#0B0C10]">
          {isLoading && (
            <div className="space-y-2 py-2">
              {[...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 h-8 px-2 animate-pulse"
                >
                  <div className="h-4 w-5 bg-white/10 rounded-xs" />
                  <div className="h-4 w-6 bg-white/10 rounded-xs" />
                  <div
                    className="h-4 bg-white/10 rounded-xs"
                    style={{ width: `${((idx % 3) + 1) * 25 + 35}%` }}
                  />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="h-full flex flex-col items-center justify-center p-4 text-center">
              <p className="text-xs text-red-400 mb-2">{error}</p>
              <button
                onClick={() => getRepoTree(owner, repo, branch)}
                className="text-xs text-gray-300 underline hover:text-white"
              >
                Retry
              </button>
            </div>
          )}

          {!isLoading && !error && (
            <div className="space-y-0.5">
              {renderFolderNode(repo || "Root", folderStructure, "")}
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="px-5 py-4 border-t border-white/10 bg-[#090A0F] flex items-center justify-between gap-3">
          <div className="truncate text-sm text-gray-400">
            Path:{" "}
            <span className="text-sm font-normal text-[#CCFF00]">
              {selectedPath ? `./${selectedPath}` : "./"}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium rounded text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              disabled={isLoading || !!error}
              className="px-4 py-2 text-xs font-semibold rounded bg-[#CCFF00] text-black hover:bg-[#b8e600] active:scale-[0.98] disabled:opacity-50 transition-all shadow-sm"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// UI SVG Icons
export const ChevronIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

export const FolderIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg fill="currentColor" viewBox="0 0 24 24" className={className}>
    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
  </svg>
);

export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export const GithubIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg fill="currentColor" viewBox="0 0 24 24" className={className}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export default DirectorySelector;
