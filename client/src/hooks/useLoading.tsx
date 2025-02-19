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
        setRequestMap((prev) => {
            const newMap = new Map(prev);
            newMap.delete(key);
            return newMap;
        });

        // ✅ Ensure this runs **outside** state update functions
        setTimeout(() => {
            setLoading((prev) => {
                return requestMap.size === 0 ? false : prev;
            });
        }, 0);
    };

    const cancelRequests = () => {
        requestMap.forEach((controller) => controller.abort());
        setRequestMap(new Map());
        setLoading(false);
    };

    return { isLoading, startLoading, stopLoading, cancelRequests };
};
