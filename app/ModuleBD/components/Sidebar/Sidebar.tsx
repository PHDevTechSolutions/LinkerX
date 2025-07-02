"use client";

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import SidebarMenu from "./SidebarMenu";
import getMenuItems from "./SidebarMenuItems";
import SidebarUserInfo from "./SidebarUserInfo";

const Sidebar: React.FC<{ isOpen: boolean, onClose: () => void; isDarkMode: boolean; }> = ({ isOpen, onClose, isDarkMode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState({ Firstname: "", Lastname: "", Location: "", Role: "", Company: "", Status: "", profilePicture: "", ReferenceID: "" });
  const [pendingInquiryCount, setPendingInquiryCount] = useState(0);
  const [pendingInactiveCount, setPendingInactiveCount] = useState(0);
  const [pendingDeleteCount, setPendingDeleteCount] = useState(0);
  const [agentMode, setAgentMode] = useState(false);

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
          Firstname: data.Firstname || "Leroux ",
          Lastname: data.Lastname || "Xchire",
          Location: data.Location || "Philippines",
          Role: data.Role || "Admin",
          Company: data.Company || "Ecoshift Corporation",
          Status: data.Status || "None",
          ReferenceID: data.ReferenceID,
          profilePicture: data.profilePicture,
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleToggle = (section: string) => {
    setOpenSections((prevSections: any) => ({
      ...prevSections,
      [section]: !prevSections[section],
    }));
  };

  const menuItems = getMenuItems(userId);

  const filteredMenuItems = (() => {
    const role = userDetails.Role;
    const agentModeMenu = [
      "Customer Database",
      "Activities",
      "Projects",
      "Xend Mail",
      "Boards",
      "Help Center",
      "Global Employees",
      "My Profile",
      "What is Taskflow?",
    ];
    const tsmDefault = [
      "Sales Performance",
      "Xend Mail",
      "National",
      "My Team",
      "Client Activity Board",
      "Help Center",
      "Global Employees",
      "My Profile",
      "What is Taskflow?",
    ];

    if (role === "Admin" || role === "Super Admin") return menuItems;

    if (role === "Manager") {
      return menuItems.filter(item =>
        [
          "Sales Performance",
          "Conversion Rates",
          "National",
          "My Team",
          "Client Activity Board",
          "Help Center",
          "Xend Mail",
          "Global Employees",
          "My Profile",
          "What is Taskflow?",
        ].includes(item.title)
      );
    }

    if (role === "Special Access") {
      return menuItems.filter(item =>
        [
          "Customer Database",
          "Activities",
          "Sales Performance",
          "Conversion Rates",
          "National",
          "My Team",
          "Client Activity Board",
          "Help Center",
          "Xend Mail",
          "Global Employees",
          "My Profile",
          "What is Taskflow?",
        ].includes(item.title)
      );
    }

    if (role === "Territory Sales Manager") {
      return menuItems.filter(item =>
        (agentMode ? agentModeMenu : tsmDefault).includes(item.title)
      );
    }

    if (role === "Territory Sales Associate") {
      return menuItems.filter(item =>
        [
          "Customer Database",
          "Activities",
          "Reports",
          "Projects",
          "Xend Mail",
          "Boards",
          "Help Center",
          "Global Employees",
          "My Profile",
          "What is Taskflow?",
        ].includes(item.title)
      );
    }

    if (role === "Business Development Officer") {
      return menuItems.filter(item =>
        [
          "Customer Database",
          "Activities",
          "Reports",
          "Projects",
          "Xend Mail",
          "Boards",
          "Help Center",
          "Global Employees",
          "My Profile",
          "What is Taskflow?",
        ].includes(item.title)
      );
    }

    return [];
  })();

  return (
    <>
      {/* Overlay Background (Closes Sidebar on Click) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 z-50 h-screen transition-all duration-300 flex flex-col
      ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"} 
      ${collapsed ? "w-16" : "w-64"} 
      ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center">
            <img src="/taskflow.png" alt="Logo" className="h-8 mr-2" />
            <Link href={`/ModuleSales/Sales/Dashboard${userId ? `?id=${encodeURIComponent(userId)}` : ''}`}>
              <h1 className={`text-md font-bold transition-opacity ${collapsed ? "opacity-0" : "opacity-100"}`}>
                <span>TASK - </span>
                <span className="inline-block transform scale-x-[-1]">FLOW</span>
              </h1>
            </Link>
          </div>
        </div>

        {/* Menu Section */}
        <SidebarMenu
          collapsed={collapsed}
          openSections={openSections}
          handleToggle={handleToggle}
          menuItems={filteredMenuItems}
          userId={userId}
          pendingInquiryCount={pendingInquiryCount}
          pendingInactiveCount={pendingInactiveCount}
          pendingDeleteCount={pendingDeleteCount}
        />

        {/* User Details Section */}
        {!collapsed && (
          <div className="text-xs text-left">
            <SidebarUserInfo
              collapsed={collapsed}
              userDetails={userDetails}
              agentMode={agentMode}
              setAgentMode={setAgentMode}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
