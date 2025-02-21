"use client";
import React, { useState } from "react";
import {
    motion,
    AnimatePresence,
    useScroll,
    useMotionValueEvent,
} from "framer-motion";
import { cn } from "../../utils/cn";
import { Link } from "react-router-dom";
import { useRecoilValue} from "recoil";
import { userAtom } from "../../states/userAtom";
import { loadingAtom } from "../../states/loadingAtom";
import { Loader2 } from "lucide-react";

export const NavbarSource = ({
    navItems,
    className,
}) => {
    const user = useRecoilValue(userAtom); 
    const isLoading = useRecoilValue(loadingAtom); 

    const { scrollYProgress } = useScroll();
    const [visible, setVisible] = useState(true);


    // Displays the text inside the link which either leads to dashboard or join based on user's state.
    const buttonText = isLoading ? "Loading..." : user ? "Dashboard" : "Join";

    useMotionValueEvent(scrollYProgress, "change", (current) => {
        if (typeof current === "number") {
            const direction = current - scrollYProgress.getPrevious();
            setVisible(scrollYProgress.get() < 0.05 || direction < 0);
        }
    });

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 1, y: 0 }} 
                animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                    "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-[16px] dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2 items-center justify-center space-x-4",
                    className
                )}
            >
                {navItems.map((navItem, idx) => (
                    <a
                        key={`link=${idx}`}
                        href={navItem.link}
                        className="relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
                    >
                        <span className="block sm:hidden">{navItem.icon}</span>
                        <span className="hidden sm:block text-sm">{navItem.name}</span>
                    </a>
                ))}

                {/* Dynamic Button (Disabled while loading) */}
                {isLoading ? (
                    <div className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-[12px] opacity-50 cursor-not-allowed flex items-center gap-2 pointer-events-none">
                        <Loader2 className="animate-spin" size={18} />
                    </div>
                ) : (
                    <Link
                        to={user ? "/dashboard" : "/join"} // ✅ Redirects based on user state
                        className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-[12px]"
                    >
                        <span>{buttonText}</span>
                        <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
                    </Link>
                )}
            </motion.div>
        </AnimatePresence>
    );
};
