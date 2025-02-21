"use client";
import React, { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../utils/cn";
import { SparklesCore } from "./Sparkles";
import { CircleIcon } from "./cover";
import { Beam } from "./cover";

export const Cover = ({ children, className }) => {
    const [hovered, setHovered] = useState(false);
    const ref = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [beamPositions, setBeamPositions] = useState([]);

    useEffect(() => {
        if (ref.current) {
            setContainerWidth(ref.current.clientWidth ?? 0);
            const height = ref.current.clientHeight ?? 0;
            const numberOfBeams = Math.floor(height / 10);
            const positions = Array.from(
                { length: numberOfBeams },
                (_, i) => (i + 1) * (height / (numberOfBeams + 1))
            );
            setBeamPositions(positions);
        }
    }, [ref.current]);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            ref={ref}
            className="relative hover:bg-neutral-900 group/cover inline-block dark:bg-neutral-900 bg-neutral-100 px-2 py-2 transition duration-200 rounded-sm"
        >
            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ opacity: { duration: 0.2 } }}
                        className="h-full w-full overflow-hidden absolute inset-0"
                    >
                        {/* Sparkles Effect */}
                        <SparklesCore
                            background="transparent"
                            minSize={0.5}
                            maxSize={2}
                            particleDensity={400}
                            className="absolute inset-0 w-full h-full"
                            particleColor="#FFFFFF"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {beamPositions.map((position, index) => (
                <Beam
                    key={index}
                    hovered={hovered}
                    duration={Math.random() * 2 + 1}
                    delay={Math.random() * 2 + 1}
                    width={containerWidth}
                    style={{ top: `${position}px` }}
                />
            ))}

            <motion.span
                key={String(hovered)}
                animate={{
                    scale: hovered ? 0.8 : 1,
                    x: hovered ? [0, -30, 30, -30, 30, 0] : 0,
                    y: hovered ? [0, 30, -30, 30, -30, 0] : 0,
                }}
                exit={{ scale: 1, x: 0, y: 0 }}
                transition={{
                    duration: 0.2,
                    x: { duration: 0.2, repeat: Infinity, repeatType: "loop" },
                    y: { duration: 0.2, repeat: Infinity, repeatType: "loop" },
                    scale: { duration: 0.2 },
                }}
                className={cn(
                    "dark:text-white inline-block text-neutral-900 relative z-20 group-hover/cover:text-white transition duration-200",
                    className
                )}
            >
                {children}
            </motion.span>

            {/* Circle Icons */}
            <CircleIcon className="absolute -right-[2px] -top-[2px]" />
            <CircleIcon className="absolute -bottom-[2px] -right-[2px]" delay={0.4} />
            <CircleIcon className="absolute -left-[2px] -top-[2px]" delay={0.8} />
            <CircleIcon className="absolute -bottom-[2px] -left-[2px]" delay={1.6} />
        </div>
    );
};
