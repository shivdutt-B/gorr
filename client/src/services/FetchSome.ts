import { useLoading } from "../hooks/useLoading";
import { useSetRecoilState } from "recoil";
import { testingAtom } from "../states/testing";
import axios from "axios";
import { useCallback } from "react";

export function useFetchSome() {
    const { startLoading, stopLoading } = useLoading();
    const setTesting = useSetRecoilState(testingAtom);

    return useCallback(async () => {
        const signal = startLoading("FetchSome"); // ✅ Get the signal for cancellation

        try {
            console.log("⏳ Fetching data...");
            const response = await axios.get("http://localhost:5000/fetchsome", { signal });

            console.log("✅ Response received:", response);

            setTimeout(() => {
                setTesting(response.data); // ✅ Update Recoil state
                stopLoading("FetchSome");  // ✅ Stop loading
            }, 0);
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log("🚫 Request canceled:", error.message);
            } else {
                console.error("❌ Error fetching data:", error);
            }
            stopLoading("FetchSome"); // ✅ Ensure loading stops even on error
        }
    }, [setTesting, startLoading, stopLoading]); // ✅ Memoized to prevent re-renders
}
