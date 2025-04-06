import React from "react";
import { Link } from "react-router-dom";
import { userAtom } from "../../states/userAtom";
import { useRecoilValue } from "recoil";

interface Repository {
  name: string;
  lastUpdated?: string;
  git_url?: string;
  owner?: string;
}

interface ImportRepoListSourceProps {
  repositories: Repository[];
}

const ImportRepoListSource: React.FC<ImportRepoListSourceProps> = ({
  repositories,
}) => {
  const user = useRecoilValue(userAtom);
  return (
    <div className=" rounded-md border border-gray-800 flex gap-2 flex-col">
      {repositories.map((repo, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 mob:flex mob:flex-row justify-between items-center p-5 border-b border-gray-800 last:border-0"
        >
          <div className="w-full mob:w-auto flex justify-between gap-4 d:inline text-md">
            <div className=" rounded-full flex items-center justify-center truncate">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
                fill="currentColor"
                width="20px"
                height="20px"
                viewBox="0 0 1024 1024"
              >
                <path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0 1 38.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z" />
              </svg>{" "}
              <span className="truncate">{repo.name}</span>{" "}
            </div>
            <div className="text-gray-500 text-sm">
              {" "}
              {repo.lastUpdated
                ? new Date(repo.lastUpdated).toLocaleDateString()
                : "N/A"}
            </div>
          </div>
          <Link
            to={`/deploy?repo=${encodeURIComponent(
              repo.name
            )}&git_url=${encodeURIComponent(
              repo.html_url || ""
            )}&user_id=${encodeURIComponent(
              user?.id || ""
            )}&owner=${encodeURIComponent(user?.login || "")}
            &redeploy=${encodeURIComponent(false)}`}
            className="w-full mob:w-auto bg-white text-black text-sm font-medium px-3 py-2 rounded-[4px]"
          >
            Import
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ImportRepoListSource;
