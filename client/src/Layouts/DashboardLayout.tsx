// import React, { useEffect, useRef } from "react";
// import { useRecoilValue } from "recoil";
// import { useFetchUserData } from "../hooks/useFetchUserData";
// import { loadingAtom } from "../states/loadingAtom";
// import { userAtom } from "../states/userAtom";
// import { ButtonLoading } from "../components/ui/LoadingBtn";
// import { TryAgainSource } from "../components/ui/TryAgainSource";
// import { useLoading } from "../hooks/useLoading";
// import { Navbar } from "../components/ui/Navbar";
// import SearchProjectInput from "../components/ui/SearchProjectInput";
// import DashBoardHeader from "../components/ui/DashBoardHeader";

// function DashboardLayout() {
//   const user = useRecoilValue(userAtom);
//   const isLoading = useRecoilValue(loadingAtom);
//   const { cancelRequests, stopLoading } = useLoading();
//   const fetchUser = useFetchUserData();

//   const hasFetched = useRef(false);

//   const handleCancel = () => {
//     console.log("HERE IAM");
//     stopLoading("fetchUser");
//   };

//   useEffect(() => {
//     if (!user && !hasFetched.current) {
//       fetchUser();
//       hasFetched.current = true;
//     }
//   }, [fetchUser, user]);

//   return (
//     <div>
//       {isLoading ? (
//         <div onClick={handleCancel}>
//           <ButtonLoading />
//         </div>
//       ) : user ? (
//         <div className="">
//           <DashBoardHeader />
//           <SearchProjectInput />
//         </div>
//       ) : (
//         <div onClick={cancelRequests}>
//           <TryAgainSource onClick={cancelRequests} />
//         </div>
//       )}
//     </div>
//   );
// }

// export default DashboardLayout;

// ========================================

import React, { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { useFetchUserData } from "../hooks/useFetchUserData";
import { loadingAtom } from "../states/loadingAtom";
import { userAtom } from "../states/userAtom";
import { ButtonLoading } from "../components/ui/LoadingBtn";
import { TryAgainSource } from "../components/ui/TryAgainSource";
import { useLoading } from "../hooks/useLoading";
import { Navbar } from "../components/ui/Navbar";
import SearchProjectInput from "../components/ui/SearchProjectInput";
import DashBoardHeader from "../components/ui/DashBoardHeader";

function DashboardLayout() {
  const user = useRecoilValue(userAtom);
  const isLoading = useRecoilValue(loadingAtom);
  const { stopLoading } = useLoading();
  const fetchUser = useFetchUserData();

  const hasFetched = useRef(false);
  const [isCanceled, setIsCanceled] = React.useState(false);

  const handleCancel = () => {
    console.log("HERE I AM");
    stopLoading("FetchUser"); // ✅ Cancel user fetch request
    setIsCanceled(true);
  };

  const handleRetry = () => {
    setIsCanceled(false);
    hasFetched.current = false;
    fetchUser();
  };

  // useEffect(() => {
  //   if (!user && !hasFetched.current && !isCanceled) {
  //     fetchUser();
  //     hasFetched.current = true;
  //   }
  // }, [fetchUser, user, isCanceled]);

  return (
    <div>
      {isCanceled ? (
        <div onClick={handleRetry}>
          <TryAgainSource onRetry={handleRetry} />
        </div>
      ) : isLoading ? (
        <div onClick={handleCancel}>
          <ButtonLoading />
        </div>
      ) : user ? (
        <div>
          <DashBoardHeader />
          <SearchProjectInput />
        </div>
      ) : (
        <div onClick={handleRetry}>
          <TryAgainSource onRetry={handleRetry} />
        </div>
      )}
    </div>
  );
}

export default DashboardLayout;
