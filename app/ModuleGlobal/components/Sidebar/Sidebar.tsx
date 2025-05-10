"use client";

import React, { useState, useEffect } from "react";
import { FaRegCircle } from "react-icons/fa";
import { CiUser, CiGrid42, CiSettings } from "react-icons/ci";
import { RxCaretLeft, RxCaretDown } from "react-icons/rx";
import TaskflowIcon from './TaskflowIcon';
import XchireIcon from './XchireIcon';
import { IoHelp } from "react-icons/io5";
import Ecodesk from './EcodeskIcon';
import Link from 'next/link';
import { useRouter } from "next/navigation";


const Sidebar: React.FC<{ isOpen: boolean, onClose: () => void; isDarkMode: boolean; }> = ({ isOpen, onClose, isDarkMode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState({ Firstname: "", Lastname: "", Location: "", Role: "", Company: "", Status: "", ReferenceID: "", Department: "", });
  const router = useRouter();
  const [userNotifications, setUserNotifications] = useState<any>(null);
  const [inactiveAccount, setInactiveAccount] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [pendingInquiryCount, setPendingInquiryCount] = useState(0);
  const [pendingInactiveCount, setPendingInactiveCount] = useState(0);

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
          Firstname: data.Firstname || "Leroux",
          Lastname: data.Lastname || "Xchire",
          Location: data.Location || "Philippines",
          Role: data.Role || "Admin",
          Company: data.Company || "Ecoshift Corporation",
          Department: data.Department || "IT Department",
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

  useEffect(() => {
    const fetchUserNotification = async () => {
      try {
        // Fetch notifications and pass ReferenceID from MongoDB
        const response = await fetch(`/api/ModuleSales/Task/Callback/CountInquiries?referenceId=${userDetails.ReferenceID}`);

        if (!response.ok) throw new Error("Failed to fetch user notifications");

        const result = await response.json();

        if (!result.success) {
          console.error(result.error);
          return;
        }

        const data = result.data; // Access the notifications array
        setUserNotifications(data); // Set the fetched data to state

        // Count "Pending" status with type "Inquiry Notification"
        const pendingCount = data.filter(
          (notification: any) =>
            notification.status?.toLowerCase() === "pending" &&
            notification.type?.toLowerCase() === "inquiry notification"
        ).length;

        setPendingInquiryCount(pendingCount); // Update state with the count
      } catch (error) {
        console.error("Error fetching user notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userDetails.ReferenceID) fetchUserNotification();
  }, [userDetails.ReferenceID]);

  useEffect(() => {
    const fetchAccountInactive = async () => {
      try {
        // Fetch accounts and pass ReferenceID from MongoDB
        const response = await fetch(`/api/ModuleSales/Companies/CompanyAccounts/FetchInactiveCount?referenceId=${userDetails.ReferenceID}`);

        if (!response.ok) throw new Error("Failed to fetch inactive accounts");

        const result = await response.json();

        if (!result.success) {
          console.error(result.error);
          return;
        }

        const data = result.data; // Access the accounts array
        setInactiveAccount(data); // Set the fetched data to state

        // Count "Inactive" accounts
        const inactiveCount = data.filter(
          (account: any) => account.status?.toLowerCase() === "inactive"
        ).length;

        setPendingInactiveCount(inactiveCount); // Update state with the count
      } catch (error) {
        console.error("Error fetching inactive accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userDetails.ReferenceID) fetchAccountInactive();
  }, [userDetails.ReferenceID]);



  const menuItems = [
    {
      title: 'Email',
      icon: CiUser,
      subItems: [
        { title: 'Compose Email', href: `/ModuleGlobal/ERP/Email/ComposeEmail${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Taskflow',
      icon: TaskflowIcon,
      subItems: [
        { title: 'Activity Logs', href: `/ModuleGlobal/ERP/Logs/TaskflowActivityLogs${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Progress Logs', href: `/ModuleGlobal/ERP/Logs/TaskflowProgressLogs${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Company Accounts', href: `/ModuleGlobal/ERP/UserManagement/CompanyAccounts${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Ecodesk',
      icon: Ecodesk,
      subItems: [
        { title: 'List of Accounts', href: `/ModuleGlobal/ERP/Accounts/AccountList${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Outbound Calls', href: `/ModuleGlobal/ERP/Taskflow/OutboundCall${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Database', href: `/ModuleGlobal/ERP/Taskflow/Database${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'List of Users', href: `/ModuleGlobal/ERP/Users/ListofUser${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Taskflow Beta',
      icon: XchireIcon,
      subItems: [
        { title: 'Activity Logs', href: `/ModuleGlobal/ERP/Logs/ActivityLogs${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Progress Logs', href: `/ModuleGlobal/ERP/Logs/ProgressLogs${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Database', href: `/ModuleGlobal/ERP/Calls/Database${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Settings',
      icon: CiSettings,
      subItems: [
        { title: 'Maintenance', href: `/ModuleGlobal/ERP/Settings/Maintenance${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'API Keys', href: `/ModuleGlobal/ERP/Settings/APIKeys${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Users', href: `/ModuleGlobal/ERP/UserManagement/Employees${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Territory Sales Manager', href: `/ModuleGlobal/ERP/UserManagement/TSM${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'National Sales Manager', href: `/ModuleGlobal/ERP/UserManagement/ManagerDirectors${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Global Employees',
      icon: CiUser,
      subItems: [
        { title: 'Ecoshift Employees Profile', href: `/ModuleGlobal/ERP/Ecoshift/Employees${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Help Center',
      icon: IoHelp,
      subItems: [
        { title: 'Tutorials', href: `/ModuleGlobal/ERP/HelpCenter/Tutorials${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Profile',
      icon: CiUser,
      subItems: [
        { title: 'Update Profile', href: `/ModuleGlobal/ERP/Profile/UpdateProfile${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
  ];

  // Filter menu items based on the user's role
  const filteredMenuItems = userDetails.Role === "Admin" || userDetails.Role === "Super Admin"
    ? menuItems
    : menuItems.filter((item) => {
      // If role is Admin or Super Admin, return all menu items
      return [
        "Sales Performance",
        "Conversion Rates",
        "National",
        "My Team",
        "Client Activity Board",
        "Announcements",
        "Profile",
      ].includes(item.title); // If the role is Admin or Super Admin, show all relevant items
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
        className={`fixed inset-y-0 left-0 z-50 h-screen transition-all duration-300 flex flex-col shadow-lg 
      ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"} 
      ${collapsed ? "w-16" : "w-64"} 
      ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-5 bg-gray-900">
          <div className="flex items-center">
            <img src="/taskflow.png" alt="Logo" className="h-8 mr-2" />
            <Link href={`/ModuleSales/Sales/Dashboard${userId ? `?id=${encodeURIComponent(userId)}` : ''}`}>
              <h1 className={`text-md text-white font-bold transition-opacity ${collapsed ? "opacity-0" : "opacity-100"}`}>
                <span>TASK - </span>
                <span className="inline-block transform scale-x-[-1]">FLOW</span>
              </h1>

            </Link>
          </div>
        </div>

        {/* User Details Section */}
        {!collapsed && (
          <div className="p-6 text-xs text-left border-b-4 border-r-4 border-gray-900">
            <img src={selectedAvatar} alt="Avatar" className="w-12 h-12 object-cover rounded-full mb-2" />
            <p className="font-bold uppercase text-sm">
              {userDetails.Firstname}, {userDetails.Lastname}
            </p>
            <p>{userDetails.Department}</p>
            <p className="italic">( {userDetails.Role} )</p>
            <span
              className={`text-white text-[8px] font-semibold px-3 border-2 border-gray-900 py-1 rounded-full inline-block mt-2 ${userDetails.Status === "Active"
                ? "bg-green-900"
                : userDetails.Status === "Inactive"
                  ? "bg-red-700"
                  : userDetails.Status === "Locked"
                    ? "bg-gray-500"
                    : userDetails.Status === "Busy"
                      ? "bg-yellow-500"
                      : userDetails.Status === "Do not Disturb"
                        ? "bg-gray-800"
                        : "bg-blue-500"
                }`}
            >
              {userDetails.Status}
            </span>
          </div>
        )}

        {/* Menu Section */}
        <div className="flex flex-col items-center flex-grow overflow-y-auto text-xs p-2 border-r-4 border-gray-900">
          <div className="w-full">
            <Link
              href={`/ModuleGlobal/ERP/Dashboard/${userId ? `?id=${encodeURIComponent(userId)}` : ''}`}
              className="flex items-center w-full p-4 bg-gray-100 border-2 border-gray-900 mb-1 text-black rounded transition-all duration-300 ease-in-out hover:shadow-md active:scale-95"
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
                className={`flex items-center w-full p-4 border-2 border-gray-900 mb-1 hover:bg-gray-100 rounded hover:rounded-md hover:text-black transition-all duration-300 ease-in-out hover:shadow-md active:scale-95 ${collapsed ? "justify-center" : ""}`}
              >
                <item.icon size={22} />
                {!collapsed && <span className="ml-2">{item.title}</span>}
                {/* Only show the count if it's greater than zero */}
                {item.title === 'Task' && pendingInquiryCount > 0 && (
                  <span className="ml-2 text-[8px] bg-red-700 rounded-lg m-1 pl-2 pr-2 text-white">{pendingInquiryCount}</span>
                )}
                {item.title === 'My Companies' && pendingInactiveCount > 0 && (
                  <span className="ml-2 text-[8px] bg-red-700 rounded-lg m-1 pl-2 pr-2 text-white">{pendingInactiveCount}</span>
                )}
                {!collapsed && (
                  <span className="ml-auto">
                    {openSections[item.title] ? <RxCaretDown size={15} /> : <RxCaretLeft size={15} />}
                  </span>
                )}
              </button>

              {/* Submenu Items (Collapsible) */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out text-gray-900 ${openSections[item.title] ? "max-h-100 opacity-100" : "max-h-0 opacity-0"}`}>
                {openSections[item.title] && !collapsed && (
                  <div>
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        prefetch={true}
                        className="flex items-center w-full p-4 bg-gray-200 hover:bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 text-gray-900 hover:text-white transition-all border-transparent duration-300 ease-in-out"
                      >
                        <FaRegCircle size={10} className="mr-2 ml-2" />
                        {subItem.title}
                        {subItem.title === 'CSR Inquiries' && pendingInquiryCount > 0 && (
                          <span className="ml-2 text-[8px] bg-red-700 rounded-lg m-1 pl-2 pr-2 text-white">{pendingInquiryCount}</span>
                        )}
                        {subItem.title === 'Inactive Companies' && pendingInactiveCount > 0 && (
                          <span className="ml-2 text-[8px] bg-red-700 rounded-lg m-1 pl-2 pr-2 text-white">{pendingInactiveCount}</span>
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
