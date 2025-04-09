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
            <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
                <button 
                    onClick={() => window.location.href = '/test'} 
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}
                >
                    Go to Test Page
                </button>
            </div>
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
