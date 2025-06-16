"use client";

import React, { useState, useEffect } from "react";
import { CiUser, CiSettings, CiCoins1, CiViewBoard, CiMemoPad, CiWavePulse1, CiPhone, CiCircleInfo, } from "react-icons/ci";
import { SlChart } from "react-icons/sl";
import { IoHelp } from "react-icons/io5";
import { BsBuildings } from "react-icons/bs";

import Link from 'next/link';
import { useRouter } from "next/navigation";

import SidebarMenu from "./SidebarMenu";
import SidebarUserInfo from "./SidebarUserInfo";
import { Description } from "@headlessui/react";

const Sidebar: React.FC<{ isOpen: boolean, onClose: () => void; isDarkMode: boolean; }> = ({ isOpen, onClose, isDarkMode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState({ Firstname: "", Lastname: "", Location: "", Role: "", Company: "", Status: "", profilePicture: "", ReferenceID: "" });
  const [userNotifications, setUserNotifications] = useState<any>(null);
  const [deleteAccount, setDeleteAccount] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
            notification.status?.toLowerCase() === "unread" &&
            notification.type?.toLowerCase() === "inquiry notification"
        ).length;

        setPendingInquiryCount(pendingCount); // Update state with the count
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    if (userDetails.ReferenceID) fetchUserNotification();
  }, [userDetails.ReferenceID]);

  useEffect(() => {
    const fetchAccountDeletion = async () => {
      try {
        // Fetch accounts and pass ReferenceID from MongoDB
        const response = await fetch(`/api/ModuleSales/Companies/CompanyAccounts/FetchDeleteCount?referenceId=${userDetails.ReferenceID}`);

        if (!response.ok) throw new Error("Failed to fetch accounts for deletion or removal");

        const result = await response.json();

        if (!result.success) {
          console.error(result.error);
          return;
        }

        const data = result.data; // Access the accounts array
        setDeleteAccount(data); // Set the fetched data to state

        // Count accounts where status is "For Deletion" or "Remove"
        const deleteCount = data.filter(
          (account: any) =>
            account.status?.toLowerCase() === "for deletion" ||
            account.status?.toLowerCase() === "remove"
        ).length;

        setPendingDeleteCount(deleteCount); // Update state with the count
      } catch (error) {
        console.error("Error fetching accounts for deletion or removal:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userDetails.ReferenceID) fetchAccountDeletion();
  }, [userDetails.ReferenceID]);

  const menuItems = [
    {
      title: 'My Profile',
      icon: CiSettings,
      subItems: [
        { title: 'Update Profile', href: `/ModuleSales/Sales/Profile${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Developers', href: `/ModuleSales/Sales/Profile/Developers${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Customer Database',
      icon: BsBuildings,
      subItems: [
        { title: 'Active', description: 'Regular Client', href: `/ModuleSales/Sales/Companies/CompanyAccounts${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'New Client', description: 'Outbound / CSR Endorsement / Client Dev', href: `/ModuleSales/Sales/Companies/NewClient${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Non-Buying', description: 'Existing Client / Continous Quote / No SO', href: `/ModuleSales/Sales/Companies/NonBuying${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Inactive', description: 'Order 6 Months Ago - Last Purchased', href: `/ModuleSales/Sales/Companies/Inactive${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Group / Affiliate', description: 'Grouped or Affiliated Companies', href: `/ModuleSales/Sales/Companies/GroupCompanies${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'For Deletion Companies', description: 'Companies to be Deleted', href: `/ModuleSales/Sales/Companies/DeletionCompanies${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Activities',
      icon: CiMemoPad,
      subItems: [
        { title: 'Scheduled Task', description: 'Upcoming Tasks and Reminders', href: `/ModuleSales/Sales/Task/ScheduledTask${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Callbacks', description: 'Follow-Up Calls to Clients', href: `/ModuleSales/Sales/Task/Callback${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Client Coverage Guide', description: 'Client Management Overview', href: `/ModuleSales/Sales/Task/ClientCoverageGuide${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Reports',
      icon: SlChart,
      subItems: [
        { title: 'Account Management', description: 'Manage Client Accounts', href: `/ModuleSales/Sales/Reports/AccountManagement${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Quotation Summary', description: 'Summary of Quotations', href: `/ModuleSales/Sales/Reports/QuotationSummary${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'SO Summary', description: 'Sales Order Overview', href: `/ModuleSales/Sales/Reports/SOSummary${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Pending SO', description: 'Outstanding Sales Orders', href: `/ModuleSales/Sales/Reports/PendingSO${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'CSR Inquiry Summary', description: 'Customer Service Inquiries', href: `/ModuleSales/Sales/Reports/CSRSummary${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Client History', description: 'Past Client Interactions', href: `/ModuleSales/Sales/Reports/ClientHistory${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Sales Performance',
      icon: CiWavePulse1,
      subItems: [
        { title: 'MTD and YTD', href: `/ModuleSales/Sales/SalesPerformance/MTDYTD${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'National',
      icon: CiPhone,
      subItems: [
        { title: 'Daily Call Ranking', href: `/ModuleSales/Sales/National/NationalDailyRanking${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'My Team',
      icon: CiUser,
      subItems: [
        //{ title: 'Daily Call Ranking', href: `/ModuleSales/Sales/Agents/DailyCallRanking${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'List of Sales Associate', href: `/ModuleSales/Sales/Agents/ListSalesAssociate${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Sales Associate Activity', href: `/ModuleSales/Sales/Agents/SalesAssociateActivity${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'For Deletion', href: `/ModuleSales/Sales/Agents/DeletionCompanies${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Conversion Rates',
      icon: CiCoins1,
      subItems: [
        { title: 'Calls to Quote', href: `/ModuleSales/Sales/ConversionRates/CallsToQuote${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Quote to SO', href: `/ModuleSales/Sales/ConversionRates/QuoteToSo${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'SO to SI', href: `/ModuleSales/Sales/ConversionRates/SOToSI${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Conversion Rate Summary', href: `/ModuleSales/Sales/ConversionRates/ConversionRateSummary${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Client Activity Board',
      icon: CiViewBoard,
      subItems: [
        { title: 'Account Records', href: `/ModuleSales/Sales/ClientActivityBoard/AccountRecords${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'List of Companies', href: `/ModuleSales/Sales/ClientActivityBoard/ListofCompanies${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Help Center',
      icon: IoHelp,
      subItems: [
        { title: 'Tutorials', href: `/ModuleSales/Sales/HelpCenter/Tutorials${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'What is Taskflow?',
      icon: CiCircleInfo,
      subItems: [
        { title: 'View Information', href: `/ModuleSales/Sales/Information${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
  ];

  // Filter menu items based on the user's role
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

    if (role === "Admin" || role === "Super Admin") {
      return menuItems; // full access
    }
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
          "What is Taskflow?"
        ].includes(item.title)
      );
    }
    if (role === "Special Access") {
      return menuItems.filter(item =>
        [
          "Customer Database",
          "Activities",  // Note: You had "Activity" but your menu title is "Activities"
          "Sales Performance",
          "Conversion Rates",
          "National",
          "My Team",
          "Client Activity Board",
          "Help Center",
          "Xend Mail",
          "Global Employees",
          "My Profile",
          "What is Taskflow?"
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
          "What is Taskflow?"
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
