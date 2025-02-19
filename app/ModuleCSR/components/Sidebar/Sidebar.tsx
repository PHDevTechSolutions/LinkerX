"use client";

import React, { useState, useEffect } from "react";
import { BsFillTelephoneOutboundFill } from "react-icons/bs";
import { FaBuildingUser, FaHeadphonesSimple, FaUsersGear, FaPlus, FaMinus } from "react-icons/fa6";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { IoMdSettings, IoIosAnalytics, IoIosHelpCircleOutline  } from "react-icons/io";
import { FaRegCircle } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import TaskflowIcon from './TaskflowIcon';

import Link from 'next/link';
import { useRouter } from "next/navigation";

const Sidebar: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState({Firstname: "", Lastname: "", Location: "", Role: "",});
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
      icon: BsFillTelephoneOutboundFill,
      subItems: [
        { title: 'Tickets', href: `/ModuleCSR/CSR/Monitoring/Activities${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Customer Database',
      icon: FaBuildingUser ,
      subItems: [
        { title: 'List of Accounts', href: `/ModuleCSR/CSR/Accounts/AccountList${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Reports',
      icon: IoIosAnalytics ,
      subItems: [
        { title: 'Daily CSR Transaction', href: `/ModuleCSR/CSR/Reports/DailyTransaction${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'SKU Listing', href: `/ModuleCSR/CSR/Reports/SKUListing${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Received P.O', href: `/ModuleCSR/CSR/Reports/ReceivedPO${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'D-Tracking', href: `/ModuleCSR/CSR/Reports/DTracking${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Taskflow',
      icon: TaskflowIcon ,
      subItems: [
        { title: 'Outbound Calls', href: `/ModuleCSR/CSR/Calls/OutboundCall${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Database', href: `/ModuleCSR/CSR/Calls/Database${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'User Creation',
      icon: FaUsersGear,
      subItems: [
        { title: 'List of Users', href: `/ModuleCSR/CSR/Users/ListofUser${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Eco Help',
      icon: IoIosHelpCircleOutline,
      subItems: [
        { title: 'CSR Faqs', href: `/ModuleCSR/CSR/Help${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Settings',
      icon: IoMdSettings,
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
    <div className={`fixed inset-y-0 left-0 z-50 h-screen bg-gray-800 text-white transition-all duration-300 flex flex-col ${collapsed ? "w-16" : "w-64"} ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <img src="/react.svg" alt="Logo" className="h-8 mr-2"/>
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
            <p>{userDetails.Location}</p>
            <p>( {userDetails.Role} )</p>
          </div>
        )}
      
      {/* Menu Section */}
      <div className="flex flex-col items-center rounded-md flex-grow overflow-y-auto text-xs p-2">
        <div className="w-full">
          <Link href={`/ModuleCSR/CSR/Dashboard/${userId ? `?id=${encodeURIComponent(userId)}` : ''}`} className="flex items-center w-full p-4 hover:bg-gray-700 rounded hover: rounded-md hover:text-white transition-all"><MdOutlineSpaceDashboard size={22} className="mr-1"/>Dashboard</Link>
        </div>
          {filteredMenuItems.map((item, index) => (
            <div key={index} className="w-full">
              <button
                onClick={() => handleToggle(item.title)}
                className={`flex items-center w-full p-4 hover:bg-gray-700 rounded hover:rounded-md hover:text-white transition-all ${collapsed ? "justify-center" : ""}`}
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
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openSections[item.title] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {openSections[item.title] && !collapsed && (
                  <div> {/* Added margin-left for submenu spacing */}
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        prefetch={true}
                        className="flex items-center w-full p-4 bg-gray-800 hover:bg-gray-700 rounded hover:rounded-md hover:text-white transition-all"
                      >
                        {/* Adding small circle icon for each submenu item */}
                        <FaRegCircle size={10} className="mr-2 ml-2" />
                        {subItem.title}
                      </Link>
                    ))}
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
