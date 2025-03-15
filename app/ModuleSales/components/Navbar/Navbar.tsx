"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CiClock2, CiMenuBurger, CiUser, CiSettings, CiBellOn, CiCircleRemove, CiDark, CiSun } from "react-icons/ci";

interface Notification {
  id: number;
  companyname: string;
  callback: string;
  typeactivity: string;
  typeclient: string;
  date_created: string;
  typecall: string;
}

interface NavbarProps {
  onToggleSidebar: () => void;
  onToggleTheme: () => void;
}

const Navbar: React.FC<{ onToggleSidebar: () => void; onToggleTheme: () => void; isDarkMode: boolean }> = ({ onToggleSidebar, onToggleTheme, isDarkMode, }) => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
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
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  // Load dismissed notifications from localStorage
  useEffect(() => {
    if (!userReferenceId) return;

    const fetchNotificationsAndInquiries = async () => {
      try {
        // Fetch all necessary data concurrently
        const [callbackRes, inquiryRes, typecallRes] = await Promise.all([
          fetch(`/api/ModuleSales/Task/Callback/FetchCallback?referenceId=${userReferenceId}`),
          fetch(`/api/ModuleSales/Task/CSRInquiries/FetchInquiryNotif?referenceId=${userReferenceId}`),
          fetch(`/api/ModuleSales/Task/Callback/FetchTypeCall?tsm=${userReferenceId}`),
        ]);

        const [callbackData, inquiryData, typecallData] = await Promise.all([
          callbackRes.json(),
          inquiryRes.json(),
          typecallRes.json(),
        ]);

        if (!callbackData.success || !inquiryData.success || !typecallData.success) return;

        const dismissedIds = new Set(JSON.parse(localStorage.getItem("dismissedNotifications") || "[]"));

        // Get the current date and time in Manila timezone
        const getManilaTime = () => {
          return new Date(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Manila" }).format(new Date()));
        };

        const currentTime = getManilaTime();

        // Function to calculate notification time limit
        const getNotificationTimeLimit = (typecall: string) => {
          const timeLimits: Record<string, number> = {
            "Sent Quotation - Standard": -1,
            "Sent Quotation - With Special Price": -1,
            "Follow Up Pending": -1,
            "Sent Quotation - With SPF": -5,
            "Ringing Only": -10,
            "No Requirement": -15,
            "Not Connected With The Company": -0.0104, // 15 minutes in days
            "Waiting for Projects": -30,
            "Cannot Be Reached": -3,
          };

          if (typecall in timeLimits) {
            return new Date(currentTime.getTime() + timeLimits[typecall] * 24 * 60 * 60 * 1000);
          }

          if (typecall === "With SPFS") {
            return new Date(currentTime.getTime() + 7 * 24 * 60 * 60 * 1000);
          }

          return currentTime;
        };

        // Process callback notifications
        const validCallbacks = callbackData.data
          .filter((notif: any) =>
            notif.typeactivity === "Outbound Call" &&
            notif.callback &&
            new Date(notif.callback) <= currentTime &&
            !dismissedIds.has(notif.id)
          )
          .sort((a: any, b: any) => new Date(b.callback).getTime() - new Date(a.callback).getTime());

        // Process inquiry notifications
        const validInquiries = inquiryData.data
          .filter((inquiry: any) =>
            new Date(inquiry.date_created) <= currentTime &&
            !dismissedIds.has(inquiry.id)
          )
          .map((inquiry: any) => ({
            id: inquiry.id,
            companyname: inquiry.companyname,
            typeactivity: "New Inquiry",
            date_created: inquiry.date_created,
            typeclient: inquiry.typeclient,
          }));

        // Process typecall notifications
        const validTypeCalls = typecallData.data
          .filter((typecall: any) => {
            const notificationTimeLimit = getNotificationTimeLimit(typecall.typecall);
            return new Date(typecall.date_created) <= notificationTimeLimit && !dismissedIds.has(typecall.id);
          })
          .map((typecall: any) => ({
            id: typecall.id,
            companyname: typecall.companyname,
            typecall: typecall.typecall,
            date_created: typecall.date_created,
          }));

        // Combine all notifications and sort
        const allNotifications = [...validCallbacks, ...validInquiries, ...validTypeCalls].sort(
          (a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
        );

        setNotifications(allNotifications);
        setNotificationCount(allNotifications.length);
      } catch (error) {
        console.error("Error fetching notifications and inquiries:", error);
      }
    };

    fetchNotificationsAndInquiries();
    const interval = setInterval(fetchNotificationsAndInquiries, 10000);
    return () => clearInterval(interval);
  }, [userReferenceId]);

  // Handle notification click (removes from list and stores in localStorage)
  const handleNotificationClick = (notifId: number) => {
    const updatedNotifications = notifications.filter((notif) => notif.id !== notifId);
    setNotifications(updatedNotifications);
    setNotificationCount(updatedNotifications.length);

    const dismissedIds = JSON.parse(localStorage.getItem("dismissedNotifications") || "[]");
    localStorage.setItem("dismissedNotifications", JSON.stringify([...dismissedIds, notifId]));
  };

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
    <div className={`sticky top-0 z-100 flex justify-between items-center p-4 shadow-md transition-all duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="flex items-center">
        <button onClick={onToggleSidebar} className="p-2">
          <CiMenuBurger />
        </button>
        <span className="flex items-center border shadow-md text-xs font-medium  px-3 py-1 rounded-full">
          <CiClock2 size={15} className="mr-1" /> {currentTime}
        </span>
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

        {/* Notification Icon */}
        <button
          onClick={() => {
            // Only open modal if the notification count is 0 and modal is not already open
            if (!modalOpen && notifications.filter((notif) => notif.typeactivity !== "Outbound Call" || !!notif.callback || !!notif.typecall).length === 0) {
              openModal(); // Open modal only if it's not already open and there are no notifications
            } else {
              setShowNotifications(!showNotifications); // Toggle notification visibility
            }
          }}
          disabled={modalOpen} // Disable the bell if the modal is open
          className="p-2 relative flex items-center"
        >
          <CiBellOn size={20} />
          {notifications.filter((notif) => notif.typeactivity !== "Outbound Call" || !!notif.callback || !!notif.typecall).length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center">
              {notifications.filter((notif) => notif.typeactivity !== "Outbound Call" || !!notif.callback || !!notif.typecall).length}
            </span>
          )}
        </button>

        {showNotifications && notifications.length > 0 && (
          <div ref={notificationRef} className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-300 rounded shadow-lg z-50 p-2">
            <h3 className="text-xs font-semibold px-2 py-1 border-b flex justify-between items-center">
              <span className="text-gray-900" >Notifications</span>
              <button className="flex items-center gap-2 text-xs text-gray-900" onClick={openModal}>
                <CiSettings className="text-xs " /> All
              </button>
            </h3>

            {notifications.filter((notif) => notif.typeactivity !== "Outbound Call" || !!notif.callback || !!notif.typecall).length > 0 ? (
              <ul className="overflow-auto max-h-60">
                {notifications
                  .filter((notif) => notif.typeactivity !== "Outbound Call" || !!notif.callback || !!notif.typecall) // Ensure callback is not null
                  .map((notif) => (
                    <li
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif.id)}
                      className="px-3 py-2 border-b hover:bg-gray-200 cursor-pointer text-xs text-left bg-gray-100 text-xs text-gray-900 capitalize"
                    >
                      {notif.typeactivity === "Outbound Call" ? (
                        <>
                          <strong>You have a callback in {notif.companyname}.</strong> Please make a call or activity.
                          <span className="text-[8px] mt-1 block">
                            {notif.callback ? new Date(notif.callback).toLocaleString() : "Invalid Date"}
                          </span>
                        </>
                      ) : notif.typecall ? (
                        <>
                          <strong>You have a new follow up status</strong> {notif.typecall} from <strong>{notif.companyname}.</strong>
                          <span className="text-[8px] mt-1 block">
                            {new Date(notif.date_created).toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <>
                          <strong>You have a new Inquiry from {notif.companyname}.</strong> From: {notif.typeclient}.
                          <span className="text-[8px] mt-1 block">
                            {new Date(notif.date_created).toLocaleString()}
                          </span>
                        </>
                      )}
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-xs p-2 text-gray-500 text-center">No new notifications</p>
            )}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[30%] max-w-3xl max-h-[80vh] overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4">All Past Notifications</h2>
              <div className="max-h-[60vh] overflow-y-auto text-left">
                {allNotifications.length > 0 ? (
                  <ul>
                    {allNotifications.map((notif) => (
                      <li
                        key={notif.id}
                        className="px-4 py-3 border-b text-xs hover:bg-gray-100 whitespace-normal break-words capitalize"
                      >
                        {notif.typeactivity === "Outbound Call" ? (
                          <>
                            <strong>{notif.companyname}:</strong> Callback at{" "}
                            {new Date(notif.callback).toLocaleString()}
                          </>
                        ) : notif.typecall ? (
                          <>
                            <strong>You have a new follow up status</strong> {notif.typecall} from <strong>{notif.companyname}.</strong>
                            <span className="text-gray-500 text-xs mt-1 block">
                              {new Date(notif.date_created).toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <>
                            <strong>{notif.companyname}:</strong> from {notif.typeclient}.
                            <span className="text-gray-500 text-xs mt-1 block">
                              {new Date(notif.date_created).toLocaleString()}
                            </span>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-gray-500 text-sm">No past notifications available.</p>
                )}

              </div>
              <div className="mt-4 flex justify-end">
                <button onClick={closeModal} className="px-4 py-2 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 flex items-center gap-1">
                  <CiCircleRemove size={20} /> Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Dropdown */}
        <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center space-x-1 focus:outline-none">
          <CiUser size={20} />
          <span className="capitalize">Hello, {userName}</span>
        </button>

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
