// import { Button } from 'aceternity-ui';

import { EvervaultCard } from "./components/ui/evervault-card";
import { FeaturesSection } from "./components/ui/FeaturesSection";
import Home from "./pages/Home"
import GorrLogo from "./assets/Logo/gorr_logo.svg"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/ui/Footer"
import { Navbar } from "./components/ui/Navbar"
// import { Join } from "./components/ui/Join";
import Join from "./pages/Join";
import AuthDone from "./pages/AuthDone";
import { ButtonLoading } from "./components/ui/LoadingBtn"
import { RecoilRoot } from "recoil";
import { useEffect } from "react";

import { userAtom } from "./states/userAtom";
import { useRecoilState } from 'recoil'

function App() {
  const [user, setUser] = useRecoilState(userAtom)

  useEffect(() => {
    console.log('USER', user)
  }, [])
  return (
    <BrowserRouter>
      <RecoilRoot>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/join" element={<Join />}></Route>
            <Route path="/auth_done" exact element={<AuthDone />}></Route>
            <Route path="/check" exact element={<div>CHEKCING HERE</div>}></Route>
            <Route path="/btn" exact element={<ButtonLoading />}></Route>
          </Routes>
        </div>
      </RecoilRoot>
    </BrowserRouter>
  );
}

export default App;
