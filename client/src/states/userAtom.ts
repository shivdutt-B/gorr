import { atom } from "recoil";

export const userAtom = atom({
  key: "userAtom", // Unique ID
  default: null,   // Default value (initial state)
});
