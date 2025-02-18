import { Loader2 } from "lucide-react";
import { Button } from "./LoadingBtnSource";

export function ButtonLoading() {
    return (
        <div className="flex justify-center items-center h-screen">
            <Button className="bg-white text-black flex items-center gap-2 px-4 py-2">
                Cancel
                <Loader2 className="animate-spin" />
            </Button>
        </div>
    );
}
