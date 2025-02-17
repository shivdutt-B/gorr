import React from "react";
import { CoverSource } from "./CoverSource";
import { Link } from "react-router-dom"

export function Cover() {
    return (
        <div>
            <h1
                className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
                Get Started With GORR <br /> and <CoverSource className="cursor-pointer"><Link to="/there"><span className="font-extrabold">Deploy</span></Link></CoverSource> Your Website Now.
            </h1>
        </div>
    );
}
