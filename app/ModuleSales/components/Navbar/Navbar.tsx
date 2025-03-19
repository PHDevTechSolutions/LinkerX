"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CiClock2, CiMenuBurger, CiUser, CiSettings, CiBellOn, CiCircleRemove, CiDark, CiSun, CiSearch } from "react-icons/ci";

interface Notification {
  id: number;
  companyname: string;
  callback: string;
  typeactivity: string;
  typeclient: string;
  date_created: string;
  typecall: string;
  message: string;
  type: string;
}

interface SidebarSubLink {
  title: string;
  href: string;
}

interface SidebarLink {
  title: string;
  href?: string; // Main links may not have href if they contain subItems
  subItems?: SidebarSubLink[]; // Nested subItems
}

interface NavbarProps {
  onToggleSidebar: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
  sidebarLinks: SidebarLink[];
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onToggleTheme, isDarkMode, sidebarLinks }) => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [TargetQuota, setUserTargetQuota] = useState("");
  const [Role, setUserRole] = useState("");
  const [userReferenceId, setUserReferenceId] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]); // 🔹 Unread notifications
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]); // 🔹 All notifications
  const notificationRef = useRef<HTMLDivElement>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Load dismissed notifications from localStorage
  useEffect(() => {
    if (!userReferenceId) return;
  
    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `/api/ModuleSales/Task/Callback/FetchCallback?referenceId=${userReferenceId}`
        );
        const data = await res.json();
  
        if (!data.success) return;
  
        // Get current date (without time) for checking notifications
        const today = new Date().setHours(0, 0, 0, 0);
  
        // Filter valid notifications based on type
        const validNotifications = data.data
          .filter((notif: any) => {
            switch (notif.type) {
              case "Callback Notification":
                if (notif.callback) {
                  const callbackDate = new Date(notif.callback).setHours(0, 0, 0, 0);
                  return callbackDate <= today;
                }
                return false;
  
              case "Inquiry Notification":
                if (notif.date_created) {
                  const inquiryDate = new Date(notif.date_created).setHours(0, 0, 0, 0);
                  return inquiryDate <= today;
                }
                return false;
  
              default:
                return false;
            }
          })
          // ✅ Sort notifications by date_created or callback in DESCENDING order
          .sort((a: any, b: any) => {
            const dateA = new Date(a.callback || a.date_created).getTime();
            const dateB = new Date(b.callback || b.date_created).getTime();
            return dateB - dateA; // Descending order
          });
  
        // Set valid notifications
        setNotifications(validNotifications);
        setNotificationCount(validNotifications.length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
  
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [userReferenceId]);
  
  // ✅ Handle notification click
  const handleNotificationClick = (notifId: number) => {
    const updatedNotifications = notifications.filter((notif) => notif.id !== notifId);
    setNotifications(updatedNotifications);
    setNotificationCount(updatedNotifications.length);
  
    const dismissedIds = JSON.parse(localStorage.getItem("dismissedNotifications") || "[]");
    localStorage.setItem("dismissedNotifications", JSON.stringify([...dismissedIds, notifId]));
  };
  
  // ✅ Handle click outside to close notifications
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  

  // Check if TargetQuota is null or empty
  useEffect(() => {
    if (!TargetQuota) {
      setIsModalVisible(true);
    }
  }, [TargetQuota]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    setIsSearching(true); // Start loading state

    setTimeout(() => {
      if (!sidebarLinks || sidebarLinks.length === 0) {
        alert("No menu items available.");
        setIsSearching(false);
        return;
      }

      // Flatten subItems into a single array
      const allLinks = sidebarLinks.flatMap(item => item.subItems || []);

      // Search within subItems
      const matchedLink = allLinks.find(link =>
        link.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (matchedLink) {
        router.push(matchedLink.href);
      } else {
        alert("No matching page found.");
      }

      setIsSearching(false); // Stop loading state after search
    }, 1000); // Simulated delay for UX
  };

  // Ensure dark mode applies correctly when `isDarkMode` changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const params = new URLSearchParams(window.location.search);
      const userId = params.get("id");

      if (userId) {
        try {
          const response = await fetch(`/api/user?id=${encodeURIComponent(userId)}`);
          if (!response.ok) throw new Error("Failed to fetch user data");

          const data = await response.json();
          setUserName(data.Firstname);
          setUserEmail(data.Email);
          setUserReferenceId(data.ReferenceID || "");
          setUserTargetQuota(data.TargetQuota || "");
          setUserRole(data.Role || "");
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await fetch("/api/logout", { method: "POST", headers: { "Content-Type": "application/json" } });
    sessionStorage.clear();
    router.replace("/Login");
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false); // This could be closing the modal prematurely
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`sticky top-0 z-[9999] flex justify-between items-center p-4 border transition-all duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="flex items-center space-x-4">
        <button onClick={onToggleSidebar} className="p-2">
          <CiMenuBurger />
        </button>

        <span className="flex items-center border shadow-md text-xs font-medium px-3 py-1 rounded-full">
          <CiClock2 size={15} className="mr-1" /> {currentTime}
        </span>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Search directories.." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-3 py-1 text-xs text-gray-900 border rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 capitalize" />
          {isSearching && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
              Loading...
            </span>
          )}
        </form>
      </div>

      <div className="relative flex items-center text-center text-xs gap-2" ref={dropdownRef}>
        <button
          onClick={onToggleTheme}
          className="relative flex items-center bg-gray-200 dark:bg-gray-700 rounded-full w-16 h-8 p-1 transition-all duration-300"
        >
          {/* Toggle Knob with Icon Centered */}
          <div
            className={`w-6 h-6 bg-white dark:bg-yellow-400 rounded-full shadow-md flex justify-center items-center transform transition-transform duration-300 ${isDarkMode ? "translate-x-8" : "translate-x-0"
              }`}
          >
            {isDarkMode ? (
              <CiDark size={16} className="text-gray-900 dark:text-gray-300" />
            ) : (
              <CiSun size={16} className="text-yellow-500" />
            )}
          </div>
        </button>

        {/* Notifications */}
        <button
          onClick={() => setShowNotifications((prevState) => !prevState)}
          disabled={modalOpen}
          className="p-2 relative flex items-center"
        >
          <CiBellOn size={20} />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>

        {/* Notification Dropdown */}
        {showNotifications && notifications.length > 0 && (
          <div
            ref={notificationRef}
            className="fixed top-14 right-4 w-80 bg-white border border-gray-300 rounded shadow-lg p-2 z-50"
          >
            <h3 className="text-xs font-semibold px-2 py-1 border-b flex justify-between items-center">
              <span className="text-gray-900">Notifications</span>
              <button className="flex items-center gap-2 text-xs text-gray-900" onClick={openModal}>
                <CiSettings className="text-xs" /> All
              </button>
            </h3>

            {notifications.length > 0 ? (
              <ul className="overflow-auto max-h-60">
                {notifications.map((notif, index) => (
                  <li
                    key={notif.id || index} // Fallback to index if id is missing
                    onClick={() => handleNotificationClick(notif.id)}
                    className="px-3 py-2 border-b hover:bg-gray-200 cursor-pointer text-xs text-left bg-gray-100 text-gray-900 capitalize"
                  >
                    <p className="text-[10px]">{notif.message}</p>
                    {notif.callback && notif.type === "Callback Notification" && (
                      <span className="text-[8px] mt-1 block">
                        {new Date(notif.callback).toLocaleString()}
                      </span>
                    )}
                    {notif.date_created && notif.type === "Inquiry Notification" && (
                      <span className="text-[8px] mt-1 block">
                        {new Date(notif.date_created).toLocaleString()}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs p-2 text-gray-500 text-center">No new notifications</p>
            )}
          </div>
        )}

        {/* User Dropdown */}
        <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center space-x-1 focus:outline-none">
          <CiUser size={20} />
          <span className="capitalize">Hello, {userName}</span>
        </button>

        {showDropdown && (
          <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-50">
            <p className="px-4 py-2 text-gray-700 text-xs border-b break-words whitespace-normal w-full">{userEmail}</p>
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

        {/* Modal when TargetQuota is null, zero, or an empty value */}
        {(Role === "Territory Sales Associate" && !TargetQuota && isModalVisible) && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[70%] max-w-3xl max-h-[80vh]">
              <p className="text-gray-900 text-xs font-semibold mb-2">
                The Target Quota has not been set yet. Please coordinate with your Territory Sales Manager to set the quota in order to begin using the Taskflow System.
              </p>
              <button
                className="w-full text-left px-4 py-2 text-xs text-red-600 bg-red-700 rounded text-white hover:bg-red-900 flex justify-center items-center"
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
          </div>
        )}

      </div>
    </div>
  );
};

export default Navbar;
