import React from "react";
import { Navbar } from "../components/ui/Navbar";
import ImportRepoList from "../components/ui/ImportRepoList";

function ImportRepoLayout() {
  return (
    <div className="h-[110vh] max-w-[1300px] mx-auto">
      <Navbar />
      <div className="text-center">
        <h1 className="mt-28 text-[50px] font-bold">
          Import Your Github Repository.
        </h1>
        <p className="text-gray-400 text-lg">
          To deploy a new Project, import an existing Git Repository 🚀.
        </p>
      </div>
      <div className="flex mt-10 gap-5 justify-center flex-col ">
        <ImportRepoList />
      </div>
    </div>
  );
}

export default ImportRepoLayout;
