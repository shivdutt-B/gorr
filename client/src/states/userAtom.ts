import { atom } from "recoil";

interface GitHubUser {
    login: string;
    avatar_url: string;
    repos_url: string;
    html_url: string;
    name?: string;
    id?: string;
}

export const userAtom = atom<GitHubUser | null>({
    key: "userAtom",
    default: null,
});