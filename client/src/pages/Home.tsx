import React, { useEffect, useRef } from "react";
import { FeaturesSection } from '../components/ui/FeaturesSection';
import { FlipWords } from "../components/ui/FlipWords";
import { Cover } from "../components/ui/Cover";
import ExtraInfo from '../components/ui/ExtraInfo';
import { Navbar } from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
// Testing
import { testingAtom } from '../states/testing';
import { useRecoilValue } from 'recoil';
import { loadingAtom } from '../states/loadingAtom';
import { useLoading } from '../hooks/useLoading';
import { useFetchSome } from "../services/FetchSome";
import { ButtonLoading } from "../components/ui/LoadingBtn";

function Home() {
    const testing = useRecoilValue(testingAtom);
    const isLoading = useRecoilValue(loadingAtom);
    const { cancelRequests } = useLoading();
    const fetchSome = useFetchSome();

    // ✅ Use useRef() to prevent multiple requests
    const hasFetched = useRef(false);

    useEffect(() => {
        if (!testing && !hasFetched.current) {
            console.log("🚀 Fetching data...");
            fetchSome();
            hasFetched.current = true; // ✅ Prevents duplicate calls
        }
    }, [fetchSome, testing]);

    return (
        <div>
            {isLoading ? (
                <div onClick={cancelRequests}>
                    <ButtonLoading />
                </div>
            ) : testing ? (
                <div>
                    <Navbar />
                    <FlipWords />
                    <Cover />
                    <FeaturesSection />
                    <ExtraInfo />
                    <Footer />
                </div>
            ) : (
                <p>Failed to load user data. Please try logging in again.</p>
            )}
        </div>
    );
}

export default Home;
