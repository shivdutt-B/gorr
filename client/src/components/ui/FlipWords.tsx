import React from "react";
import { FlipWordsSource } from "./FlipWordsSource";

export function FlipWords() {

    return (
        (<div className="h-[40rem] flex justify-center items-center px-4">
            <div
                className="text-5xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
                Power you website with
                <br />
                Our <FlipWordsSource /> hosting service
            </div>
        </div>)
    );
}
