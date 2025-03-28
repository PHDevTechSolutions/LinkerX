import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoIosMenu } from "react-icons/io";
import { CiClock2, CiMenuBurger, CiUser, CiSettings, CiBellOn, CiCircleRemove, CiDark, CiSun, CiSearch } from "react-icons/ci";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { motion } from "framer-motion";

interface Notification {
  id: number;
  companyname: string;
  callback: string;
  status: string;  // Replaced typeactivity with status
  typeclient: string;
  date_updated: string;
  date_created: string;
  ticketreferencenumber: string;  // Assuming ticket reference number is important
  salesagentname: string;  // Assuming this is included in the notification object
  message: string;
  type: string;
  csragent: string;
  typeactivity: string;
  typecall: string;
  agentfullname: string;
}

interface NavbarProps {
  onToggleSidebar: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onToggleTheme, isDarkMode }) => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userReferenceId, setUserReferenceId] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]); // Unread notifications
  const notificationRef = useRef<HTMLDivElement>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [usersList, setUsersList] = useState<any[]>([]);

  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<"notifications" | "messages">("notifications");
  const [loadingId, setLoadingId] = useState<number | null>(null);

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
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/getUsers"); // API endpoint mo
        const data = await response.json();
        setUsersList(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

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

        // ✅ Filter valid notifications based on type (including CSR Notification)
        const validNotifications = data.data
          .map((notif: any) => {
            // Hanapin ang Agent na may parehong ReferenceID sa usersList
            const agent = usersList.find((user) => user.ReferenceID === notif.referenceid);

            return {
              ...notif,
              agentfullname: agent
                ? `${agent.Firstname} ${agent.Lastname}`
                : "Unknown Agent",
            };
          })
          .filter((notif: any) => {
            switch (notif.type) {
              case "CSR Notification":
                if (notif.date_created) {
                  const inquiryDate = new Date(notif.date_created).setHours(0, 0, 0, 0);

                  // ✅ Check if CSR agent matches userReferenceId and date is valid
                  if (notif.csragent === userReferenceId && inquiryDate <= today) {
                    return true;
                  }
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

        // ✅ Set valid notifications
        setNotifications(validNotifications);
        setNotificationCount(validNotifications.length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [userReferenceId, usersList]);

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
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // ✅ Handle notification click and dismiss
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

  const handleMarkAsRead = async (notifId: number) => {
    try {
      setLoadingId(notifId); // Start loading

      const response = await fetch(
        "/api/ModuleSales/Notification/UpdateNotifications",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notifId, status: "Read" }),
        }
      );

      if (response.ok) {
        // ✅ Update status to "Read"
        const updatedNotifications = notifications.map((notif) =>
          notif.id === notifId ? { ...notif, status: "Read" } : notif
        );
        setNotifications(updatedNotifications);

        // ✅ Remove after 1 minute
        setTimeout(() => {
          setNotifications((prev) =>
            prev.filter((notif) => notif.id !== notifId)
          );
        }, 60000); // 1 minute (60,000 ms)
      } else {
        console.error("Error updating notification status");
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    } finally {
      setLoadingId(null); // Stop loading
    }
  };

  return (
    <div className={`sticky top-0 z-[999] flex justify-between items-center p-4 shadow-md transition-all duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="flex items-center">
        <button onClick={onToggleSidebar} className="p-2">
          <IoIosMenu size={24} />
        </button>
        <span className="flex items-center text-gray-900 border text-sm shadow-md text-xs font-medium bg-gray-50 px-3 py-1 rounded-full">
          <CiClock2 className="mr-1" /> {currentTime}
        </span>
      </div>

      <div className="relative flex items-center text-center text-xs space-x-2" ref={dropdownRef}>
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

        {/* Notification Icon */}
        <button onClick={() => setShowSidebar((prev) => !prev)} className="p-2 relative flex items-center hover:bg-gray-200 hover:rounded-full">
          <CiBellOn size={20} />
          {notifications.filter((notif) => notif.status === "pending").length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center">
              {notifications.filter((notif) => notif.status === "pending").length}
            </span>
          )}
        </button>

        {showSidebar && (
          <motion.div ref={sidebarRef} initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.3, ease: "easeInOut" }} className="fixed top-0 right-0 w-80 h-full bg-white border-l border-gray-300 shadow-lg z-[1000] flex flex-col">

            {/* 🔧 Header */}
            <div className="flex items-center justify-between p-3 border-b">
              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              <button onClick={() => setShowSidebar(false)} >
                <IoIosCloseCircleOutline size={20} />
              </button>
            </div>

            {/* 📜 Notifications List */}
            <div className="flex-1 overflow-auto p-2">
              <div className="flex border-b mb-2">
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`flex-1 text-center py-2 text-xs font-semibold ${activeTab === "notifications" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
                    }`}
                >
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab("messages")}
                  className={`flex-1 text-center py-2 text-xs font-semibold ${activeTab === "messages" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
                    }`}
                >
                  Messages
                </button>
              </div>

              {activeTab === "notifications" ? (
                // ✅ Notifications Tab
                <>
                  {notifications.filter((notif) => notif.status === "pending").length > 0 ? (
                    <ul className="space-y-2">
                      {notifications
                        .filter((notif) => notif.status === "pending")
                        .map((notif, index) => (
                          <li
                            key={notif.id || index}
                            className={`p-3 border-b hover:bg-gray-200 text-xs text-gray-900 capitalize text-left rounded-md relative ${notif.type === "Inquiry Notification" ? "bg-yellow-200" : "bg-gray-100"
                              }`}
                          >
                            <p className="text-[10px] mt-5">{notif.message} Processed By {notif.agentfullname}</p>

                            {/* Timestamp for Callback Notification */}
                            {notif.date_created && notif.type === "CSR Notification" && (
                              <span className="text-[8px] mt-1 block">
                                {new Date(notif.date_created).toLocaleString()}
                              </span>
                            )}

                            {/* ✅ Mark as Read Button */}
                            <button
                              onClick={() => handleMarkAsRead(notif.id)}
                              disabled={loadingId === notif.id}
                              className={`text-[9px] mb-2 cursor-pointer absolute top-2 right-2 ${notif.status === "Read"
                                ? "text-green-600 font-bold"
                                : loadingId === notif.id
                                  ? "text-gray-500 cursor-not-allowed"
                                  : "text-blue-600 hover:text-blue-800"
                                }`}
                            >
                              {loadingId === notif.id
                                ? "Loading..."
                                : notif.status === "Read"
                                  ? "Read"
                                  : "Mark as Read"}
                            </button>
                          </li>

                        ))}
                    </ul>
                  ) : (
                    <p className="text-xs p-4 text-gray-500 text-center">No new notifications</p>
                  )}
                </>
              ) : (
                // ❌ Empty Messages Tab
                <div className="p-4 text-center text-xs text-gray-500">No messages available</div>
              )}
            </div>
          </motion.div>
        )}

        {/* User Dropdown */}
        <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center space-x-2 focus:outline-none hover:bg-gray-200 p-2 hover:rounded-full">
          <CiUser size={20} />
          <span className="capitalize">Hello, {userName}</span>
        </button>

        {showDropdown && (
          <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-50">
            <p className="px-4 py-2 text-gray-700 text-xs border-b">{userReferenceId}</p>
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
