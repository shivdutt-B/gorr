"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../utils/cn";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../states/userAtom";
import { useLogout } from "../../hooks/useLogout";
import { useLoading } from "../../hooks/useLoading";
import { IconLogout2, IconUser } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";

type NavbarProps = { className?: string };
export function Navbar({ className }: NavbarProps) {
  const gorrLogo = new URL("../../assets/Logo/gorr_logo.svg", import.meta.url)
    .href;
  const user = useRecoilValue(userAtom);
  const { logout } = useLogout();
  const { isRequestLoading } = useLoading();
  const isUserLoading = isRequestLoading("FetchUser");

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
        "fixed inset-x-0 top-0 z-[5000] flex h-20 w-full items-center bg-transparent text-foreground backdrop-blur-[10px]",
        className,
      )}
    >
      <div className="container-gutter flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center transition-opacity hover:opacity-80"
        >
          <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white">
            <img
              src={gorrLogo}
              alt="Gorr"
              className="h-full w-full object-contain p-1"
            />
          </span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to={isUserLoading ? "#" : (user ? "/dashboard" : "/join")}
            onClick={(e) => {
              if (isUserLoading) e.preventDefault();
            }}
            className={cn(
              "inline-flex items-center gap-2 border border-white/20 bg-white/0 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-white/5 rounded-[4px]",
              isUserLoading && "opacity-80 cursor-not-allowed"
            )}
          >
            <span>Dashboard</span>
            {isUserLoading && (
              <Loader2 className="h-3 w-3 animate-spin text-white/80" />
            )}
          </Link>
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                disabled={isUserLoading}
                onClick={() => !isUserLoading && setIsProfileOpen((open) => !open)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-[4px] bg-[hsl(var(--accent))] px-4 py-2 text-xs font-medium text-black",
                  isUserLoading && "opacity-80 cursor-not-allowed"
                )}
                aria-expanded={isProfileOpen}
                aria-haspopup="menu"
              >
                {isUserLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin text-black" />
                ) : (
                  <IconUser className="h-3 w-3" />
                )}
                <span>Profile</span>
              </button>
              {isProfileOpen && (
                <div 
                className="absolute right-0 top-[calc(100%+0.75rem)] w-72 overflow-hidden rounded-[4px] border border-gray-800  p-3 text-left z-[999] bg-[hsl(var(--bg))]"
                >
                  <div className="border-b border-gray-800 pb-3">
                    <p className="text-sm font-semibold text-foreground">
                      {user.name || user.login}
                    </p>
                    <p className="text-xs text-foreground-muted">
                      {user.login}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 pt-3">
                    <Link
                      to={isUserLoading ? "#" : "/dashboard"}
                      onClick={(e) => {
                        if (isUserLoading) {
                          e.preventDefault();
                        } else {
                          setIsProfileOpen(false);
                        }
                      }}
                      className={cn(
                        "inline-flex items-between justify-between rounded-[4px] bg-[hsl(var(--accent))] py-2 px-4 text-[0.85rem] font-medium text-[#030303] transition-all hover:bg-[hsl(var(--accent-strong))]",
                        isUserLoading && "opacity-80 cursor-not-allowed"
                      )}
                    >
                      <span>Dashboard</span> <span>↗</span>
                    </Link>
                    <button
                      type="button"
                      disabled={isUserLoading}
                      onClick={handleLogout}
                      className="inline-flex items-center justify-between px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-[4px] hover:bg-red-700"
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
              to={isUserLoading ? "#" : "/join"}
              onClick={(e) => {
                if (isUserLoading) e.preventDefault();
              }}
              className={cn(
                "inline-flex items-center justify-center rounded-[4px] bg-[hsl(var(--accent))] py-2 px-4 text-xs font-medium text-[#030303] transition-all hover:bg-[hsl(var(--accent-strong))] gap-1.5",
                isUserLoading && "opacity-80 cursor-not-allowed"
              )}
            >
              <span>Auth</span>
              {isUserLoading ? (
                <Loader2 className="h-3 w-3 animate-spin text-black" />
              ) : (
                <IconUser className="h-3 w-3" />
              )}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
