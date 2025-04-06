import { atom } from "recoil";

interface Project {
  id: number;
  slug: string;
  gitUrl: string;
}

export const userProjectsAtom = atom<Project[]>({
  key: "userProjectsAtom",
  default: [],
}); 