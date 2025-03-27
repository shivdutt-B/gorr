import { atom } from "recoil";

interface Project {
  id: number;
  slug: string;
  gitUrl: string;
  // Add other project properties as needed
}

export const userProjectsAtom = atom<Project[]>({
  key: "userProjectsAtom",
  default: [],
}); 