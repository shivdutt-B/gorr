import { useRecoilState } from "recoil";
import { requestMapAtom } from "../states/loadingAtom";

export const useLoading = () => {
  const [requestMap, setRequestMap] = useRecoilState(requestMapAtom);

  const startLoading = (key: string, persistent: boolean = false) => {
    const controller = new AbortController();

    setRequestMap((prev) => {
      const existingController = prev.get(key);
      if (existingController && !persistent) {
        existingController.abort();
      }

      const newMap = new Map(prev);
      newMap.set(key, controller);
      return newMap;
    });

    return controller;
  };


  const stopLoading = (key: string) => {
    let wasAborted = false;

    setRequestMap((prev) => {
      const newMap = new Map(prev);
      const controller = newMap.get(key);

      if (controller) {
        try {
          controller.abort();
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
