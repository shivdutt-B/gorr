import React, { useState, useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../states/userAtom";
import GorrLogo from "../../assets/Logo/gorr_logo.svg";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashBoardHeaderSource from "./DashBoardHeaderSource";

function DashBoardHeader() {
  const user = useRecoilValue(userAtom);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const avatarRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
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
          <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-yellow-500 rounded-full"></div>
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
                className="absolute right-0 mt-2 w-60 bg-[#0a0a0a] border border-gray-700 shadow-lg rounded-md p-3 z-10"
              >
                <DashBoardHeaderSource user={user} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default DashBoardHeader;
