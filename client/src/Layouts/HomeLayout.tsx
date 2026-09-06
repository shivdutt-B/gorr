import { Hero } from "../components/landing/Hero";
import Footer from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { Stats } from "../components/landing/Stats";
import { DeploymentSteps } from "../components/landing/DeploymentSteps"
import { QnASection } from "../components/landing/QnA";

function HomeLayout() {
  return (
    <div className="relative min-h-screen w-full bg-[hsl(var(--bg))] text-foreground selection:bg-[hsl(var(--accent)/0.2)] selection:text-white">
      {/* Global Continuous Ambient Light & Grid Overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:96px_96px]" />

      {/* Ambient Global Glow Accents */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[700px] w-full max-w-7xl bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,hsl(var(--accent)/0.10),transparent_70%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[1000px] -translate-x-1/2 h-[600px] w-full max-w-6xl bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,hsl(var(--accent)/0.04),transparent_70%)]" />

      <div className="relative z-10 flex flex-col">
        <Navbar />
        <Hero />
        <DeploymentSteps />
        <QnASection />
        <Footer />
      </div>
    </div>
  );
}

export default HomeLayout;
