"use client";
import React, { forwardRef, useRef } from "react";
import { cn } from "../../utils/cn";
import { AnimatedBeamSource } from "./AnimatedBeamSource";

// Assets
import GorrLogo from "../../assets/Logo/gorr_logo.svg"
import ReactLogo from "../../assets/Logo/react.svg"
import AngularLogo from "../../assets/Logo/angular.svg"
import JavaLogo from "../../assets/Logo/java.svg"
import PHPLogo from "../../assets/Logo/php.svg"
import PythonLogo from "../../assets/Logo/python.svg"
import VueLogo from "../../assets/Logo/vue.svg"

const Circle = forwardRef<
    HTMLDivElement,
    { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
                className,
            )}
        >
            {children}
        </div>
    );
});

Circle.displayName = "Circle";

export function AnimatedBeam() {
    const containerRef = useRef<HTMLDivElement>(null);
    const div1Ref = useRef<HTMLDivElement>(null);
    const div2Ref = useRef<HTMLDivElement>(null);
    const div3Ref = useRef<HTMLDivElement>(null);
    const div4Ref = useRef<HTMLDivElement>(null);
    const div5Ref = useRef<HTMLDivElement>(null);
    const div6Ref = useRef<HTMLDivElement>(null);
    const div7Ref = useRef<HTMLDivElement>(null);

    return (
        <div
            className="relative flex h-[300px] w-full items-center justify-center overflow-hidden p-10"
            ref={containerRef}
        >
            <div className="flex size-full max-h-[200px] max-w-lg flex-col items-stretch justify-between gap-10">
                <div className="flex flex-row items-center justify-between">
                    <Circle ref={div1Ref}>
                        <img src={ReactLogo} />
                    </Circle>
                    <Circle ref={div5Ref}>
                        <img src={AngularLogo} />
                    </Circle>
                </div>
                <div className="flex flex-row items-center justify-between">
                    <Circle ref={div2Ref}>
                        <img src={VueLogo} />
                    </Circle>
                    <Circle ref={div4Ref} className="size-16">
                        <img src={GorrLogo} />
                    </Circle>
                    <Circle ref={div6Ref}>
                        <img src={JavaLogo} />
                    </Circle>
                </div>
                <div className="flex flex-row items-center justify-between">
                    <Circle ref={div3Ref}>
                        <img src={PHPLogo} />
                    </Circle>
                    <Circle ref={div7Ref}>
                        <img src={PythonLogo} />
                    </Circle>
                </div>
            </div>

            <AnimatedBeamSource
                containerRef={containerRef}
                fromRef={div1Ref}
                toRef={div4Ref}
                curvature={-75}
                endYOffset={-10}
            />
            <AnimatedBeamSource
                containerRef={containerRef}
                fromRef={div2Ref}
                toRef={div4Ref}
            />
            <AnimatedBeamSource
                containerRef={containerRef}
                fromRef={div3Ref}
                toRef={div4Ref}
                curvature={75}
                endYOffset={10}
            />
            <AnimatedBeamSource
                containerRef={containerRef}
                fromRef={div5Ref}
                toRef={div4Ref}
                curvature={-75}
                endYOffset={-10}
                reverse
            />
            <AnimatedBeamSource
                containerRef={containerRef}
                fromRef={div6Ref}
                toRef={div4Ref}
                reverse
            />
            <AnimatedBeamSource
                containerRef={containerRef}
                fromRef={div7Ref}
                toRef={div4Ref}
                curvature={75}
                endYOffset={10}
                reverse
            />
        </div>
    );
}