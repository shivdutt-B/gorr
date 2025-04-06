import { atom } from "recoil";

export const reposAtom = atom<{ 
  name: string; 
  lastUpdated: string; 
  gitUrl: string; 
  cloneUrl: string; 
}[]>({
  key: "reposAtom",
  default: [],
});
