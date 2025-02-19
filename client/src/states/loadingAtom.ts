import { atom } from "recoil";

export const loadingAtom = atom({
  key: "loadingState",
  default: false,
});

export const requestMapAtom = atom({
  key: "requestMapState",
  default: new Map(),
});
