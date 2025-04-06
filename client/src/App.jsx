import { useEffect, useRef } from "react";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Join from "./pages/Join";
import { RecoilRoot } from "recoil";
import { useRecoilValue } from "recoil";
import { useFetchUserData } from "../src/hooks/useFetchUserData";
import { userAtom } from "./states/userAtom";
import Dashboard from "./pages/Dashboard";
import ImportRepo from "./pages/ImportRepo";
import Deploy from "./pages/Deploy";
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
      <Route path="/" element={<Home />} />
      <Route path="/join" element={<Join />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/import" element={<ImportRepo />} />
      <Route path="/deploy" element={<Deploy />} />
    </Routes>
  );
}

export default App;
