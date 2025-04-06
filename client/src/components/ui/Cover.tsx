import React from "react";
import { CoverSource } from "./CoverSource";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../states/userAtom";

export function Cover() {
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();

  const handleDeployClick = () => {
    if (user) {
      navigate("/import");
    } else {
      navigate("/join");
    }
  };

  return (
    <div>
      <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
        Get Started With GORR <br /> and{" "}
        <CoverSource className="cursor-pointer">
          <button
            onClick={handleDeployClick}
            className="font-extrabold no-underline hover:no-underline bg-transparent focus:outline-none"
          >
            Deploy
          </button>
        </CoverSource>{" "}
        Your Website Now.
      </h1>
    </div>
  );
}
