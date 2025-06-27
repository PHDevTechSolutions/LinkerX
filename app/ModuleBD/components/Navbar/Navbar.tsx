"use client";

import React, { useState, useEffect, useRef } from "react";
import { CiBellOn, CiDark, CiSun } from "react-icons/ci";

// Route for Notifications
import Notification from "./Notification";

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
  csragent: string;
  agentfullname: string;
  _id: string;
  recepient: string;
  sender: string;
  status: string;
  fullname: string;
}

interface NavbarProps {
  onToggleSidebar: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

type Email = {
  id: number;
  message: string;
  Email: string;
  subject: string;
  status: string;
  recepient: string;
  sender: string;
  date_created: string;
  NotificationStatus: string;
  recipientEmail: string;
};

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onToggleTheme, isDarkMode
}) => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userReferenceId, setUserReferenceId] = useState("");
  const [TargetQuota, setUserTargetQuota] = useState("");
  const [Role, setUserRole] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]); // 🔹 Unread notifications
  const notificationRef = useRef<HTMLDivElement>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [usersList, setUsersList] = useState<any[]>([]);

  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [loadingId, setLoadingId] = useState<string | number | null>(null);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedNotif, setSelectedNotif] = useState<any>(null);

  const [emailNotifications, setEmailNotifications] = useState<Email[]>([]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setShowSidebar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!userReferenceId) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `/api/ModuleSales/Task/Callback/FetchCallback?referenceId=${userReferenceId}`
        );
        const data = await res.json();

        if (!data.success) return;

        // Get the current date (set to 00:00:00 in UTC)
        const today = new Date().setUTCHours(0, 0, 0, 0);

        // Filter valid notifications based on type
        const validNotifications = data.data
          .filter((notif: any) => {
            switch (notif.type) {
              case "Callback Notification":
                if (notif.callback && notif.referenceid === userReferenceId) {
                  const callbackDate = new Date(notif.callback).setUTCHours(0, 0, 0, 0);
                  return callbackDate <= today;
                }
                return false;

              case "Inquiry Notification":
                if (notif.date_created) {
                  const inquiryDate = new Date(notif.date_created).setUTCHours(0, 0, 0, 0);

                  // Check for TSA or TSM referenceId
                  if ((notif.referenceid === userReferenceId || notif.tsm === userReferenceId) && inquiryDate <= today) {
                    return true;
                  }
                }
                return false;

              case "Follow-Up Notification":
                if (notif.date_created && (notif.referenceid === userReferenceId || notif.tsm === userReferenceId)) {
                  const notificationTime = new Date(notif.date_created);

                  // Find the user by referenceId to get their full name
                  const user = usersList.find((user: any) => user.ReferenceID === notif.referenceid);

                  // If user is found, concatenate Firstname and Lastname as fullname
                  const fullname = user ? `${user.Firstname} ${user.Lastname}` : "Unknown User";

                  // Adjust notification times based on message content
                  if (notif.message?.includes("Ringing Only")) {
                    notificationTime.setDate(notificationTime.getDate() + 10); // After 10 days
                  } else if (notif.message?.includes("No Requirements")) {
                    notificationTime.setDate(notificationTime.getDate() + 15); // After 15 days
                  } else if (notif.message?.includes("Cannot Be Reached")) {
                    notificationTime.setDate(notificationTime.getDate() + 3); // After 3 days
                  } else if (notif.message?.includes("Not Connected With The Company")) {
                    notificationTime.setMinutes(notificationTime.getMinutes() + 15); // After 15 minutes
                  } else if (notif.message?.includes("With SPFS")) {
                    notificationTime.setDate(notificationTime.getDate() + 7); // Weekly
                    const validUntil = new Date(notif.date_created);
                    validUntil.setMonth(validUntil.getMonth() + 2); // Valid for 2 months
                    if (new Date() > validUntil) {
                      return false; // Expired after 2 months
                    }
                  } else if (notif.message?.includes("Sent Quotation - Standard")) {
                    notificationTime.setDate(notificationTime.getDate() + 1); // After 1 day
                  } else if (notif.message?.includes("Sent Quotation - With Special Price")) {
                    notificationTime.setDate(notificationTime.getDate() + 1); // After 1 day  
                  } else if (notif.message?.includes("Sent Quotation - With SPF")) {
                    notificationTime.setDate(notificationTime.getDate() + 5); // After 5 days
                  } else if (notif.message?.includes("Waiting for Projects")) {
                    notificationTime.setDate(notificationTime.getDate() + 30); // After 30 days
                  }

                  // Add full name to the notification message (or use wherever you need)
                  notif.fullname = fullname;

                  // Show notification after the specified time
                  return new Date() >= notificationTime;
                }
                return false;

              default:
                return false;
            }
          })
          .sort((a: any, b: any) => {
            const dateA = new Date(a.callback || a.date_created).getTime();
            const dateB = new Date(b.callback || b.date_created).getTime();
            return dateB - dateA; // Descending order
          });

        // Set valid notifications and the count
        setNotifications(validNotifications);
        setNotificationCount(validNotifications.length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval); // Clean up interval on unmount
  }, [userReferenceId]);


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

  useEffect(() => {
    // ✅ Find the first pending Inquiry Notification and show modal if found
    const inquiryNotif = notifications.find(
      (notif) => notif.status === "Unread" && notif.type === "Inquiry Notification"
    );

    if (inquiryNotif) {
      setSelectedNotif(inquiryNotif);
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [notifications]);


  const totalNotifCount = notifications.filter((notif) => notif.status === "Unread").length;

  return (
    <div className={`sticky top-0 z-[999] flex justify-between items-center p-4 transition-all duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="flex items-center space-x-4">
        <button onClick={onToggleSidebar} title="Show Sidebar" className="rounded-full shadow-lg block sm:hidden">
          <img src="/taskflow.png" alt="Logo" className="h-8" />
        </button>
      </div>

      <div className="relative flex items-center text-center text-xs gap-2 z-[1000]" ref={dropdownRef}>
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
        <button onClick={() => setShowSidebar((prev) => !prev)} className="p-2 relative flex items-center hover:bg-gray-200 hover:rounded-full">
          <CiBellOn size={20} />
          {totalNotifCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center">
              {totalNotifCount}
            </span>
          )}
        </button>

        <Notification
          totalNotifCount={totalNotifCount}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          dropdownRef={dropdownRef}
          sidebarRef={sidebarRef}
          notifications={notifications}
          setNotifications={setNotifications}
          userEmail={userEmail}
        />

      </div>
    </div>
  );
};

export default Navbar;
