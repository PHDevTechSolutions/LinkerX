"use client";

import React, { useState, useEffect } from "react";
import { FaRegCircle } from "react-icons/fa";
import { BsTags } from "react-icons/bs";
import { CiGrid42, CiSettings } from "react-icons/ci";
import { RxCaretLeft, RxCaretDown } from "react-icons/rx";
import { CiBoxes } from "react-icons/ci";
import Link from 'next/link';
import { useRouter } from "next/navigation";


const Sidebar: React.FC<{ isOpen: boolean, onClose: () => void; isDarkMode: boolean; }> = ({ isOpen, onClose, isDarkMode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState({ Firstname: "", Lastname: "", Location: "", Role: "", Company: "", Status: "", ReferenceID: "" });
  const router = useRouter();
  const [userNotifications, setUserNotifications] = useState<any>(null);
  const [inactiveAccount, setInactiveAccount] = useState<any>(null);
  const [deleteAccount, setDeleteAccount] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [pendingInquiryCount, setPendingInquiryCount] = useState(0);
  const [pendingInactiveCount, setPendingInactiveCount] = useState(0);
  const [pendingDeleteCount, setPendingDeleteCount] = useState(0);
  const [agentMode, setAgentMode] = useState(false);

  // Retrieve the selected avatar from localStorage or default if not set
  const selectedAvatar = localStorage.getItem('selectedAvatar') || `https://robohash.org/${userDetails.Firstname}${userDetails.Lastname}?size=200x200`;

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

  const menuItems = [
    {
      title: 'Products',
      icon: CiBoxes,
      subItems: [
        { title: "Available Products", href: `/ModuleWarehouse/Warehouse/Inventory/AvailableProducts${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
        { title: "No-Stock", href: `/ModuleWarehouse/Warehouse/Inventory/NoStockProducts${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
        { title: "Draft", href: `/ModuleWarehouse/Warehouse/Inventory/DraftProducts${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
      ],
    },
    {
      title: "Categories",
      icon: BsTags,
      subItems: [
        { title: "Product Categories", href: `/ModuleWarehouse/Warehouse/Product/Categories${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
      ],
    },
    {
      title: 'Profile',
      icon: CiSettings,
      subItems: [
        { title: 'Update Profile', href: `/ModuleSales/Sales/Profile${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        //{ title: 'Notifications', href: `/ModuleSales/Sales/Notifications${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Developers', href: `/ModuleSales/Sales/Profile/Developers${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
  ];

  // Filter menu items based on the user's role
  const filteredMenuItems = userDetails.Role === "Admin" || userDetails.Role === "Super Admin" ? menuItems : menuItems.filter((item) => {
    if (userDetails.Role === "Warehouse Staff") {
      return [
        "Products",
        "Categories",
        "Profile",
        "What is Taskflow?"
      ].includes(item.title);
    }

    return false; // Default: walang access
  });

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

        {/* User Details Section */}
        {!collapsed && (
          <div className="p-6 text-xs text-left">

            {/* Profile Image Section Section */}
            <img src={selectedAvatar} alt="Avatar" className="w-12 h-12 object-cover rounded-full mb-2" />
            <p className="font-bold uppercase text-sm">
              {userDetails.Firstname}, {userDetails.Lastname}
            </p>
            <p>{userDetails.Company}</p>
            <p className="italic">( {userDetails.Role} )</p>

            <div className="flex items-center gap-1">
              <span
                className={`text-white text-[8px] font-semibold px-3 py-1 rounded-full inline-block mt-2 ${userDetails.Status === "Active"
                  ? "bg-green-600"
                  : userDetails.Status === "Inactive"
                    ? "bg-red-400"
                    : userDetails.Status === "Locked"
                      ? "bg-gray-400"
                      : userDetails.Status === "Busy"
                        ? "bg-yellow-400"
                        : userDetails.Status === "Do not Disturb"
                          ? "bg-gray-800"
                          : "bg-blue-500"
                  }`}
              >
                {userDetails.Status}
              </span>

              {/* Toggle Mode Section Section */}
              {userDetails.Role === "Territory Sales Manager" && (
                <label className="inline-flex items-center cursor-pointer mt-2">
                  <input type="checkbox" checked={agentMode} onChange={() => setAgentMode(!agentMode)} className="sr-only peer" />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-400 dark:peer-focus:ring-blue-400 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-400 dark:peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-xs font-medium text-gray-900 dark:text-gray-300">Agent Mode</span>
                </label>
              )}

            </div>
          </div>
        )}

        {/* Menu Section */}
        <div className="flex flex-col items-center flex-grow overflow-y-auto text-xs p-2">
          <div className="w-full">
            <Link
              href={`/ModuleSales/Sales/Dashboard/${userId ? `?id=${encodeURIComponent(userId)}` : ''}`}
              className="flex items-center w-full p-4 bg-orange-400 mb-1 text-white rounded-md transition-all duration-300 ease-in-out hover:shadow-md active:scale-95"
            >
              <CiGrid42 size={22} className="mr-1" />
              Dashboard
            </Link>
          </div>

          {/* Dynamic Menu Items */}
          {filteredMenuItems.map((item, index) => (
            <div key={index} className="w-full">
              {/* Main Menu Button */}
              <button
                onClick={() => handleToggle(item.title)}
                className={`flex items-center w-full p-4 hover:bg-orange-400 rounded hover:rounded-md hover:text-white transition-all duration-300 ease-in-out hover:shadow-md active:scale-95 ${collapsed ? "justify-center" : ""}`}
              >
                <item.icon size={18} />
                {!collapsed && <span className="ml-2">{item.title}</span>}
                {/* Only show the count if it's greater than zero */}
                {item.title === 'Task' && pendingInquiryCount > 0 && (
                  <span className="ml-2 text-[8px] bg-red-400 rounded-lg m-1 pl-2 pr-2 text-white">
                    {pendingInquiryCount}
                  </span>
                )}

                {item.title === 'My Companies' && pendingInactiveCount > 0 && pendingDeleteCount > 0 && (
                  <span className="ml-2 text-[8px] bg-red-400 rounded-lg m-1 pl-2 pr-2 text-white">
                    {pendingInactiveCount}
                  </span>
                )}

                {!collapsed && (
                  <span className="ml-auto">
                    {openSections[item.title] ? <RxCaretDown size={15} /> : <RxCaretLeft size={15} />}
                  </span>
                )}
              </button>

              {/* Submenu Items (Collapsible) */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out text-gray-900 ${openSections[item.title] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                {openSections[item.title] && !collapsed && (
                  <div>
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        prefetch={true}
                        className="flex items-center w-full p-4 bg-gray-200 hover:bg-orange-400 hover:text-white transition-all border-transparent duration-300 ease-in-out"
                      >
                        <FaRegCircle size={10} className="mr-2 ml-2" />
                        {subItem.title}
                        {subItem.title === 'CSR Inquiries' && pendingInquiryCount > 0 && (
                          <span className="ml-2 text-[8px] bg-red-400 rounded-lg m-1 pl-2 pr-2 text-white">{pendingInquiryCount}</span>
                        )}
                        {subItem.title === 'Inactive Companies' && pendingInactiveCount > 0 && (
                          <span className="ml-2 text-[8px] bg-red-400 rounded-lg m-1 pl-2 pr-2 text-white">{pendingInactiveCount}</span>
                        )}
                        {subItem.title === 'For Deletion' && pendingDeleteCount > 0 && (
                          <span className="ml-2 text-[8px] bg-red-400 rounded-lg m-1 pl-2 pr-2 text-white">{pendingDeleteCount}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

        </div>
      </div>
    </>
  );
};

export default Sidebar;
