"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoIosMenu } from 'react-icons/io';

const Navbar: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");

    if (userId) {
      fetch(`/api/user?id=${encodeURIComponent(userId)}`)
        .then(response => response.json())
        .then(data => {
          setUserName(data.userName);
          setUserEmail(data.Email);
        })
        .catch(error => console.error("Error fetching user data:", error));
    }
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    sessionStorage.clear();
    router.push("/Login");
  };

  return (
    <div className="flex justify-between items-center p-4 bg-gray-100 text-dark shadow-md">
      <div className="flex items-center">
        <button onClick={onToggleSidebar} className="p-2">
          <IoIosMenu size={24} />
        </button>
        <h1 className="ml-2 text-xs">Dashboard</h1>
      </div>
      <div className="flex items-center text-xs">
        <span className="mr-4 capitalize">Hello, {userName}</span>
        <button className="bg-red-500 px-2 py-2 text-white rounded" onClick={() => setShowLogoutModal(true)}>
          Logout
        </button>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center text-gray-800">
            <p className="mb-4 text-xs">Are you sure you want to logout?</p>
            <div className="flex justify-center space-x-4">
              <button className="bg-gray-300 px-4 py-2 rounded text-gray-800 text-xs" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
              <button className="bg-red-500 px-4 py-2 text-white rounded text-xs" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;