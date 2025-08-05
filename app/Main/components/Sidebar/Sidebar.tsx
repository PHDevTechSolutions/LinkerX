"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcSettings, FcBullish, FcLink } from "react-icons/fc";
import { GrPowerShutdown } from "react-icons/gr";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegTimesCircle } from 'react-icons/fa';
import { FaArrowRight } from 'react-icons/fa6';

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();

  const [userDetails, setUserDetails] = useState({
    Firstname: "",
    Lastname: "",
    Location: "",
    Role: "",
    Company: "",
    Position: "",
    Status: "",
    profilePicture: "",
    ReferenceID: "",
    ImapHost: "",
    ImapPass: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUserId(params.get("id"));
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`/api/user?id=${encodeURIComponent(userId)}`);
        if (!response.ok) throw new Error("Failed to fetch user details");
        const data = await response.json();
        setUserDetails({
          Firstname: data.Firstname || "Leroux",
          Lastname: data.Lastname || "Xchire",
          Location: data.Location || "Philippines",
          Role: data.Role || "Admin",
          Position: data.Position || "Default",
          Company: data.Company || "PH Devtech Solutions",
          Status: data.Status || "None",
          ReferenceID: data.ReferenceID,
          profilePicture: data.profilePicture,
          ImapHost: data.ImapHost,
          ImapPass: data.ImapPass,
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  useEffect(() => {
    if (!isLoggingOut && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isLoggingOut]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    await new Promise((resolve) => setTimeout(resolve, 3500));
    await fetch("/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    sessionStorage.clear();
    router.replace("/Login");
  };

  const statusColor = {
    Active: "bg-green-600",
    Inactive: "bg-red-400",
    Locked: "bg-gray-400",
    Busy: "bg-yellow-400",
    "Do not Disturb": "bg-gray-800",
  }[userDetails.Status] || "bg-blue-500";

  const menuItems = [
    {
      title: "Update Profile",
      icon: <FcSettings className="text-lg" />,
      href: `/Main/LinkerX/Profile/UpdateProfile${userId ? `?id=${encodeURIComponent(userId)}` : ""}`,
    },
    {
      title: "Links",
      icon: <FcLink className="text-lg" />,
      href: `/Main/LinkerX/Links/${userId ? `?id=${encodeURIComponent(userId)}` : ""}`,
    },
  ];

  return (
    <>
      <audio src="/binary-logout-sfx.mp3" ref={audioRef} />

      {/* Mobile Menu Icon */}
      <div className="fixed bottom-0 left-0 right-0 z-50 w-full bg-white border-t border-gray-300">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 text-xs">
            <img src="/LinkerX.png" className="h-6" />
            <span className="font-bold text-sm"></span>
          </div>
          <button onClick={() => setShowMobileMenu(true)} className="flex items-center gap-2 text-gray-600 hover:text-[#5e17eb] text-xs">
            <HiOutlineMenuAlt3 size={22} /> Menu
          </button>
        </div>
      </div>

      {/* Right Sidebar Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setShowMobileMenu(false)}
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 w-72 h-full bg-white shadow-lg z-50 p-4 flex flex-col border-l border-gray-300"
            >
              {/* Close Button */}
              {/* Top Bar: Close Button + Logo + User Info */}
              <div className="flex items-center justify-between mb-6 mt-2 pr-1">
                {/* User Info + Logo */}
                <div className="flex items-center gap-2">
                  <img
                    src={userDetails.profilePicture || "/xchire-logo.png"}
                    className="w-10 h-10 rounded-full object-cover"
                    alt="User"
                  />
                  <div className="text-xs leading-tight">
                    <div className="max-w-[150px] text-[10px]">
                      <p className="font-bold uppercase break-words whitespace-normal">
                        {userDetails.Firstname}, {userDetails.Lastname}
                      </p>
                    </div>
                    <p>{userDetails.Role}</p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="text-red-600 hover:text-red-700 transition flex items-center justify-center rounded-full p-1"
                >
                  <span className="text-xl">
                    <FaRegTimesCircle />
                  </span>
                </button>
              </div>

              {/* Menu Items List */}
              <ul className="flex flex-col gap-2 border-t border-b border-gray-200 py-4">
                {menuItems.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      href={item.href}
                      className="flex items-center justify-between text-xs px-3 py-2 rounded hover:bg-gray-100 transition border shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      <FaArrowRight />
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Logout */}
              <div className="mt-auto w-full flex justify-center p-4 shadow rounded-md bg-[#5e17eb] shadow-md">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2 text-white text-xs hover:underline"
                >
                  <GrPowerShutdown size={16} />
                  Logout
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Logging Out Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-gray-900 backdrop-blur-sm">
          <div className="absolute inset-0 opacity-20 animate-pulse-slow bg-[radial-gradient(circle,_#00ffff33_1px,_transparent_1px)] bg-[length:20px_20px]" />
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[3px] border-cyan-400 animate-spin-slow shadow-lg shadow-cyan-500/30" />
            <div className="absolute inset-1 rounded-full border-[2px] border-cyan-300 opacity-40 animate-ping" />
            <span className="text-cyan-300 text-[10px] font-mono z-10">Logging out...</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
