import { useEffect, useRef } from "react";
import HomeLayout from "./Layouts/HomeLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Join } from "./components/Join";
import { RecoilRoot } from "recoil";
import { useRecoilValue } from "recoil";
import { useFetchUserData } from "../src/hooks/useFetchUserData";
import { userAtom } from "./states/userAtom";
import DashboardLayout from "./Layouts/DashboardLayout";
import ImportRepoLayout from "./Layouts/ImportRepoLayout";
import DeployProjectLayout from "./Layouts/DeployProjectLayout";
import { useLoading } from "./hooks/useLoading";

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <AppWithUserCheck />
      </BrowserRouter>
    </RecoilRoot>
  );
}

function AppWithUserCheck() {
  const user = useRecoilValue(userAtom);
  const fetchUser = useFetchUserData();
  const { isLoading } = useLoading();
  const hasFetched = useRef(false);

  useEffect(() => {
    const initiateFetch = async () => {
      if (!hasFetched.current && !user && !isLoading) {
        hasFetched.current = true;
        try {
          await fetchUser();
        } catch (error) {
          console.error("Error during user fetch:", error);
        }
      }
    };

    initiateFetch();
  }, [fetchUser, user, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route exact path="/" element={<HomeLayout />} />
      <Route exact path="/join" element={<Join />} />
      <Route exact path="/dashboard/*" element={<DashboardLayout />} />
      <Route exact path="/import" element={<ImportRepoLayout />} />
      <Route exact path="/deploy" element={<DeployProjectLayout />} />
    </Routes>
  );
}

export default App;
