import { useCallback, useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../states/userAtom";
import { reposAtom } from "../states/reposAtom";
import { useLoading } from "../hooks/useLoading";
import { loadingAtom, requestMapAtom } from "../states/loadingAtom";
import { useSetRecoilState } from "recoil";

export function useFetchRepos() {
  const setLoading = useSetRecoilState(loadingAtom);
  const setRepos = useSetRecoilState(reposAtom);
  const setRequestMap = useSetRecoilState(requestMapAtom);
  const user = useRecoilValue(userAtom);

  const fetchRepos = async () => {
      setLoading(true);
      
      // Create a new AbortController
      const controller = new AbortController();
      const signal = controller.signal;
      
      setRequestMap((prev) => {
          const newMap = new Map(prev);
          newMap.set("fetchRepos", controller);
          return newMap;
      });

      try {
          const response = await fetch(user.repos_url, { signal });

          if (!response.ok) throw new Error("Failed to fetch repositories");

          const data = await response.json();
          setRepos(data);
      } catch (error) {
          if (error.name === "AbortError") {
              console.log("Fetch request was aborted");
          } else {
              console.error(error);
          }
      } finally {
          setLoading(false);
          setRequestMap((prev) => {
              const newMap = new Map(prev);
              newMap.delete("fetchRepos");
              return newMap;
          });
      }
  };

  return fetchRepos;
}
