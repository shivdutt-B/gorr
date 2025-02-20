import { useRecoilState } from "recoil";
import { loadingAtom, requestMapAtom } from "../states/loadingAtom";

export const useLoading = () => {
    const [isLoading, setLoading] = useRecoilState(loadingAtom);
    const [requestMap, setRequestMap] = useRecoilState(requestMapAtom);

    const startLoading = (key: string) => {
        const controller = new AbortController();

        setRequestMap((prev) => {
            const newMap = new Map(prev);
            newMap.set(key, controller);
            return newMap;
        });

        setLoading(true);
        return controller.signal;
    };

    const stopLoading = (key: string) => {
        let newMap;
        
        // ✅ First, update the requestMapAtom state
        setRequestMap((prev) => {
            newMap = new Map(prev);
            newMap.delete(key);
            return newMap;
        });

        // ✅ Then, update the loading state separately (outside setRequestMap)
        setLoading(newMap.size > 0);
    };

    const cancelRequests = () => {
        setRequestMap((prev) => {
            prev.forEach((controller) => controller.abort());
            return new Map();
        });

        setLoading(false);
    };

    return { isLoading, startLoading, stopLoading, cancelRequests };
};
