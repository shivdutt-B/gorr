import React from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../states/userAtom";


function DashBoardHeaderSource({ user }) {
    const { logout } = useLogout();

  return (
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
          onClick={logout}
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
  );
}

export default DashBoardHeaderSource;
