"use client";

import React, { useState, useEffect } from "react";
import { FaBuildingUser, FaPlus, FaMinus } from "react-icons/fa6";
import { FaRegCircle } from "react-icons/fa";
import TaskflowIcon from './TaskflowIcon';
import { CiGrid42, CiInboxIn, CiWavePulse1, CiUser, CiCircleQuestion, CiSettings } from "react-icons/ci";

import Link from 'next/link';
import { useRouter } from "next/navigation";

const Sidebar: React.FC<{ isOpen: boolean, onClose: () => void; isDarkMode: boolean }> = ({ isOpen, onClose, isDarkMode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState({ ReferenceID: "", Firstname: "", Lastname: "", Location: "", Role: "", });
  const router = useRouter();

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
          ReferenceID: data.ReferenceID || "",
          Firstname: data.Firstname || "Ecoshift",
          Lastname: data.Lastname || "Corporation",
          Location: data.Location || "Primex Tower",
          Role: data.Role || "Admin",
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
      title: 'CSR Inquiries',
      icon: CiInboxIn,
      subItems: [
        { title: 'Tickets', href: `/ModuleCSR/CSR/Monitoring/Activities${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Automated Tickets', href: `/ModuleCSR/CSR/AutomatedTickets/Tickets${userId ? `?id=${encodeURIComponent(userId)}` : ''}` }
      ],
    },
    {
      title: 'Customer Database',
      icon: FaBuildingUser,
      subItems: [
        { title: 'List of Accounts', href: `/ModuleCSR/CSR/Accounts/AccountList${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Reports',
      icon: CiWavePulse1,
      subItems: [
        { title: 'Daily CSR Transaction', href: `/ModuleCSR/CSR/Reports/DailyTransaction${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Daily CSR Transaction (Automated)', href: `/ModuleCSR/CSR/Reports/DailyTaskflowTransaction${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'SKU Listing', href: `/ModuleCSR/CSR/Reports/SKUListing${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Received P.O', href: `/ModuleCSR/CSR/Reports/ReceivedPO${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'D-Tracking', href: `/ModuleCSR/CSR/Reports/DTracking${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'OLD Taskflow',
      icon: TaskflowIcon,
      subItems: [
        { title: 'Outbound Calls', href: `/ModuleCSR/CSR/Calls/OutboundCall${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Database', href: `/ModuleCSR/CSR/Calls/Database${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'New Taskflow (Automated)',
      icon: TaskflowIcon,
      subItems: [
        { title: 'Outbound Calls', href: `/ModuleCSR/CSR/Taskflow/OutboundCall${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Database', href: `/ModuleCSR/CSR/Taskflow/Database${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'User Creation',
      icon: CiUser,
      subItems: [
        { title: 'List of Users', href: `/ModuleCSR/CSR/Users/ListofUser${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Eco Help',
      icon: CiCircleQuestion,
      subItems: [
        { title: 'CSR Faqs', href: `/ModuleCSR/CSR/Help${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Settings',
      icon: CiSettings,
      subItems: [
        { title: 'Update Profile', href: `/ModuleCSR/CSR/Setting/Profile${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Developers', href: `/ModuleCSR/CSR/Setting/Developers${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
  ];


  // Filter menu items based on the user's role
  const filteredMenuItems = menuItems.filter((item) => {
    if (userDetails.Role === "Staff") {
      // Staff can only see Containers and Settings
      return item.title === "CSR Inquiries" || item.title === "Customer Database" || item.title === "Reports" || item.title === "Eco Help" || item.title === "Settings";
    }
    // Admin and Super Admin can see all items
    return true;
  });

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 h-screen transition-all duration-300 flex flex-col shadow-lg 
      ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"} 
      ${collapsed ? "w-16" : "w-64"} 
      ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <img src="/ecodesk.png" alt="Logo" className="h-8 mr-2 bg-gray-50 shadow-lg rounded-full" />
          <Link href={`/ModuleCSR/CSR/Dashboard${userId ? `?id=${encodeURIComponent(userId)}` : ''}`}>
            <h1 className={`text-md font-bold transition-opacity ${collapsed ? "opacity-0" : "opacity-100"}`}>
              ECODESK
            </h1>
          </Link>
        </div>
      </div>

      {/* User Details Section */}
      {!collapsed && (
        <div className="p-8 text-xs text-left border-b">
          <p className="font-bold uppercase">
            {userDetails.Firstname}, {userDetails.Lastname}
          </p>
          <p>{userDetails.ReferenceID}</p>
          <p>( {userDetails.Role} )</p>
        </div>
      )}

      {/* Menu Section */}
      <div className="flex flex-col items-center rounded-md flex-grow overflow-y-auto text-xs p-2">
        <div className="w-full">
          <Link href={`/ModuleCSR/CSR/Dashboard/${userId ? `?id=${encodeURIComponent(userId)}` : ''}`} className="flex items-center w-full p-4 bg-gray-50 rounded text-gray-900 transition-all">
            <CiGrid42 size={20} className="mr-1" />Dashboard</Link>
        </div>
        {filteredMenuItems.map((item, index) => (
          <div key={index} className="w-full">
            <button
              onClick={() => handleToggle(item.title)}
              className={`flex items-center w-full p-4 mt-1 transition-all duration-300 ease-in-out 
                  hover:bg-gray-50 hover:rounded-md hover:text-gray-900 hover:shadow-md 
                  active:scale-95 ${collapsed ? "justify-center" : ""}`}

            >
              <item.icon size={18} />
              {!collapsed && <span className="ml-2">{item.title}</span>}
              {!collapsed && (
                <span className="ml-auto">
                  {openSections[item.title] ? <FaMinus size={10} /> : <FaPlus size={10} />}
                </span>
              )}
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections[item.title] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
              {openSections[item.title] && !collapsed && (
                <div> {/* Added margin-left for submenu spacing */}
                  {Array.isArray(item.subItems) &&
                    item.subItems.map((subItem, subIndex) =>
                      subItem && typeof subItem === "object" && "href" in subItem ? (
                        <Link
                          key={subIndex}
                          href={subItem.href}
                          prefetch={true}
                          className="flex w-full items-center p-4 bg-gray-50 text-gray-900 border-l-2 border-transparent transition-all duration-300 ease-in-out hover:bg-yellow-100 hover:shadow-md"
                        >
                          <FaRegCircle size={10} className="mr-2 ml-2" />
                          {subItem.title}
                        </Link>
                      ) : null
                    )}
                </div>
              )}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
