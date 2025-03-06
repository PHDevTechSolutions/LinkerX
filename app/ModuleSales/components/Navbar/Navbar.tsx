"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoIosMenu } from "react-icons/io";
import { CiClock2 } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { CiUser, CiSettings } from "react-icons/ci";


interface Notification {
  id: number;
  companyname: string;
  callback: string;
  typeactivity: string;
}

const Navbar: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
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

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

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
  
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `/api/ModuleSales/Task/Callback/FetchCallback?referenceId=${userReferenceId}`
        );
        const data = await response.json();
  
        if (data.success) {
          const currentTime = new Date();
          const dismissedIds = JSON.parse(localStorage.getItem("dismissedNotifications") || "[]");
  
          // 🔹 ALL notifications that have PAST callback time (for modal) - Sorted Descending
          setAllNotifications(
            data.data
              .filter(
                (notif: Notification) =>
                  notif.typeactivity === "Outbound Call" && new Date(notif.callback) <= currentTime
              )
              .sort((a: Notification, b: Notification) => new Date(b.callback).getTime() - new Date(a.callback).getTime()) // 🔹 Sort Descending
          );
  
          // 🔹 Only UNREAD notifications that have PAST callback time (for dropdown) - Sorted Descending
          const validNotifications = data.data
            .filter(
              (notif: Notification) =>
                notif.typeactivity === "Outbound Call" &&
                new Date(notif.callback) <= currentTime &&
                !dismissedIds.includes(notif.id)
            )
            .sort((a: Notification, b: Notification) => new Date(b.callback).getTime() - new Date(a.callback).getTime()); // 🔹 Sort Descending
  
          setNotifications(validNotifications);
          setNotificationCount(validNotifications.length);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
  
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
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
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-between items-center p-4 bg-gray-100 text-dark shadow-md">
      <div className="flex items-center">
        <button onClick={onToggleSidebar} className="p-2">
          <IoIosMenu size={24} />
        </button>
        <span className="flex items-center border text-sm shadow-md text-xs font-medium bg-gray-50 px-3 py-1 rounded-full">
          <CiClock2 className="mr-1" /> {currentTime}
        </span>
      </div>

      <div className="relative flex items-center text-center text-xs space-x-4" ref={dropdownRef}>
        {/* Notification Icon */}
        <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 relative">
          <IoMdNotificationsOutline size={20} />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
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
                    className="px-3 py-2 border-b hover:bg-gray-200 cursor-pointer text-xs text-left bg-gray-100"
                  >
                    <span className="block text-xs text-gray-900">
                      <strong>You have a callback in {notif.companyname}.</strong> Please make a call or activity.
                    </span>
                    <span className="text-gray-500 text-xs mt-1 block">
                      {new Date(notif.callback).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs p-2 text-gray-500 text-center">No new notifications</p>
            )}
          </div>
        )}

        {/* User Dropdown */}
        <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center space-x-2 focus:outline-none">
          <CiUser size={20} />
          <span className="capitalize">Hello, {userName}</span>
        </button>

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
                        className="px-4 py-3 border-b text-xs hover:bg-gray-100 whitespace-normal break-words"
                      >
                        <strong>{notif.companyname}:</strong> Callback at {new Date(notif.callback).toLocaleString()}
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
