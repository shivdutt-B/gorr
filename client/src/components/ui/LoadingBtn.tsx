import { Loader2 } from "lucide-react";
import { Button } from "./LoadingBtnSource";
import { useLoading } from "../../hooks/useLoading";

export function ButtonLoading() {
    const { cancelRequests } = useLoading();

    return (
        <div className="flex justify-center items-center h-screen">
            <Button className="bg-red-500 text-white flex items-center gap-2 px-4 py-2"
                onClick={cancelRequests} // ✅ Ensure cancel works
            >
                Cancel
                <Loader2 className="animate-spin" />
            </Button>
        </div>
    );
}
