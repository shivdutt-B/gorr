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
import { useRecoilValue } from "recoil";
import { userAtom } from "../../states/userAtom";
import { useLoading } from "../../hooks/useLoading";
import { Loader2 } from "lucide-react";

export const NavbarSource = ({ navItems, className }) => {
  const user = useRecoilValue(userAtom);
  const { isRequestLoading } = useLoading();
  const isLoading = isRequestLoading("FetchUser");

  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      let previous = scrollYProgress.getPrevious();
      if (typeof previous === "number") {
        const direction = current - previous;
        setVisible(scrollYProgress.get() < 0.05 || direction < 0);
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "fixed inset-x-0 top-6 z-[5000] mx-auto flex w-[min(92vw,58rem)] items-center justify-between gap-3 rounded-2xl border border-border/70 bg-surface/80 px-4 py-3 text-foreground shadow-panel backdrop-blur-xl",
          className
        )}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          {navItems.map((navItem, idx) => {
            const isExternalAnchor = navItem.name.toLowerCase() === "about" || navItem.name.toLowerCase() === "contact";

            const navClassName = cn(
              "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-foreground-muted transition-colors hover:bg-elevated/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
              navItem.link === "/" && "bg-elevated/60 text-foreground"
            );

            if (isExternalAnchor) {
            return (
              <a
                key={`link=${idx}`}
                href={navItem.link}
                className={navClassName}
              >
                <span className="block sm:hidden">{navItem.icon}</span>
                <span className="hidden sm:block">{navItem.name}</span>
              </a>
            );
            }

            return (
              <Link key={`link=${idx}`} to={navItem.link} className={navClassName}>
                <span className="block sm:hidden">{navItem.icon}</span>
                <span className="hidden sm:block">{navItem.name}</span>
              </Link>
            );
          })}
        </div>

        {isLoading ? (
          <div className="ui-button ui-button-ghost whitespace-nowrap px-4 py-2 text-sm">
            <Loader2 className="animate-spin" size={18} />
            <span className="hidden sm:block">Loading</span>
          </div>
        ) : (
          <Link
            to={user ? "/dashboard" : "/join"}
            className="ui-button ui-button-primary whitespace-nowrap px-4 py-2 text-sm shadow-sm"
          >
            <span>{user ? "Dashboard" : "Join"}</span>
          </Link>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
