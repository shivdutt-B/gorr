import React from "react";
import { FeaturesSection } from '../components/ui/FeaturesSection';
import { FlipWords } from "../components/ui/FlipWords";
import { Cover } from "../components/ui/Cover";
import ExtraInfo from '../components/ui/ExtraInfo';
import { Navbar } from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';

function HomeLayout() {
    return (
        <>
            <Navbar />
            <FlipWords />
            <Cover />
            {/* Commenting this component as it is irrelevent and too much of graphics and medias. */}
            {/* <FeaturesSection /> */}
            <ExtraInfo />
            <Footer />
        </>
    );
}

export default HomeLayout;
