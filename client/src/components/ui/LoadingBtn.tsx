import { Loader2 } from "lucide-react";
import { Button } from "./LoadingBtnSource";
import React from "react";

export function ButtonLoading() {

  return (
    <div className="flex justify-center items-center h-screen">
      <Button
        className="bg-red-500 text-white flex items-center gap-2 px-4 py-2">
        Cancel
        <Loader2 className="animate-spin" />
      </Button>
    </div>
  );
}
