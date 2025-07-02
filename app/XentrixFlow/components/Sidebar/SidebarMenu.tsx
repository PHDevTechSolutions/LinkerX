// components/Sidebar/SidebarMenu.tsx
import { CiTimer, CiUser, CiSettings, CiCoins1, CiViewBoard, CiMemoPad, CiWavePulse1, CiPhone, CiCircleInfo, CiCalendar, CiGrid42, CiInboxIn, CiCircleQuestion, CiMail } from "react-icons/ci";
import { IoHelp } from "react-icons/io5";
import { TbBuildingBurjAlArab } from "react-icons/tb";
// Route for Taskflow Icon
import TaskflowIcon from './TaskflowIcon';

export type Role = 
  | "Admin"
  | "Super Admin"
  | "Territory Sales Associate"
  | "Territory Sales Manager"
  | "Business Development Manager"
  | "Business Development Officer"
  | "CSR Staff"
  | "CSR Manager"
  | string; // fallback for any other role

export const getSidebarMenu = (
  userId: string | null, 
  role: Role, 
  agentMode: boolean,
  userDetails?: { Role?: string } // for conditional subitems like Taskflow Database
) => {
  // Full menu definitions
  const allMenuItems = {
    myCompanies: {
      title: "My Companies",
      icon: TbBuildingBurjAlArab,
      subItems: [
        { title: "List of Company Accounts", href: `/XentrixFlow/Folders/Accounts/Page1${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "Inactive Companies", href: `/XentrixFlow/Folders/Companies/InactiveCompanies${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "Group of Companies", href: `/XentrixFlow/Folders/Companies/GroupCompanies${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "For Deletion", href: `/XentrixFlow/Folders/Companies/DeletionCompanies${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
      ],
    },
    activities: {
      title: "Activities",
      icon: CiMemoPad,
      subItems: [
        { title: "Automated Task", href: `/XentrixFlow/Folders/Task/DailyActivity${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "Manual Task", href: `/XentrixFlow/Folders/Task/ManualDailyActivity${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "Callbacks", href: `/XentrixFlow/Folders/Task/Callback${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "Client Coverage Guide", href: `/XentrixFlow/Folders/Task/ClientCoverageGuide${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "CSR Inquiries", href: `/XentrixFlow/Folders/Task/CSRInquiries${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "Historical Records", href: `/XentrixFlow/Folders/Task/HistoricalRecords${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
      ],
    },
    projects: {
      title: "Projects",
      icon: CiCalendar,
      subItems: [
        { title: "List of Projects", href: `/XentrixFlow/Folders/Projects/Project${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "Project Categories", href: `/XentrixFlow/Folders/Projects/ProjectCategory${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "Type of Project/Business", href: `/XentrixFlow/Folders/Projects/ProjectType${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
      ],
    },
    boards: {
      title: "Boards",
      icon: CiViewBoard,
      subItems: [{ title: "Notes", href: `/XentrixFlow/Folders/Boards/Notes${userId ? `?id=${encodeURIComponent(userId)}` : ""}` }],
    },
    salesPerformance: {
      title: "Sales Performance",
      icon: CiWavePulse1,
      subItems: [{ title: "MTD and YTD", href: `/XentrixFlow/Folders/SalesPerformance/MTDYTD${userId ? `?id=${encodeURIComponent(userId)}` : ""}` }],
    },
    national: {
      title: "National",
      icon: CiPhone,
      subItems: [{ title: "Daily Call Ranking", href: `/XentrixFlow/Folders/National/NationalDailyRanking${userId ? `?id=${encodeURIComponent(userId)}` : ""}` }],
    },
    myTeam: {
      title: "My Team",
      icon: CiUser,
      subItems: [
        { title: "Daily Call Ranking", href: `/XentrixFlow/Folders/Agents/DailyCallRanking${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "List of Sales Associate", href: `/XentrixFlow/Folders/Agents/ListSalesAssociate${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "Sales Associate Activity", href: `/XentrixFlow/Folders/Agents/SalesAssociateActivity${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "For Deletion", href: `/XentrixFlow/Folders/Agents/DeletionCompanies${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
      ],
    },
    conversionRates: {
      title: "Conversion Rates",
      icon: CiCoins1,
      subItems: [
        { title: "Calls to Quote", href: `/XentrixFlow/Folders/ConversionRates/CallsToQuote${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "Quote to SO", href: `/XentrixFlow/Folders/ConversionRates/QuoteToSo${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "SO to SI", href: `/XentrixFlow/Folders/ConversionRates/SOToSI${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "Conversion Rate Summary", href: `/XentrixFlow/Folders/ConversionRates/ConversionRateSummary${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
      ],
    },
    clientActivityBoard: {
      title: "Client Activity Board",
      icon: CiViewBoard,
      subItems: [
        { title: "Account Records", href: `/XentrixFlow/Folders/ClientActivityBoard/AccountRecords${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "List of Companies", href: `/XentrixFlow/Folders/ClientActivityBoard/ListofCompanies${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
      ],
    },
    logs: {
      title: "Logs",
      icon: CiTimer,
      subItems: [
        { title: "Activity Logs ( OLD Taskflow )", href: `/XentrixFlow/Folders/Logs/ActivityLogs${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "Activity Logs ( New Taskflow )", href: `/XentrixFlow/Folders/Logs/TaskflowActivityLogs${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "Progress Logs ( OLD Taskflow )", href: `/XentrixFlow/Folders/Logs/ProgressLogs${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "Progress Logs ( New Taskflow )", href: `/XentrixFlow/Folders/Logs/TaskflowProgressLogs${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "Approvals", href: `/XentrixFlow/Folders/Logs/Approvals${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "Historical Records", href: `/XentrixFlow/Folders/Logs/HistoricalRecords${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
      ],
    },
    userManagement: {
      title: "User Management",
      icon: CiUser,
      subItems: [
        { title: "Company Accounts", href: `/XentrixFlow/Folders/UserManagement/CompanyAccounts${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "Territory Sales Associates", href: `/XentrixFlow/Folders/UserManagement/TSA${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "Territory Sales Manager", href: `/XentrixFlow/Folders/UserManagement/TSM${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "Managers & Directors", href: `/XentrixFlow/Folders/UserManagement/ManagerDirectors${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
      ],
    },
    globalEmployees: {
      title: "Global Employees",
      icon: CiUser,
      subItems: [
        { title: "Ecoshift Employees", href: `/XentrixFlow/Folders/Ecoshift/Employees${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
      ],
    },
    settings: {
      title: "Settings",
      icon: CiSettings,
      subItems: [
        { title: "Maintenance", href: `/XentrixFlow/Folders/Settings/Maintenance${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "API Keys", href: `/XentrixFlow/Folders/Settings/APIKeys${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
      ],
    },
    profileSales: {
      title: "Profile",
      icon: CiSettings,
      subItems: [
        { title: "Update Profile", href: `/XentrixFlow/Folders/Profile${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "Notifications", href: `/XentrixFlow/Folders/Notifications${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "Developers", href: `/XentrixFlow/Folders/Profile/Developers${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
      ],
    },
    helpCenterSales: {
      title: "Help Center",
      icon: IoHelp,
      subItems: [
        { title: "Tutorials", href: `/XentrixFlow/Folders/HelpCenter/Tutorials${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
      ],
    },
    whatIsTaskflow: {
      title: "What is Taskflow?",
      icon: CiCircleInfo,
      subItems: [
        { title: "View Information", href: `/XentrixFlow/Folders/Information${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
      ],
    },
    inquiries: {
      title: "Inquiries",
      icon: CiInboxIn,
      subItems: [
        { title: "Automated Tickets", href: `/XentrixFlow/Folders/AutomatedTickets/Tickets${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "Website Portal ( Inquiries )", href: `/XentrixFlow/Folders/WebsiteInquiry${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "Manual Tickets", href: `/XentrixFlow/Folders/ManualTickets/Tickets${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
      ],
    },
    customerDatabase: {
      title: "Customer Database",
      icon: TbBuildingBurjAlArab,
      subItems: [
        { title: "Customer Profile", href: `/XentrixFlow/Folders/CustomerDatabase/CustomerProfile${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
      ],
    },
    reports: {
      title: "Reports",
      icon: CiTimer,
      subItems: [
        { title: "Masterlist", href: `/XentrixFlow/Folders/Reports/Masterlist${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "Tickets per Status", href: `/XentrixFlow/Folders/Reports/TicketsPerStatus${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "Ticket Analysis", href: `/XentrixFlow/Folders/Reports/TicketAnalysis${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "Agent Analysis", href: `/XentrixFlow/Folders/Reports/AgentAnalysis${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
      ],
    },
    email: {
      title: "Email",
      icon: CiCircleQuestion,
      subItems: [
        { title: "Inbox", href: `/XentrixFlow/Folders/Email/Inbox${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
      ],
    },
    taskflow: {
      title: "Taskflow",
      icon: TaskflowIcon,
      subItems: [
        { title: "Taskflow", href: `/XentrixFlow/Folders/Taskflow/Taskflow${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
        { title: "Taskflow Database", href: `/XentrixFlow/Folders/Taskflow/TaskflowDatabase${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
      ],
    },
    ecohelp: {
      title: "Eco Help",
      icon: CiCircleQuestion,
      subItems: [
        { title: "Tickets", href: `/XentrixFlow/Folders/Ecohelp/Tickets${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
      ],
    },
    profileCSR: {
      title: "Profile",
      icon: CiSettings,
      subItems: [
        { title: "Update Profile", href: `/XentrixFlow/Folders/Profile${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
      ],
    },
    whatIsEcodesk: {
      title: "What is Ecodesk?",
      icon: CiCircleInfo,
      subItems: [
        { title: "View Information", href: `/XentrixFlow/Folders/Information${userId ? `?id=${encodeURIComponent(userId)}` : ""}` },
      ],
    },
  };

  // Role-based allowed menu keys
  const roleMenuKeys: Record<string, string[]> = {
    Admin: [
      "myCompanies", "activities", "projects", "boards", "salesPerformance", "national",
      "myTeam", "conversionRates", "clientActivityBoard", "logs", "userManagement",
      "globalEmployees", "profileSales", "helpCenterSales", "whatIsTaskflow"
    ],
    "Super Admin": [
      "myCompanies", "activities", "projects", "boards", "salesPerformance", "national",
      "myTeam", "conversionRates", "clientActivityBoard", "logs", "userManagement",
      "globalEmployees", "profileSales", "helpCenterSales", "whatIsTaskflow"
    ],
    "Territory Sales Associate": [
      "myCompanies", "activities", "projects", "boards",
      "globalEmployees", "profileSales", "helpCenterSales", "whatIsTaskflow"
    ],
    "Territory Sales Manager": [
      "salesPerformance", "national", "myTeam", "clientActivityBoard",
      "globalEmployees", "profileSales", "helpCenterSales", "whatIsTaskflow",
      "myCompanies", "activities", "projects", "boards"
    ],
    "Business Development Manager": [
      "salesPerformance", "national", "myTeam", "clientActivityBoard",
      "myCompanies", "activities", "helpCenterSales", "whatIsTaskflow", "profileSales"
    ],
    "Business Development Officer": [
      "myCompanies", "activities", "helpCenterSales", "globalEmployees", "profileSales", "whatIsTaskflow"
    ],
    "CSR Staff": [
      "inquiries", "customerDatabase", "reports", "email", "taskflow", "ecohelp", "profileCSR", "whatIsEcodesk"
    ],
    "CSR Manager": [
      "inquiries", "customerDatabase", "reports", "email", "taskflow", "ecohelp", "profileCSR", "whatIsEcodesk"
    ],
  };

  const allowedKeys = roleMenuKeys[role] || [];

  const menu = allowedKeys
    .map((key) => allMenuItems[key as keyof typeof allMenuItems])
    .filter(Boolean);

  return menu;
};