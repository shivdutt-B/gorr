import React, { useState, useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../states/userAtom";
import GorrLogo from "../../assets/Logo/gorr_logo.svg";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLogout } from "../../hooks/useLogout";

function DashBoardHeader() {
  const user = useRecoilValue(userAtom);
  const { logout } = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
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
      <div className="relative flex items-center justify-between p-3 rounded-lg text-white">
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
            {/* <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-yellow-500 rounded-full"></div> */}
            <span className="font-medium truncate max-w-[200px] inline-block">{user?.login}'s projects</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4 text-gray-300 relative">
          {/* Avatar */}
          <div className="relative">
            <div
              ref={avatarRef}
              className="w-[45px] h-[45px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full cursor-pointer"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <img
                src={user?.avatar_url}
                className="w-full h-full rounded-full"
                alt="User Avatar"
              />
            </div>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-60 bg-[hsl(var(--bg))] border border-gray-800 shadow-lg rounded-md p-3 z-999"
                >
                  <div className="text-white">
                    {/* User Info */}
                    <div className="p-2 border-b border-gray-600">
                      <p className="font-semibold">{user?.login}</p>
                      <p className="text-gray-400 text-sm">{user?.name}</p>
                    </div>

                    {/* GitHub Link */}
                    <div className="py-2">
                      <a
                        href={user?.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded cursor-pointer text-sm hover:bg-white hover:text-black transition-all duration-200"
                      >
                        <p>GitHub</p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          width="20px"
                          height="20px"
                          viewBox="0 0 1024 1024"
                        >
                          <path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0 1 38.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z" />
                        </svg>
                      </a>
                    </div>

                    {/* Home Page & Logout */}
                    <div className="py-2 border-t border-gray-600">
                      <Link
                        to="/"
                        className="group flex items-center justify-between p-2 rounded cursor-pointer text-sm hover:bg-white hover:text-black transition-all duration-200"
                      >
                        <p>Home Page</p>
                        <svg
                          width="20px"
                          height="20px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          className="group-hover:stroke-black"
                        >
                          <g id="SVGRepo_iconCarrier">
                            <path d="M12 15L12 18"></path>
                            <path d="M22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274"></path>
                          </g>
                        </svg>
                      </Link>

                      <button
                        className="flex justify-between items-center w-full mt-2 text-red-500 p-2 rounded text-sm text-left hover:bg-red-500 hover:text-white"
                        onClick={handleLogoutClick}
                      >
                        <p>Log Out</p>
                        <svg
                          width="20px"
                          height="20px"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="hover:text-white"
                        >
                          <g id="SVGRepo_iconCarrier">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                          </g>
                        </svg>
                      </button>
                    </div>
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
          <div className="bg-[#0a0a0a] rounded-md p-6 py-10 max-w-md w-full">
            <h3 className="text-lg font-semibold text-white mb-4">
              Confirm Logout
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
                disabled={isLoggingOut}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors flex items-center"
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
