import { Navbar } from "../components/layout/Navbar";
import ImportRepoList from "../components/import/ImportRepoList";

function ImportRepoLayout() {
  return (
    <div className="h-[110vh] max-w-[1300px] mx-auto">
      <Navbar />
      <div className="text-center">
        <h1 className="mt-28 text-[50px] font-normal leading-[1.05] tracking-[-0.02em] text-[hsl(var(--text-primary))] font-serif">
          Import Your Github <span className="text-accent">Repository.</span>
        </h1>
        <p className="mt-1 max-w-xl text-[1.05rem] leading-relaxed text-[hsl(var(--text-secondary))] sm:text-[1.15rem] text-center m-auto">
          To deploy a new Project, import an existing Git Repository.
        </p>
      </div>
      <div className="flex mt-5 gap-5 justify-center flex-col ">
        <ImportRepoList />
      </div>
    </div>
  );
}

export default ImportRepoLayout;
