import { useEffect, useRef } from "react";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Join from "./pages/Join";
import { RecoilRoot } from "recoil";
import { useRecoilValue } from "recoil";
import { useFetchUserData } from "../src/hooks/useFetchUserData";
import { userAtom } from "../src/states/userAtom";
import Dashboard from "./pages/Dashboard";
import ImportRepo from "./pages/ImportRepo";
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
  const location = useLocation();
  const fetchUser = useFetchUserData();
  const hasFetched = useRef(false);
  const { isRequestLoading } = useLoading();
  const isLoading = isRequestLoading("FetchUser");

  useEffect(() => {
    const initiateFetch = async () => {
      if (!user && !hasFetched.current && !isLoading) {
        console.log("🚀 Fetching user globally... FROM APP.JSX");
        hasFetched.current = true;
        await fetchUser();
      }
    };

    initiateFetch();
  }, [fetchUser, user, isLoading]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/join" element={<Join />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/import" element={<ImportRepo />} />
    </Routes>
  );
}

export default App;
