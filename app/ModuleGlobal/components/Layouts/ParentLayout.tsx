import React, { useState, useEffect, ReactNode } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useRouter } from "next/router";

interface ParentLayoutProps {
  children: ReactNode;
}

interface SidebarSubLink {
  title: string;
  href: string;
}

interface SidebarLink {
  title: string;
  href?: string;
  subItems?: SidebarSubLink[];
}

const ParentLayout: React.FC<ParentLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setDarkMode] = useState(
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [sidebarLinks, setSidebarLinks] = useState<SidebarLink[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    setUserId(id);
  }, []);

  useEffect(() => {
    if (!userId) return;

    setSidebarLinks([
      {
        title: 'My Companies',
        subItems: [
          { title: 'List of Company Accounts', href: `/ModuleSales/Sales/Companies/CompanyAccounts${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
          { title: 'Inactive Companies', href: `/ModuleSales/Sales/Companies/InactiveCompanies${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
          { title: 'Group of Companies', href: `/ModuleSales/Sales/Companies/GroupCompanies${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
          { title: 'For Deletion', href: `/ModuleSales/Sales/Companies/DeletionCompanies${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        ],
      },
      {
        title: 'Task',
        subItems: [
          { title: 'Daily Activity', href: `/ModuleSales/Sales/Task/DailyActivity${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
          { title: 'Callbacks', href: `/ModuleSales/Sales/Task/Callback${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
          { title: 'Client Coverage Guide', href: `/ModuleSales/Sales/Task/ClientCoverageGuide${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
          { title: 'CSR Inquiries', href: `/ModuleSales/Sales/Task/CSRInquiries${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
          { title: 'Quotation', href: `/ModuleSales/Sales/Task/Quotation${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        ],
      },
      {
        title: 'Boards',
        subItems: [
          { title: 'Notes', href: `/ModuleSales/Sales/Boards/Notes${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        ],
      },
      {
        title: 'Sales Performance',
        subItems: [
          { title: 'MTD and YTD', href: `/ModuleSales/Sales/SalesPerformance/MTDYTD${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        ],
      },
      {
        title: 'National',
        subItems: [
          { title: 'Daily Call Ranking', href: `/ModuleSales/Sales/National/NationalDailyRanking${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        ],
      },
      {
        title: 'My Team',
        subItems: [
          { title: 'Daily Call Ranking', href: `/ModuleSales/Sales/Agents/DailyCallRanking${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
          { title: 'List of Sales Associate', href: `/ModuleSales/Sales/Agents/ListSalesAssociate${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
          { title: 'Sales Associate Activity', href: `/ModuleSales/Sales/Agents/SalesAssociateActivity${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
          { title: 'For Deletion', href: `/ModuleSales/Sales/Agents/DeletionCompanies${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        ],
      },
      {
        title: 'Conversion Rates',
        subItems: [
          { title: 'Calls to Quote', href: `/ModuleSales/Sales/ConversionRates/CallsToQuote${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
          { title: 'Quote to SO', href: `/ModuleSales/Sales/ConversionRates/QuoteToSO${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
          { title: 'SO to SI', href: `/ModuleSales/Sales/ConversionRates/SOToSI${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
          { title: 'Conversion Rate Summary', href: `/ModuleSales/Sales/ConversionRates/ConversionRateSummary${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        ],
      },
      {
        title: 'Client Activity Board',
        subItems: [
          { title: 'Account Records', href: `/ModuleSales/Sales/ClientActivityBoard/AccountRecords${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
          { title: 'List of Companies', href: `/ModuleSales/Sales/ClientActivityBoard/ListofCompanies${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        ],
      },
      {
        title: 'Logs',
        subItems: [
          { title: 'Activity Logs', href: `/ModuleSales/Sales/Logs/ActivityLogs${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
          { title: 'Progress Logs', href: `/ModuleSales/Sales/Logs/ProgressLogs${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
          { title: 'Approvals', href: `/ModuleSales/Sales/Logs/Approvals${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
          { title: 'Historical Records', href: `/ModuleSales/Sales/Logs/HistoricalRecords${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        ],
      },
      {
        title: 'Announcements',
        subItems: [
          { title: 'System Updates', href: `/ModuleSales/Sales/Announcements/SystemUpdates${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        ],
      },
      {
        title: 'User Management',
        subItems: [
          { title: 'Company Accounts', href: `/ModuleSales/Sales/UserManagement/CompanyAccounts${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
          { title: 'Territory Sales Associates', href: `/ModuleSales/Sales/UserManagement/TSA${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
          { title: 'Territory Sales Manager', href: `/ModuleSales/Sales/UserManagement/TSM${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
          { title: 'Managers & Directors', href: `/ModuleSales/Sales/UserManagement/ManagerDirectors${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        ],
      },
      {
        title: 'Settings',
        subItems: [
          { title: 'Maintenance', href: `/ModuleSales/Sales/Settings/Maintenance${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
          { title: 'API Keys', href: `/ModuleSales/Sales/Settings/APIKeys${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        ],
      },
      {
        title: 'Profile',
        subItems: [
          { title: 'Update Profile', href: `/ModuleSales/Sales/Profile${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
          { title: 'Developers', href: `/ModuleSales/Sales/Profile/Developers${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        ],
      },
    ]);
  }, [userId]); // 🔹 Re-run this effect when `userId` changes

  return (
    <div className={`flex style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }} ${isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(!isSidebarOpen)} isDarkMode={isDarkMode} />
      <div className={`flex-grow transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"} md:ml-64`}>
        <Navbar onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} onToggleTheme={() => setDarkMode(!isDarkMode)} isDarkMode={isDarkMode} sidebarLinks={sidebarLinks} />
        <main className="p-4 min-h-screen">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default ParentLayout;
