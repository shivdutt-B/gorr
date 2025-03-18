import { useRecoilState } from "recoil";
import { loadingAtom, requestMapAtom } from "../states/loadingAtom";

export const useLoading = () => {
    const [isLoading, setLoading] = useRecoilState(loadingAtom);
    const [requestMap, setRequestMap] = useRecoilState(requestMapAtom);

    // console.log('CANCELLED LOADING');

    const startLoading = (key: string) => {
        const controller = new AbortController();
        
        setRequestMap((prev) => {
            // Abort any existing request with the same key
            const existingController = prev.get(key);
            if (existingController) {
                existingController.abort();
            }
            
            const newMap = new Map(prev);
            newMap.set(key, controller);
            console.log('SYS LOD', newMap)
            return newMap;
        });

        setLoading(true);
        return controller.signal;
    };

    const stopLoading = (key: string) => {
        setRequestMap((prev) => {
            const newMap = new Map(prev);
            const controller = newMap.get(key);
            
            // Cleanup the specific request
            if (controller) {
                controller.abort(); // Ensure the request is aborted
                newMap.delete(key);
            }
            
            // Update loading state based on remaining requests
            setTimeout(() => setLoading(newMap.size > 0), 0);
            console.log('SYS LOD2', newMap)
            return newMap;
        });
    };

    const cancelRequests = () => {
        setRequestMap((prev) => {
            // Abort all pending requests
            prev.forEach(controller => controller.abort());
            return new Map();
        });
        setLoading(false);
    };

    return { isLoading, startLoading, stopLoading, cancelRequests };
};
