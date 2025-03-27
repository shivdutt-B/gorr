import { atom } from "recoil";

export interface Project {
  id: number;
  slug: string;
  gitUrl: string;
  userId: number;
  createdAt: string;
}

interface ProjectsResponse {
  status: string;
  data: Project[];
}

export const projectsAtom = atom<ProjectsResponse | null>({
  key: "projectsAtom",
  default: null,
}); 