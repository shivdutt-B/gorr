import { useEffect, useRef } from "react";
import Home from "./pages/Home"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Join from "./pages/Join";
import AuthDone from "./Layouts/DashboardLayout";
import { ButtonLoading } from "./components/ui/LoadingBtn"
import { RecoilRoot } from "recoil";


// Loading related
import { useRecoilValue } from "recoil";
import { useFetchUserData } from "../src/hooks/useFetchUserData";
import { loadingAtom } from "../src/states/loadingAtom";
import { userAtom } from "../src/states/userAtom";
// import { ButtonLoading } from "../components/ui/LoadingBtn";
// import { TryAgainSource } from "../components/ui/TryAgainSource";
import { useLoading } from "../src/hooks/useLoading";

function App() {
  const user = useRecoilValue(userAtom);
  const isLoading = useRecoilValue(loadingAtom);
  const { cancelRequests } = useLoading();
  const fetchUser = useFetchUserData();

  // ✅ Use useRef() to prevent multiple requests
  const hasFetched = useRef(false);

  // useEffect(() => {
  //   if (!user && !hasFetched.current) {
  //     console.log("🚀 Fetching GitHub user...");
  //     fetchUser();
  //     hasFetched.current = true; // ✅ Prevents duplicate calls
  //   }
  // }, [fetchUser, user]);

  useEffect(() => {
    if (!user) {
      console.log('ITS CALLED')
    }
  }, [])
  return (
    <BrowserRouter>
      <RecoilRoot>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/join" element={<Join />}></Route>
            <Route path="/dashboard" exact element={<AuthDone />}></Route>
            <Route path="/check" exact element={<div>CHEKCING HERE</div>}></Route>
            <Route path="/btn" exact element={<ButtonLoading />}></Route>
          </Routes>
        </div>
      </RecoilRoot>
    </BrowserRouter>
  );
}

export default App;
