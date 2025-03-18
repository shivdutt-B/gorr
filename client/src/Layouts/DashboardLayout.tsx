import React, { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { userAtom } from "../states/userAtom";
import { ButtonLoading } from "../components/ui/LoadingBtn";
import { TryAgainSource } from "../components/ui/TryAgainSource";
import { useLoading } from "../hooks/useLoading";
import SearchProjectInput from "../components/ui/SearchProjectInput";
import DashBoardHeader from "../components/ui/DashBoardHeader";

function DashboardLayout() {
  const user = useRecoilValue(userAtom);
  const { isRequestLoading, stopLoading } = useLoading();
  const isLoading = isRequestLoading("FetchUser");
  const [isCanceled, setIsCanceled] = useState(false);

  const handleCancel = () => {
    console.log("Cancelling user fetch request");
    stopLoading("FetchUser");
    setIsCanceled(true);
  };

  const handleRetry = () => {
    console.log("Retrying user fetch request");
    setIsCanceled(false);
    window.location.reload(); // This will trigger a fresh fetch from App.jsx
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ButtonLoading onClick={handleCancel} />
      </div>
    );
  }

  if (isCanceled || (!user && !isLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <TryAgainSource onClick={handleRetry} />
      </div>
    );
  }

  if (user) {
    return (
      <div>
        <DashBoardHeader />
        <SearchProjectInput />
      </div>
    );
  }

  return null;
}

export default DashboardLayout;
