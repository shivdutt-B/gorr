import { useRecoilState } from "recoil";
import { loadingAtom, requestMapAtom } from "../states/loadingAtom";

export const useLoading = () => {
    const [isLoading, setLoading] = useRecoilState(loadingAtom);
    const [requestMap, setRequestMap] = useRecoilState(requestMapAtom);

    // console.log('CANCELLED LOADING');

    const startLoading = (key: string) => {
        const controller = new AbortController();

        setRequestMap((prev) => {
            const newMap = new Map(prev); // ✅ Create a new Map instance
            newMap.set(key, controller);
            console.log('SYS LOD', newMap)
            return newMap;
        });

        setTimeout(() => setLoading(true), 0); // ✅ Ensure state update happens separately

        return controller.signal;
    };

    const stopLoading = (key: string) => {
        setRequestMap((prev) => {
            const newMap = new Map(prev);
            console.log('SYS LOD', newMap)
            newMap.delete(key);
            setTimeout(() => setLoading(newMap.size > 0), 0); // ✅ Move setLoading outside Recoil update
            console.log('SYS LOD2', newMap)
            return newMap;
        });
    };

    const cancelRequests = () => {
        setRequestMap((prev) => {
            const newMap = new Map(prev);
            console.log('SYS LOD', newMap)
            newMap.forEach((controller) => controller.abort());
            return new Map(); // ✅ Reset request map
        });

        setTimeout(() => setLoading(false), 0); // ✅ Ensure setLoading happens separately
    };

    return { isLoading, startLoading, stopLoading, cancelRequests };
};
