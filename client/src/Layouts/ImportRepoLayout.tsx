import { Navbar } from "../components/layout/Navbar";
import ImportRepoList from "../components/import/ImportRepoList";

function ImportRepoLayout() {
  return (
    <div className="relative min-h-screen w-full bg-[hsl(var(--bg))] text-foreground selection:bg-[hsl(var(--accent)/0.2)] selection:text-white">
      {/* Global Continuous Ambient Light & Grid Overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:96px_96px]" />

      {/* Ambient Global Glow Accents */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[700px] w-full max-w-7xl bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,hsl(var(--accent)/0.10),transparent_70%)]" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="container-gutter pt-28 pb-16 flex-grow">
          <div className="text-center">
            <h1 className="text-[clamp(2.2rem,4vw,3.2rem)] font-normal leading-[1.05] tracking-[-0.02em] text-[hsl(var(--text-primary))] font-serif">
              Import Your Github <span className="text-accent">Repository.</span>
            </h1>
            <p className="mt-2 max-w-xl text-[1.05rem] leading-relaxed text-[hsl(var(--text-secondary))] sm:text-[1.15rem] text-center m-auto">
              To deploy a new Project, import an existing Git Repository.
            </p>
          </div>
          <div className="flex mt-6 gap-5 justify-center flex-col">
            <ImportRepoList />
          </div>
        </main>
      </div>
    </div>
  );
}

export default ImportRepoLayout;
