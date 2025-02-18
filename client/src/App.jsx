// import { Button } from 'aceternity-ui';

import { EvervaultCard } from "./components/ui/evervault-card";
import { FeaturesSection } from "./components/ui/FeaturesSection";
import Home from "./pages/Home"
import GorrLogo from "./assets/Logo/gorr_logo.svg"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/ui/Footer"
import { Navbar } from "./components/ui/Navbar"
import { Join } from "./components/ui/Join";

function App() {
  return (

    <div className="App">
      <BrowserRouter>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/join" element={<Join />}></Route>
          <Route path="/auth_done" element={<div>DOEM</div>}></Route>
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
