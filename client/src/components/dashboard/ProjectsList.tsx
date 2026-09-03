import React from "react";
import { useRecoilValue } from "recoil";
import { projectsAtom } from "../../states/projectsAtom";
import { searchQueryAtom } from "../../states/searchQueryAtom";
import { Link } from "react-router-dom";
import { ProjectCard } from "./ProjectCard";
import { userAtom } from "../../states/userAtom";

export interface Project {
  id: string;
  slug: string;
  gitUrl: string;
  createdAt: string;
}

export function ProjectsList() {
  const projectsResponse = useRecoilValue(projectsAtom);
  const searchQuery = useRecoilValue(searchQueryAtom);
  const user = useRecoilValue(userAtom);

  const projects: Project[] = projectsResponse?.data || [];

  // Filter projects based on search query
  const filteredProjects = projects.filter((project) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      project.slug.toLowerCase().includes(searchLower) ||
      project.gitUrl?.toLowerCase().includes(searchLower)
    );
  });

  if (!projects || projects.length === 0) {
    return (
      <div className="mt-5 flex flex-col items-center justify-center min-h-[450px] text-center p-8 bg-[#0a0a0a] rounded-lg border border-[#1a1a1a] shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-600 mb-6"
        >
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          <line x1="12" y1="11" x2="12" y2="17"></line>
          <line x1="9" y1="14" x2="15" y2="14"></line>
        </svg>
        <h3 className="text-xl font-semibold text-gray-300 mb-4">
          No projects found
        </h3>
        <p className="text-gray-500 mb-6 max-w-md">
          Start by importing a project from your repository to deploy it.
        </p>
        <Link
          to="/import"
          className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          Import your first project
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-2 group-hover:translate-x-1 transition-transform"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </Link>
      </div>
    );
  }

  // Show no results message when search yields no matches
  if (projects.length > 0 && filteredProjects.length === 0) {
    return (
      <div className="mt-5 flex flex-col items-center justify-center min-h-[450px] text-center p-8 bg-[#0a0a0a] rounded-lg border border-[#1a1a1a] shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-600 mb-6"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <h3 className="text-xl font-semibold text-gray-300 mb-4">
          No matching projects found
        </h3>
        <p className="text-gray-500 mb-6">
          Try adjusting your search query to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {filteredProjects.map((project: Project) => (
        <ProjectCard key={project.id} project={project} userId={user.id} />
      ))}
    </div>
  );
}
