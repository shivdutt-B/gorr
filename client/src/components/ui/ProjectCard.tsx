import React, { useState, useEffect } from "react";
import { GitBranch } from "lucide-react";
import { useDeleteProject } from "../../hooks/useDeleteProject";
import { useRecoilState, useRecoilValue } from "recoil";
import { projectsAtom, Project } from "../../states/projectsAtom";
import { Link } from "react-router-dom";
import { userAtom } from "../../states/userAtom";

interface ProjectCardProps {
  project: Project;
  userId: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  userId,
}) => {
  const {
    deleteProject,
    isDeleting,
    error: ProjectDeleteError,
    setError: setProjectDeleteError,
  } = useDeleteProject();
  const [projectsState, setProjectsState] = useRecoilState(projectsAtom);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const user = useRecoilValue(userAtom);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleConfirmDelete = async () => {
    const result = await deleteProject({ userId, slug: project.slug });

    if (result && result.status === "success") {
      if (projectsState && projectsState.data) {
        setProjectsState({
          ...projectsState,
          data: projectsState.data.filter((p) => p.slug !== project.slug),
        });
      }
      setShowDeleteConfirm(false);
    }
  };

  useEffect(() => {
    if (ProjectDeleteError) {
      console.log("ProjectDeleteError: ", ProjectDeleteError);
    }
  }, []);

  return (
    <div className="group block relative">
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-[#0a0a0a] rounded-md p-6 py-10 max-w-md w-full">
            {ProjectDeleteError ? (
              <>
                <h3 className="text-lg font-semibold text-red-500 mb-4 flex items-center">
                  <svg
                    fill="#FF4040"
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 inline-block mr-2"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path d="M520.741 163.801a10.234 10.234 0 00-3.406-3.406c-4.827-2.946-11.129-1.421-14.075 3.406L80.258 856.874a10.236 10.236 0 00-1.499 5.335c0 5.655 4.585 10.24 10.24 10.24h846.004c1.882 0 3.728-.519 5.335-1.499 4.827-2.946 6.352-9.248 3.406-14.075L520.742 163.802zm43.703-26.674L987.446 830.2c17.678 28.964 8.528 66.774-20.436 84.452a61.445 61.445 0 01-32.008 8.996H88.998c-33.932 0-61.44-27.508-61.44-61.44a61.445 61.445 0 018.996-32.008l423.002-693.073c17.678-28.964 55.488-38.113 84.452-20.436a61.438 61.438 0 0120.436 20.436zM512 778.24c22.622 0 40.96-18.338 40.96-40.96s-18.338-40.96-40.96-40.96-40.96 18.338-40.96 40.96 18.338 40.96 40.96 40.96zm0-440.32c-22.622 0-40.96 18.338-40.96 40.96v225.28c0 22.622 18.338 40.96 40.96 40.96s40.96-18.338 40.96-40.96V378.88c0-22.622-18.338-40.96-40.96-40.96z"></path>
                    </g>
                  </svg>
                  <p>Error Deleting Project</p>
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  {ProjectDeleteError}
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      handleCancelDelete();
                      setProjectDeleteError(null);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Confirm Deletion
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Are you sure you want to delete this project? This action
                  cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCancelDelete}
                    className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors flex items-center"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      "Yes, Delete"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div
        className={`bg-[#0a0a0a] rounded-md border border-[#1a1a1a] hover:border-[#333] transition-all duration-200 p-4 ${
          showDeleteConfirm ? "blur-sm" : ""
        }`}
      >
        <div
          className="h-[150px] w-full mb-[20px] rounded-md"
          style={{
            background: `linear-gradient(to right, 
              hsl(${Math.floor(Math.random() * 360)}, 70%, 50%), 
              hsl(${Math.floor(Math.random() * 360)}, 70%, 50%), 
              hsl(${Math.floor(Math.random() * 360)}, 70%, 50%))`,
          }}
        />
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1a1a1a] rounded-full flex items-center justify-center">
              <GitBranch className="w-4 h-4 text-gray-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[20px] font-semibold text-gray-200 truncate">
                {project.slug}
              </h3>
            </div>
          </div>

          <div>
            <a
              href={project.gitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex px-[8px] py-[4px] items-center mt-1 bg-gray-200 rounded-sm hover:bg-gray-300 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
                fill="black"
                width="16px"
                height="16px"
                viewBox="0 0 1024 1024"
              >
                <path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0 1 38.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z" />
              </svg>
              <span className="text-sm text-black font-semibold">
                {project.gitUrl?.split("/").slice(-2).join("/")}
              </span>
            </a>
          </div>

          <div className="truncate text-gray-500">
            <a
              href={project.projectUrl}
              className="flex-inline text-md font-semibold text-gray-500 hover:text-gray-400 group"
              target="_blank"
              rel="noopener noreferrer"
            >
              {project.projectUrl}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 ml-1 inline-block transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-110"
                stroke="currentColor"
              >
                <path
                  d="M7 17L17 7M17 7H8M17 7V16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              Created {new Date(project.createdAt).toLocaleDateString()} at{" "}
              {new Date(project.createdAt).toLocaleTimeString()}
            </span>
          </div>
          {/* <div className="flex mt-3 space-x-2"> */}
          <div className="flex flex-col xmob:flex-row mt-3 space-y-2 xmob:space-y-0 xmob:space-x-2">
            <Link
              to={`/deploy?repo=${encodeURIComponent(
                project.gitUrl
                  ? project.gitUrl.split("/").pop() || ""
                  : project.slug
              )}&git_url=${encodeURIComponent(
                project.gitUrl || ""
              )}&user_id=${encodeURIComponent(
                user?.id || ""
              )}&owner=${encodeURIComponent(
                user?.login || ""
              )}&redeploy=true&slug=${encodeURIComponent(project.slug)}`}
              className="text-md px-5 py-2 font-medium rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center"
            >
              Redeploy
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 ml-2"
                stroke="currentColor"
              >
                <path
                  d="M13.9998 8H18.9998V3M18.7091 16.3569C17.7772 17.7918 16.4099 18.8902 14.8079 19.4907C13.2059 20.0913 11.4534 20.1624 9.80791 19.6937C8.16246 19.225 6.71091 18.2413 5.66582 16.8867C4.62073 15.5321 4.03759 13.878 4.00176 12.1675C3.96593 10.4569 4.47903 8.78001 5.46648 7.38281C6.45392 5.98561 7.86334 4.942 9.48772 4.40479C11.1121 3.86757 12.8661 3.86499 14.4919 4.39795C16.1177 4.93091 17.5298 5.97095 18.5209 7.36556"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <button
              className="text-md px-5 py-2 font-medium rounded bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center"
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 ml-2"
                stroke="currentColor"
              >
                <path
                  d="M4 7H20"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 10L7.70141 19.3578C7.87432 20.3088 8.70258 21 9.66915 21H14.3308C15.2974 21 16.1257 20.3087 16.2986 19.3578L18 10"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
