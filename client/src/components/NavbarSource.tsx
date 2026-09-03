// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import { cn } from "../utils/cn";
// import { Link } from "react-router-dom";
// import { useRecoilValue } from "recoil";
// import { userAtom } from "../states/userAtom";
// import { useLogout } from "../hooks/useLogout";
// import { IconHome, IconLogout2, IconUser } from "@tabler/icons-react";

// type NavbarSourceProps = {
//   navItems?: unknown;
//   className?: string;
// };

// export const NavbarSource = ({ className }: NavbarSourceProps) => {
//   const gorrLogo = new URL("../assets/Logo/gorr_logo.svg", import.meta.url).href;
//   const user = useRecoilValue(userAtom);
//   const { logout } = useLogout();
//   const dropdownRef = useRef<HTMLDivElement | null>(null);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);

//   useEffect(() => {
//     const handlePointerDown = (event: globalThis.MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         event.target instanceof Node &&
//         !dropdownRef.current.contains(event.target)
//       ) {
//         setIsProfileOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handlePointerDown);

//     return () => document.removeEventListener("mousedown", handlePointerDown);
//   }, []);

//   useEffect(() => {
//     if (!user) {
//       setIsProfileOpen(false);
//     }
//   }, [user]);

//   const handleLogout = async () => {
//     setIsProfileOpen(false);
//     await logout();
//   };

//   return (
//     <header
//       className={cn(
//         "fixed inset-x-4 top-4 z-[5000] mx-auto flex w-[min(100%-2rem,80rem)] items-center justify-between rounded-2xl border border-white/10 bg-surface/75 px-4 py-3 text-foreground shadow-panel backdrop-blur-[10px]",
//         className
//       )}
//     >
//       <Link to="/" className="flex items-center gap-3 rounded-xl px-2 py-1 transition-colors hover:bg-white/5">
//         <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 p-2">
//           <img src={gorrLogo} alt="Gorr" className="h-full w-full object-contain" />
//         </span>
//       </Link>

//       <div className="flex items-center gap-2 sm:gap-3">
//         <Link
//           to="/"
//           className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-white/10"
//         >
//           <IconHome className="h-4 w-4" />
//           <span>Home</span>
//         </Link>

//         {user ? (
//           <div className="relative" ref={dropdownRef}>
//             <button
//               type="button"
//               onClick={() => setIsProfileOpen((open) => !open)}
//               className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-white/10"
//               aria-expanded={isProfileOpen}
//               aria-haspopup="menu"
//             >
//               <IconUser className="h-4 w-4" />
//               <span>Profile</span>
//             </button>

//             {isProfileOpen && (
//               <div className="absolute right-0 top-[calc(100%+0.75rem)] w-72 overflow-hidden rounded-2xl border border-white/10 bg-surface/90 p-3 text-left shadow-panel backdrop-blur-[10px]">
//                 <div className="border-b border-white/10 px-3 pb-3">
//                   <p className="text-sm font-semibold text-foreground">
//                     {user.name || user.login}
//                   </p>
//                   <p className="text-xs text-foreground-muted">{user.login}</p>
//                 </div>

//                 <div className="flex flex-col gap-2 pt-3">
//                   <Link
//                     to="/dashboard"
//                     onClick={() => setIsProfileOpen(false)}
//                     className="inline-flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-white/10"
//                   >
//                     <span>Dashboard</span>
//                     <span>↗</span>
//                   </Link>
//                   <button
//                     type="button"
//                     onClick={handleLogout}
//                     className="inline-flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
//                   >
//                     <span>Logout</span>
//                     <IconLogout2 className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         ) : (
//           <Link
//             to="/join"
//             className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-accent-strong"
//           >
//             <IconUser className="h-4 w-4" />
//             <span>Auth</span>
//           </Link>
//         )}
//       </div>
//     </header>
//   );
// };
