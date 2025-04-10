import React from "react";
import { FeaturesSection } from '../components/ui/FeaturesSection';
import { FlipWords } from "../components/ui/FlipWords";
import { Cover } from "../components/ui/Cover";
import ExtraInfo from '../components/ui/ExtraInfo';
import { Navbar } from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import { Link } from "react-router-dom";

function HomeLayout() {
    return (
        <>
            <Navbar />
            <FlipWords />
            <Cover />
            <FeaturesSection />
            <ExtraInfo />
            <Footer />
        </>
    );
}

export default HomeLayout;
