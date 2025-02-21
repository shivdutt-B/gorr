import { useEffect, useRef } from "react";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Join from "./pages/Join";
import { RecoilRoot } from "recoil";

// Loading related
import { useRecoilValue } from "recoil";
import { useFetchUserData } from "../src/hooks/useFetchUserData";
import { userAtom } from "../src/states/userAtom";
import Dashboard from "./pages/Dashboard";

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

  useEffect(() => {
    console.log('TRIGGER BEFORE')
    if (!user && !hasFetched.current && location.pathname !== "/dashboard") {
      console.log("🚀 Fetching user globally... FROM APP.JSX");
      fetchUser();
      hasFetched.current = true;
    }
  }, [fetchUser, user, location.pathname]); // ✅ Runs only when necessary

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/join" element={<Join />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
