// import { Loader2 } from "lucide-react";
// import { Button } from "./LoadingBtnSource";
// import { useLoading } from "../../hooks/useLoading";

// interface ButtonLoadingProps {
//   onCancel?: () => void;
// }

// export function ButtonLoading({ onCancel }: ButtonLoadingProps) {
//   const { cancelRequests, stopLoading } = useLoading();

//   const handleCancel = () => {
//     console.log('REACHED LOAIDNG')
//     cancelRequests();
//     onCancel?.();
//   };

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <Button
//         className="bg-red-500 text-white flex items-center gap-2 px-4 py-2"
//         onClick={handleCancel}
//       >
//         Cancel
//         <Loader2 className="animate-spin" />
//       </Button>
//     </div>
//   );
// }

// ========================================

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
