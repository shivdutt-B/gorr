import { Loader2 } from "lucide-react";
import { Button } from "./LoadingBtnSource";
import React from "react";

interface ButtonLoadingProps {
  onClick?: () => void;
}

export function ButtonLoading({ onClick }: ButtonLoadingProps) {
  return (
    <div className="flex justify-center items-center h-screen">
      <Button
        onClick={onClick}
        className="bg-red-500 text-white flex items-center gap-2 px-4 py-2"
      >
        Cancel
        <Loader2 className="animate-spin" />
      </Button>
    </div>
  );
}
