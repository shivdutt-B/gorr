// import { useCallback, useEffect, useRef } from "react";
// import { useRecoilState, useRecoilValue } from "recoil";
// import { userAtom } from "../states/userAtom";
// import { reposAtom } from "../states/reposAtom";
// import { useLoading } from "../hooks/useLoading";
// import { loadingAtom, requestMapAtom } from "../states/loadingAtom";
// import { useSetRecoilState } from "recoil";

// export function useFetchRepos() {
//   const setLoading = useSetRecoilState(loadingAtom);
//   const setRepos = useSetRecoilState(reposAtom);
//   const setRequestMap = useSetRecoilState(requestMapAtom);
//   const user = useRecoilValue(userAtom);

//   const requestMap = useRecoilValue(requestMapAtom)

//   const fetchRepos = async () => {
//       setLoading(true);
      
//       // Create a new AbortController
//       const controller = new AbortController();
//       const signal = controller.signal;

      
//       // Add artificial delay for testing
//       await new Promise(resolve => setTimeout(resolve, 5000));

//       setRequestMap((prev) => {
//           const newMap = new Map(prev);
//           newMap.set("fetchRepos", controller);
//           return newMap;
//       });

//       try {
//           const response = await fetch(user.repos_url, { signal });

//           if (!response.ok) throw new Error("Failed to fetch repositories");

//           const data = await response.json();
//           setRepos(data);
//           console.log('SYS REPO', requestMap)
//       } catch (error) {
//           if (error.name === "AbortError") {
//               console.log("Fetch request was aborted");
//           } else {
//               console.error(error);
//           }
//       } finally {
//           setLoading(false);
//           setRequestMap((prev) => {
//               const newMap = new Map(prev);
//               newMap.delete("fetchRepos");
//               return newMap;
//           });
//       }
//   };

//   return fetchRepos;
// }


// =============================================

import { useCallback } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { reposAtom } from "../states/reposAtom";
import { userAtom } from "../states/userAtom";
import { requestMapAtom } from "../states/loadingAtom";
import { useLoading } from "../hooks/useLoading";

export function useFetchRepos() {
    const { startLoading, stopLoading } = useLoading();
    const setRepos = useSetRecoilState(reposAtom);
    const user = useRecoilValue(userAtom);
    const requestMap = useRecoilValue(requestMapAtom);
    const setRequestMap = useSetRecoilState(requestMapAtom);

    const fetchRepos = useCallback(async () => {
        if (!user.repos_url) return;

        // Start loading and create an abort signal
        const signal = startLoading("fetchRepos");

        // Add artificial delay for testing
        await new Promise(resolve => setTimeout(resolve, 5000));

        try {
            const response = await fetch(user.repos_url, { signal });

            if (!response.ok) throw new Error("Failed to fetch repositories");

            const data = await response.json();
            
            // Use setTimeout to prevent blocking the main thread
            setTimeout(() => {
                setRepos(data);
                stopLoading("fetchRepos");
            }, 0);

            console.log("✅ GitHub Repos Response:", data);
            console.log("SYS REPO", requestMap);
        } catch (error) {
            stopLoading("fetchRepos");

            if (error.name === "AbortError") {
                console.log("❌ Fetch request was aborted");
            } else {
                console.error(error);
            }
        }
    }, [setRepos, user, startLoading, stopLoading, requestMap]);

    return fetchRepos;
}
