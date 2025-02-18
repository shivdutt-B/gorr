// import { Button } from 'aceternity-ui';

import { EvervaultCard } from "./components/ui/evervault-card";
import { FeaturesSection } from "./components/ui/FeaturesSection";
import Home from "./pages/Home"
import GorrLogo from "./assets/Logo/gorr_logo.svg"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/ui/Footer"
import { Navbar } from "./components/ui/Navbar"
import { Join } from "./components/ui/Join";
import AuthDone from "./pages/AuthDone";
import { RecoilRoot } from "recoil";
import { ButtonLoading } from "./components/ui/LoadingBtn"

function App() {
  return (
    <RecoilRoot>
      <div className="App">
        <BrowserRouter>
          {/* <Navbar /> */}
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/join" element={<Join />}></Route>
            <Route path="/auth_done" exact element={<AuthDone />}></Route>
            <Route path="/check" exact element={<div>CHEKCING HERE</div>}></Route>
            <Route path="/btn" exact element={<ButtonLoading />}></Route>
          </Routes>
          {/* <ButtonLoading /> */}
          {/* <Footer /> */}
        </BrowserRouter>
      </div>
    </RecoilRoot>
  );
}

export default App;
