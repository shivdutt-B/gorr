import { atom } from "recoil";

export const requestMapAtom = atom({
  key: "requestMapState",
  default: new Map(),
});
