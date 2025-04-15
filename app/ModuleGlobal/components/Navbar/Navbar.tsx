"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CiClock2, CiMenuBurger, CiUser, CiSettings, CiBellOn, CiCircleRemove, CiDark, CiSun, CiSearch } from "react-icons/ci";
import { FaExclamationCircle, FaCheckCircle } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { motion } from "framer-motion";

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

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onToggleTheme, isDarkMode, sidebarLinks
}) => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userReferenceId, setUserReferenceId] = useState("");
  const [TargetQuota, setUserTargetQuota] = useState("");
  const [Role, setUserRole] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]); // 🔹 Unread notifications
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]); // 🔹 All notifications
  const notificationRef = useRef<HTMLDivElement>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [usersList, setUsersList] = useState<any[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<"notifications" | "messages">("notifications");
  const [loadingId, setLoadingId] = useState<string | number | null>(null);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedNotif, setSelectedNotif] = useState<any>(null);
  const [loadingRead, setLoadingRead] = useState<boolean>(false);

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
              // ✅ CASE 1: Callback Notification (Only for TSA ReferenceID)
              case "Callback Notification":
                if (notif.callback && notif.referenceid === userReferenceId) {
                  const callbackDate = new Date(notif.callback).setHours(0, 0, 0, 0);
                  return callbackDate <= today;
                }
                return false;

              // ✅ CASE 2 & 3: Inquiry Notification (For TSA and TSM)
              case "Inquiry Notification":
                if (notif.date_created) {
                  const inquiryDate = new Date(notif.date_created).setHours(0, 0, 0, 0);

                  // Check for TSA
                  if (notif.referenceid === userReferenceId && inquiryDate <= today) {
                    return true;
                  }

                  // Check for TSM
                  if (notif.tsm === userReferenceId && inquiryDate <= today) {
                    return true;
                  }
                }
                return false;

              // ✅ CASE 4: Follow-Up Notification (Only for TSM)
              case "Follow-Up Notification":
                if (
                  notif.date_created &&
                  (notif.referenceid === userReferenceId || notif.tsm === userReferenceId)
                ) {
                  const notificationTime = new Date(notif.date_created);

                  // ✅ Apply delays based on message content
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
                  } else if (
                    notif.message?.includes("Sent Quotation - Standard") ||
                    notif.message?.includes("Sent Quotation - With Special Price")
                  ) {
                    notificationTime.setDate(notificationTime.getDate() + 1); // After 1 day
                  } else if (notif.message?.includes("Sent Quotation - With SPF")) {
                    notificationTime.setDate(notificationTime.getDate() + 5); // After 5 days
                  } else if (notif.message?.includes("Waiting for Projects")) {
                    notificationTime.setDate(notificationTime.getDate() + 30); // After 30 days
                  }

                  // ✅ Show notification after the specified time
                  return new Date() >= notificationTime;
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
        setNotifications(
          validNotifications.map((notif: any) => ({
            ...notif,
            status: notif.status, // ✅ Add status correctly
          }))
        );
        setNotificationCount(validNotifications.length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
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
    router.replace("/Developer");
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

  // ✅ Mark as Read Function - Corrected Type
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

  useEffect(() => {
    // ✅ Find the first pending Inquiry Notification and show modal if found
    const inquiryNotif = notifications.find(
      (notif) => notif.status === "pending" && notif.type === "Inquiry Notification"
    );

    if (inquiryNotif) {
      setSelectedNotif(inquiryNotif);
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [notifications]);

  useEffect(() => {
    const fetchEmailData = async () => {
      try {
        if (!userEmail) {
          console.error("userEmail is missing.");
          return;
        }

        const res = await fetch(`/api/ModuleSales/Email/ComposeEmail/FetchEmailNotification?recepient=${userEmail}`);
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const jsonResponse = await res.json();
        console.log("API Response:", jsonResponse);  // Log to inspect the response

        // Ensure that data is an array
        const data: Email[] = Array.isArray(jsonResponse.data) ? jsonResponse.data : [];

        const filteredEmails = data.filter(
          (item: Email) => // Specify the type for 'item'
            item.status === "Pending" &&
            item.recepient === userEmail // Match recipient's email to your email
        );

        if (filteredEmails.length > 0) {
          setEmailNotifications(filteredEmails); // Update state with filtered emails
        }
      } catch (error) {
        console.error("Error fetching email data:", error);
      }
    };

    if (userEmail) {
      fetchEmailData(); // Initial fetch

      const interval = setInterval(() => {
        fetchEmailData(); // Fetch every 30 seconds
      }, 30000); // 30 seconds

      // Clean up interval on component unmount
      return () => clearInterval(interval);
    }
  }, [userEmail]);

  const UpdateEmailStatus = async (emailId: string) => {
    try {
      setLoadingId(emailId); // Start loading with the string ID

      const emailIdAsString = emailId.toString(); // Ensure it's always a string

      const response = await fetch("/api/ModuleSales/Email/ComposeEmail/UpdateStatus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: [emailIdAsString], // Send emailId as an array
          status: "Read",
        }),
      });

      if (response.ok) {
        // ✅ Update status to "Read"
        const updatedEmails = emailNotifications.map((email) =>
          email.id.toString() === emailIdAsString // Convert email.id to string for comparison
            ? { ...email, status: "Read" }
            : email
        );
        setEmailNotifications(updatedEmails);

        // ✅ Remove after 1 minute
        setTimeout(() => {
          setEmailNotifications((prev) =>
            prev.filter((email) => email.id.toString() !== emailIdAsString) // Convert to string for comparison
          );
        }, 60000); // 1 minute (60,000 ms)
      } else {
        const errorDetails = await response.json();
        console.error("Error updating email status:", {
          status: response.status,
          message: errorDetails.message || "Unknown error",
          details: errorDetails,
        });
      }
    } catch (error) {
      console.error("Error marking email as read:", error);
    } finally {
      setLoadingId(null); // Stop loading
    }
  };

  const emailCount = emailNotifications.filter(
    (notif) => notif.status === "Pending" && notif.recepient === userEmail
  ).length;

  const totalNotifCount = notifications.filter((notif) => notif.status === "Unread").length + emailCount;

  return (
    <div className={`sticky top-0 z-[999] flex justify-between items-center p-4 border-b-4 border-gray-900 shadow-md transition-all duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="flex items-center space-x-4">
        <button onClick={onToggleSidebar} className="p-2">
          <CiMenuBurger />
        </button>

        <span className="flex items-center border-2 border-gray-900 bg-white text-black shadow-md text-xs font-medium px-3 py-1 rounded-full">
          <CiClock2 size={15} className="mr-1" /> {currentTime}
        </span>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative md:block hidden">
          <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900" size={16} />
          <input type="text" placeholder="Search directories.." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-3 py-1 border-2 border-gray-900 text-xs text-gray-900 border rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 capitalize" />
          {isSearching && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
              Loading...
            </span>
          )}
        </form>
      </div>

      <div className="relative flex items-center text-center text-xs gap-2 z-[1000]" ref={dropdownRef}>
        <button
          onClick={onToggleTheme}
          className="relative border-2 border-gray-900 flex items-center bg-gray-200 dark:bg-gray-700 rounded-full w-16 h-8 p-1 transition-all duration-300"
        >
          {/* Toggle Knob with Icon Centered */}
          <div
            className={`w-6 h-6 bg-white border-2 border-gray-900 dark:bg-yellow-400 rounded-full shadow-md flex justify-center items-center transform transition-transform duration-300 ${isDarkMode ? "translate-x-8" : "translate-x-0"
              }`}
          >
            {isDarkMode ? (
              <CiDark size={16} className="text-gray-900 dark:text-gray-300" />
            ) : (
              <CiSun size={16} className="text-gray-900" />
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

        {/* Notification Dropdown */}
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
                            <p className="text-[10px] mt-5">{notif.message}</p>

                            {/* Timestamp for Callback Notification */}
                            {notif.callback && notif.type === "Callback Notification" && (
                              <span className="text-[8px] mt-1 block">
                                {new Date(notif.callback).toLocaleString()}
                              </span>
                            )}

                            {/* Timestamp for Inquiry and Follow-Up Notification */}
                            {notif.date_created &&
                              (notif.type === "Inquiry Notification" || notif.type === "Follow-Up Notification") && (
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
                    <div className="p-4 text-center text-xs text-gray-500">
                      <>
                        {emailNotifications.length > 0 ? (
                          <ul className="space-y-2">
                            {emailNotifications
                              .filter((notif) => notif.status === "Pending") // Filter only "Pending" status emails
                              .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime()) // Sort by latest date
                              .map((email, index) => (
                                <li
                                  key={index}
                                  className="p-3 mb-2 hover:bg-blue-200 hover:text-black text-xs text-gray-900 bg-blue-900 text-white capitalize text-left rounded-md relative"
                                >
                                  <p className="text-[10px] mt-5 font-bold uppercase italic">Sender: {email.sender}</p>
                                  <p className="text-[10px] mt-5 font-bold uppercase italic">Subject: {email.subject}</p>
                                  <p className="text-[10px] mt-1 font-semibold">
                                    Message: {email.message.length > 100 ? `${email.message.substring(0, 100)}...` : email.message}
                                  </p>
                                  <span className="text-[8px] mt-1 block">{new Date(email.date_created).toLocaleString()} / Via XendMail</span>
                                  <button
                                    onClick={() => UpdateEmailStatus(email.id.toString())} // Convert email.id to string
                                    disabled={loadingId === email.id.toString()} // Convert email.id to string for comparison
                                    className={`text-[9px] mb-2 cursor-pointer absolute top-2 right-2 ${email.status === "Read"
                                      ? "text-green-600 font-bold"
                                      : loadingId === email.id.toString()
                                        ? "text-gray-500 cursor-not-allowed"
                                        : "text-white hover:text-blue-800"
                                      }`}
                                  >
                                    {loadingId === email.id.toString()
                                      ? "Loading..."
                                      : email.status === "Read"
                                        ? "Read"
                                        : "Mark as Read"}
                                  </button>

                                </li>
                              ))}
                          </ul>
                        ) : (
                          <div>No pending notifications</div> // Placeholder for when there are no pending emails
                        )}
                      </>
                    </div>
                  )}
                </>
              ) : (
                // ❌ Empty Messages Tab
                <div className="p-4 text-center text-xs text-gray-500">No messages available</div>
              )}
            </div>
          </motion.div>
        )}

        {showModal && selectedNotif && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div
              className="relative bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm border-2 border-red-600 animate-continuous-shake"
            >
              <h2 className="text-lg font-bold text-red-600 mb-2 flex items-center justify-center space-x-2">
                <FaExclamationCircle className="text-red-600" /> {/* Inquiry Icon */}
                <span>Inquiry Notification</span>
              </h2>

              <p className="text-md font-bold italic text-gray-700 mb-4">
                {selectedNotif.message}
              </p>

              {/* Timestamp */}
              <span className="text-[10px] text-gray-500 block mb-4">
                {new Date(selectedNotif.date_created).toLocaleString()}
              </span>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    handleMarkAsRead(selectedNotif.id);
                    setShowModal(false);
                  }}
                  className="px-4 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center space-x-1"
                >
                  <FaCheckCircle className="text-white" /> {/* Check Icon */}
                  <span>Mark as Read</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Dropdown */}
        <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center space-x-1 p-2 focus:outline-none hover:bg-gray-200 hover:rounded-full">
          <CiUser size={20} />
          <span className="capitalize">Hello, {userName}</span>
        </button>

        {showDropdown && (
          <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-50">
            <p className="px-4 py-2 text-gray-700 text-xs border-b break-words whitespace-normal w-full">{userReferenceId}</p>
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
