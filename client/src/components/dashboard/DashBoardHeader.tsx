import React, { useState, useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../states/userAtom";
import GorrLogo from "../../assets/Logo/gorr_logo.svg";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLogout } from "../../hooks/useLogout";
import { useLoading } from "../../hooks/useLoading";
import { cn } from "../../utils/cn";

function DashBoardHeader() {
  const user = useRecoilValue(userAtom);
  const { logout } = useLogout();
  const { isRequestLoading } = useLoading();
  const isUserLoading = isRequestLoading("FetchUser");

  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or when user is loading
  useEffect(() => {
    if (isUserLoading) {
      setIsOpen(false);
    }
  }, [isUserLoading]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
      setShowConfirmation(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <div className="relative flex items-center justify-between py-4 text-white container-gutter">
        {/* Left Section */}
        <div className="flex items-center space-x-2">
          <Link
            to="/"
            className="w-[45px] h-[45px] bg-white rounded-full flex items-center justify-center"
          >
            <img src={GorrLogo} alt="Logo" className="w-[35px] h-[35px]" />
          </Link>
          <span className="text-gray-400">/</span>

          {/* Project Name */}
          <div className="flex items-center space-x-1">
            {user?.login ? (
              <span className="font-medium truncate max-w-[200px] inline-block">
                {user.login}'s projects
              </span>
            ) : (
              <div className="h-5 w-36 bg-white/20 rounded-[4px] animate-pulse" />
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4 text-gray-300 relative">
          {/* Avatar */}
          <div className="relative">
            <div
              ref={avatarRef}
              className={cn(
                "w-[45px] h-[45px] bg-white/20 rounded-full overflow-hidden flex items-center justify-center transition-opacity",
                isUserLoading || !user
                  ? "cursor-not-allowed pointer-events-none opacity-80"
                  : "cursor-pointer",
              )}
              onClick={() =>
                !isUserLoading && user && setIsOpen((prev) => !prev)
              }
            >
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  className="w-full h-full rounded-full object-cover"
                  alt="User Avatar"
                />
              ) : (
                <div className="w-full h-full bg-white/20 animate-pulse rounded-full" />
              )}
            </div>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isOpen && user && !isUserLoading && (
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute right-0 top-[calc(100%+0.75rem)] w-72 overflow-hidden rounded-[4px] border border-gray-800 p-3 text-left z-[999] bg-[hsl(var(--bg))]"
                >
                  {/* User Information */}
                  <div className="border-b border-gray-800 pb-3">
                    <p className="text-sm font-semibold text-foreground">
                      {user?.name || user?.login}
                    </p>

                    <p className="text-xs text-foreground-muted">
                      {user?.login}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 pt-3">
                    {/* GitHub */}
                    <a
                      href={user?.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center justify-between rounded-[4px] bg-white py-2 px-4 text-[0.85rem] font-medium text-[#030303] transition-all hover:bg-gray-200"
                    >
                      <span>GitHub</span>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        width="16px"
                        height="16px"
                        viewBox="0 0 1024 1024"
                      >
                        <path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0 1 38.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z" />
                      </svg>
                    </a>

                    {/* Logout */}
                    <button
                      type="button"
                      onClick={handleLogoutClick}
                      className="inline-flex items-center justify-between px-4 py-2 text-[0.85rem] font-medium text-white bg-red-600 rounded-[4px] transition-all hover:bg-red-700"
                    >
                      <span>Logout</span>

                      <svg
                        width="16px"
                        height="16px"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-[hsl(var(--bg))] border border-gray-800 rounded-[4px] p-6 py-10 max-w-md w-full">
            <h3 className="text-lg font-semibold text-white mb-4">
              Confirm Logout
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-900 rounded-[4px] text-sm font-medium hover:bg-gray-300 transition-colors"
                disabled={isLoggingOut}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-[4px] text-sm font-medium hover:bg-red-700 transition-colors flex items-center"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging out...
                  </>
                ) : (
                  "Yes, Log out"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DashBoardHeader;
