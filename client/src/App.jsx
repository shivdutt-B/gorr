import { useEffect, useRef } from "react";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Join from "./pages/Join";
import DashboardLayout from "./Layouts/DashboardLayout";
import { ButtonLoading } from "./components/ui/LoadingBtn";
import { RecoilRoot } from "recoil";

// Loading related
import { useRecoilValue } from "recoil";
import { useFetchUserData } from "../src/hooks/useFetchUserData";
import { loadingAtom } from "../src/states/loadingAtom";
import { userAtom } from "../src/states/userAtom";
import { useLoading } from "../src/hooks/useLoading";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <RecoilRoot>
      {/* ✅ Move BrowserRouter above AppWithUserCheck */}
      <BrowserRouter>
        <AppWithUserCheck />
      </BrowserRouter>
    </RecoilRoot>
  );
}

// ✅ Now useLocation() works because it is inside <BrowserRouter>
function AppWithUserCheck() {
  const user = useRecoilValue(userAtom);
  const location = useLocation(); // ✅ Now inside <BrowserRouter>
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
