import { atom } from "recoil";

export const testingAtom = atom({
    key: "testingAtom",
    default: "initial value", // No user data initially
});
