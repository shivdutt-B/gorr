import { useRecoilState } from "recoil";
import { requestMapAtom } from "../states/loadingAtom";

interface RequestEntry {
  controller: AbortController;
  timeoutId?: NodeJS.Timeout | number;
}

export const useLoading = () => {
  const [requestMap, setRequestMap] = useRecoilState<Map<string, RequestEntry>>(requestMapAtom);

  const startLoading = (key: string, persistent: boolean = false, timeoutMs: number = 10000) => {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      console.warn(`Request [${key}] timed out after ${timeoutMs}ms. Aborting request.`);
      controller.abort("Timeout");
    }, timeoutMs);

    setRequestMap((prev) => {
      const existing = prev.get(key);
      if (existing && !persistent) {
        if (existing.timeoutId) clearTimeout(existing.timeoutId);
        existing.controller.abort();
      }

      const newMap = new Map(prev);
      newMap.set(key, { controller, timeoutId });
      return newMap;
    });

    return controller;
  };

  const stopLoading = (key: string) => {
    let wasAborted = false;

    setRequestMap((prev) => {
      const newMap = new Map(prev);
      const entry = newMap.get(key);

      if (entry) {
        if (entry.timeoutId) {
          clearTimeout(entry.timeoutId);
        }
        try {
          entry.controller.abort();
          wasAborted = true;
        } catch (error) {
          console.error("Error aborting request:", error);
        }
        newMap.delete(key);
      }

      return newMap;
    });

    return wasAborted;
  };

  const isRequestLoading = (key: string) => {
    return requestMap.has(key);
  };

  return {
    startLoading,
    stopLoading,
    isRequestLoading,
  };
};
