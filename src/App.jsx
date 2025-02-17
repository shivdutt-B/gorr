// import { Button } from 'aceternity-ui';

import { EvervaultCard } from "./components/ui/evervault-card";
import { FeaturesSection } from "./components/ui/FeaturesSection";
import Home from "./pages/Home"
import GorrLogo from "../src/assets/Logo/gorr_logo.svg"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/ui/Footer"

function App() {
  return (

    <div className="App">
      <BrowserRouter>
        {/* <div className="text-red-900 bold">HELLO
          <div className="w-[65px] h-[65px] flex justify-center items-center bg-white rounded-full">
            <img src={GorrLogo} className="bg-white w-[45px] h-[45px]" />
          </div>
        </div> */}
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/there" element={<div>HII</div>}></Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
