import { Hero} from "../components/landing/Hero";
import Footer from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";

function HomeLayout() {
    return (
        <>
            <Navbar />
            <Hero />
            {/* <Features />
            <Architecture />
            <TechStack />
            <CTA /> */}
            <Footer />
        </>
    );
}

export default HomeLayout;
