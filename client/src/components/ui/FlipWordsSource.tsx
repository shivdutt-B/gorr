"use client";
import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const FlipWordsSource = ({
    words = ["fast", "secure", "scalable", "reliable", "affordable"],
    duration = 1000,
    className
}) => {
    const colors = [
        "text-red-500", "text-blue-500", "text-green-500", "text-yellow-500", "text-purple-500",
        "text-pink-500", "text-indigo-500", "text-teal-500", "text-orange-500", "text-cyan-500",
        "text-lime-500", "text-rose-500", "text-emerald-500", "text-fuchsia-500", "text-sky-500"
    ];
    ;

    const [currentWord, setCurrentWord] = useState(words[0]);
    const [currentColor, setCurrentColor] = useState(colors[0]);
    const [isAnimating, setIsAnimating] = useState(false);

    const startAnimation = useCallback(() => {
        const nextIndex = (words.indexOf(currentWord) + 1) % words.length;
        setCurrentWord(words[nextIndex]);
        setCurrentColor(colors[Math.floor(Math.random() * colors.length)]); // Pick a random color
        setIsAnimating(true);
    }, [currentWord, words, colors]);

    useEffect(() => {
        if (!isAnimating)
            setTimeout(() => {
                startAnimation();
            }, duration);
    }, [isAnimating, duration, startAnimation]);

    return (
        <AnimatePresence
            onExitComplete={() => {
                setIsAnimating(false);
            }}>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 10 }}
                exit={{
                    opacity: 0,
                    y: -40,
                    x: 40,
                    filter: "blur(8px)",
                    scale: 2,
                    position: "absolute",
                }}
                className={cn(
                    `z-10 inline-block relative text-left font-bold ${currentColor}`,
                    className
                )}
                key={currentWord}>
                <span className="relative inline-block">
                    {currentWord.split("").map((letter, letterIndex) => (
                        <motion.span
                            key={currentWord + letterIndex}
                            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{
                                delay: letterIndex * 0.05,
                                duration: 0.2,
                            }}
                            className="inline-block">
                            {letter}
                        </motion.span>
                    ))}
                    {/* Underline Effect */}
                    <span
                        className={`absolute left-0 bottom-[-2px] w-full h-[2px] ${currentColor} bg-current`}
                    />
                </span>
            </motion.div>
        </AnimatePresence>
    );
};
