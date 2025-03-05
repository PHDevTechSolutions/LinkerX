"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoIosMenu } from "react-icons/io";
import { CiClock2 } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";

const Navbar: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");

    if (userId) {
      fetch(`/api/user?id=${encodeURIComponent(userId)}`)
        .then((response) => response.json())
        .then((data) => {
          setUserName(data.userName);
          setUserEmail(data.Email);
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // Simulate loading delay (remove in production)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    sessionStorage.clear();
    router.push("/Login");
  };

  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-between items-center p-4 bg-gray-100 text-dark shadow-md">
      {/* Left Section - Sidebar Toggle & Clock */}
      <div className="flex items-center">
        <button onClick={onToggleSidebar} className="p-2">
          <IoIosMenu size={24} />
        </button>
        <span className="flex items-center border text-sm shadow-md text-xs font-medium bg-gray-50 px-3 py-1 rounded-full">
          <CiClock2 className="mr-1" /> {currentTime}
        </span>
      </div>

      {/* Right Section - User Info & Dropdown */}
      <div className="relative flex items-center text-center text-xs" ref={dropdownRef}>
        {/* User Icon & Username */}
        <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center space-x-2 focus:outline-none">
          <FaUserCircle size={25} />
          <span className="capitalize">Hello, {userName}</span>
        </button>

        {/* Dropdown Menu - Positioned BELOW */}
        {showDropdown && (
          <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-50">
            <p className="px-4 py-2 text-gray-700 text-xs border-b">{userEmail}</p>
            <button
              className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-gray-100 flex justify-center items-center"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2 text-red-500" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Logging out...
                </>
              ) : (
                "Logout"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
