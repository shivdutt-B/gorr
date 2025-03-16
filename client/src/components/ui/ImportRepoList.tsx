import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useFetchRepos } from "../../hooks/useFetchRepos";
import { reposAtom } from "../../states/reposAtom";
import { loadingAtom } from "../../states/loadingAtom";
import { ButtonLoading } from "../ui/LoadingBtn";
import { TryAgainSource } from "../ui/TryAgainSource";
import { useLoading } from "../../hooks/useLoading";

export default function ImportRepoList() {
    const repos = useRecoilValue(reposAtom); // Get repos from Recoil state
    const isLoading = useRecoilValue(loadingAtom);
    const fetchRepos = useFetchRepos(); // ✅ Now properly memoized
    const { cancelRequests } = useLoading();

    useEffect(() => {
        // fetchRepos(); // ✅ Will not trigger infinite re-renders
        console.log('SOMETHING IS FETCHED')
    }, []); // ✅ Runs only on component mount

    return (
        <div className="bg-[#0a0a0a] max-w-[700px] w-full text-white m-4 p-4 py-8 rounded-md border border-gray-800 shadow-lg mx-auto">
            {isLoading ? (
                <div onClick={cancelRequests}>
                    <ButtonLoading />
                </div>
            ) : repos?.length > 0 ? (
                <>
                    <h2 className="text-xl font-semibold mb-4">Import Git Repository</h2>
                    <ul>
                        {repos.map((repo) => (
                            <li key={repo.id} className="mb-2 border-b border-gray-700 p-2">
                                {repo.name}
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <div onClick={cancelRequests}>
                    <TryAgainSource onClick={cancelRequests} />
                </div>
            )}
        </div>
    );
}
