import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoIosMenu } from "react-icons/io";
import { CiClock2, CiMenuBurger, CiUser, CiSettings, CiBellOn, CiCircleRemove, CiDark, CiSun, CiSearch } from "react-icons/ci";

interface Notification {
  id: number;
  companyname: string;
  callback: string;
  status: string;  // Replaced typeactivity with status
  typeclient: string;
  date_updated: string;
  ticketreferencenumber: string;  // Assuming ticket reference number is important
  salesagentname: string;  // Assuming this is included in the notification object
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
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]); // All notifications
  const notificationRef = useRef<HTMLDivElement>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const params = new URLSearchParams(window.location.search);
      const userId = params.get("id");  // Assume this is csragent for PostgreSQL

      if (userId) {
        try {
          const response = await fetch(`/api/user?id=${encodeURIComponent(userId)}`);
          if (!response.ok) throw new Error("Failed to fetch user data");

          const data = await response.json();
          setUserName(data.Firstname);
          setUserEmail(data.Email);
          setUserReferenceId(data.ReferenceID || "");  // Assuming MongoDB uses ReferenceID
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
        // Fetching inquiries only (remove callback fetching)
        const inquiryResponse = await fetch(
          `/api/ModuleCSR/Task/CSRInquiries/FetchInquiryNotif?referenceId=${userReferenceId}` // Pass csragent as referenceId here
        );
        const inquiryData = await inquiryResponse.json();

        if (inquiryData.success) {
          const currentTime = new Date();
          const dismissedIds = JSON.parse(localStorage.getItem("dismissedNotifications") || "[]");

          // Process inquiries only (dismissed and non-dismissed)
          const allNotifications = inquiryData.data
            .filter(
              (inquiry: any) =>
                new Date(inquiry.date_updated) <= currentTime &&
                inquiry.status === "Used" // Ensure only inquiries with status "used" are included
            )
            .sort((a: any, b: any) => new Date(b.date_updated).getTime() - new Date(a.date_updated).getTime())
            .map((inquiry: any) => ({
              id: inquiry.id,
              companyname: inquiry.companyname,
              status: "Used", // Replaced typeactivity with status
              date_updated: inquiry.date_updated,
              typeclient: inquiry.typeclient,
              ticketreferencenumber: inquiry.ticketreferencenumber, // Assuming ticket number is important
              salesagentname: inquiry.salesagentname // Assuming this is included in the inquiry object
            }));

          setAllNotifications(allNotifications); // Update all notifications with inquiries only

          // Process unread inquiries notifications
          const inquiries = inquiryData.data
            .filter(
              (inquiry: any) =>
                new Date(inquiry.date_updated) <= currentTime &&
                !dismissedIds.includes(inquiry.id) &&
                inquiry.status === "Used" // Ensure only "used" status inquiries are marked as unread
            )
            .sort((a: any, b: any) => new Date(b.date_updated).getTime() - new Date(a.date_updated).getTime());

          setNotifications(inquiries.map((inquiry: any) => ({
            id: inquiry.id,
            companyname: inquiry.companyname,
            status: "Used", // Replaced typeactivity with status
            date_updated: inquiry.date_updated, // Use date_created as the callback date
            typeclient: inquiry.typeclient,
            ticketreferencenumber: inquiry.ticketreferencenumber, // Assuming ticket number is important
            salesagentname: inquiry.salesagentname // Assuming this is included in the notification object
          })));

          setNotificationCount(inquiries.length); // Count unread inquiries
        }
      } catch (error) {
        console.error("Error fetching inquiries:", error);
      }
    };

    fetchNotificationsAndInquiries();
    
    const interval = setInterval(fetchNotificationsAndInquiries, 10000);
    return () => clearInterval(interval);
  }, [userReferenceId]); // Make sure userReferenceId is correct

  // Handle notification click (removes from list and stores in localStorage)
  const handleNotificationClick = (notifId: number) => {
    const updatedNotifications = notifications.filter((notif) => notif.id !== notifId);
    setNotifications(updatedNotifications);
    setNotificationCount(updatedNotifications.length);

    const dismissedIds = JSON.parse(localStorage.getItem("dismissedNotifications") || "[]");
    localStorage.setItem("dismissedNotifications", JSON.stringify([...dismissedIds, notifId]));
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

  return (
    <div className={`sticky top-0 z-[9999] flex justify-between items-center p-4 shadow-md transition-all duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="flex items-center">
        <button onClick={onToggleSidebar} className="p-2">
          <IoIosMenu size={24} />
        </button>
        <span className="flex items-center text-gray-900 border text-sm shadow-md text-xs font-medium bg-gray-50 px-3 py-1 rounded-full">
          <CiClock2 className="mr-1" /> {currentTime}
        </span>
      </div>

      <div className="relative flex items-center text-center text-xs space-x-4" ref={dropdownRef}>
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
        <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 hover:bg-gray-200 hover:rounded-full relative">
          <CiBellOn size={20} />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <div ref={notificationRef} className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-300 rounded shadow-lg z-50 p-2">
            <h3 className="text-xs font-semibold px-2 py-1 border-b flex justify-between items-center">
              <span>Notifications</span>
              <button className="flex items-center gap-2 text-xs" onClick={openModal}>
                <CiSettings className="text-xs" /> All
              </button>
            </h3>

            {notifications.length > 0 ? (
              <ul>
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif.id)}
                    className="px-3 py-2 border-b hover:bg-gray-200 cursor-pointer text-xs text-left bg-gray-200"
                  >
                    {/* Show only inquiries */}
                    {notif.status === "Used" && (
                      <>
                        <strong>The Ticket Number - {notif.ticketreferencenumber} / {notif.companyname}</strong> has been processed by: {notif.salesagentname}.
                        <span className="text-gray-500 text-xs mt-1 block">
                          {new Date(notif.date_updated).toLocaleString()}
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
                        <>
                          <strong>The {notif.companyname}:</strong> has been processed by {notif.salesagentname}.
                          <span className="text-gray-500 text-xs mt-1 block">
                            {new Date(notif.date_updated).toLocaleString()}
                          </span>
                        </>

                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-gray-500 text-sm">No past notifications available.</p>
                )}

              </div>
              <div className="mt-4 flex justify-end">
                <button onClick={closeModal} className="px-4 py-2 bg-gray-500 text-white text-xs rounded hover:bg-gray-600">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Dropdown */}
        <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center space-x-2 focus:outline-none hover:bg-gray-200 p-2 hover:rounded-full">
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
