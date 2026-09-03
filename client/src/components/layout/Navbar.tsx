"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../utils/cn";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../states/userAtom";
import { useLogout } from "../../hooks/useLogout";
import { IconLogout2, IconUser } from "@tabler/icons-react";

type NavbarProps = {
  className?: string;
};

export function Navbar({ className }: NavbarProps) {
  const gorrLogo = new URL("../../assets/Logo/gorr_logo.svg", import.meta.url)
    .href;
  const user = useRecoilValue(userAtom);
  const { logout } = useLogout();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handlePointerDown = (event: globalThis.MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (!user) {
      setIsProfileOpen(false);
    }
  }, [user]);

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await logout();
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[5000] flex h-20 w-full items-center justify-between bg-transparent px-6 text-foreground backdrop-blur-[10px] sm:px-8",
        className,
      )}
    >
      <Link
        to="/"
        className="flex items-center transition-opacity hover:opacity-80"
      >
        <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white">
          <img
            src={gorrLogo}
            alt="Gorr"
            className="h-full w-full object-contain p-1"
          />
        </span>
      </Link>

      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 border border-white/20 bg-white/0 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/5 rounded-full"
        >
          <span>Dashboard</span>
        </Link>

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen((open) => !open)}
              className="inline-flex items-center gap-2 border border-emerald-400/20 bg-emerald-500 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-emerald-400"
              aria-expanded={isProfileOpen}
              aria-haspopup="menu"
            >
              <IconUser className="h-4 w-4" />
              <span>Profile</span>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-[calc(100%+0.75rem)] w-72 overflow-hidden border border-white/10 bg-[#0b0c11]/95 p-3 text-left shadow-panel backdrop-blur-[10px]">
                <div className="border-b border-white/10 px-3 pb-3">
                  <p className="text-sm font-semibold text-foreground">
                    {user.name || user.login}
                  </p>
                  <p className="text-xs text-foreground-muted">{user.login}</p>
                </div>

                <div className="flex flex-col gap-2 pt-3">
                  <Link
                    to="/dashboard"
                    onClick={() => setIsProfileOpen(false)}
                    className="inline-flex items-center justify-center rounded-full bg-[hsl(var(--accent))] py-2 px-4 text-[0.85rem] font-medium text-[#030303] transition-all hover:bg-[hsl(var(--accent-strong))]"
                  >
                    <span>Dashboard</span>
                    <span>↗</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center justify-between px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                  >
                    <span>Logout</span>
                    <IconLogout2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/join"
            className="inline-flex items-center justify-center rounded-full bg-[hsl(var(--accent))] py-2 px-4 text-[0.85rem] font-medium text-[#030303] transition-all hover:bg-[hsl(var(--accent-strong))] gap-1"
          >
            <span>Auth</span>
            <IconUser className="h-4 w-4" />
          </Link>
        )}
      </div>
    </header>
  );
}
