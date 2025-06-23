import { CiUser, CiSettings, CiCoins1, CiViewBoard, CiMemoPad, CiWavePulse1, CiPhone, CiCircleInfo, } from "react-icons/ci";
import { SlChart } from "react-icons/sl";
import { IoHelp } from "react-icons/io5";
import { BsBuildings } from "react-icons/bs";

const getMenuItems = (userId: string | null = "") => [
    {
        title: "My Profile",
        icon: CiSettings,
        subItems: [
            {
                title: "Update Profile",
                href: `/ModuleSales/Sales/Profile${userId ? `?id=${encodeURIComponent(userId)}` : ""}`
            },
            { 
                title: "Developers", 
                href: `/ModuleSales/Sales/Profile/Developers${userId ? `?id=${encodeURIComponent(userId)}` : ""}`
            },
        ],
    },
    {
        title: "Customer Database",
        icon: BsBuildings,
        subItems: [
            { 
                title: "Active", 
                description: "Regular Client", 
                href: `/ModuleSales/Sales/Companies/CompanyAccounts${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "New Client", 
                description: "Outbound / CSR Endorsement / Client Dev", 
                href: `/ModuleSales/Sales/Companies/NewClient${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "Non-Buying", 
                description: "Existing Client / Continous Quote / No SO", 
                href: `/ModuleSales/Sales/Companies/NonBuying${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "Inactive", 
                description: "Order 6 Months Ago - Last Purchased", 
                href: `/ModuleSales/Sales/Companies/Inactive${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "Group / Affiliate", 
                description: "Grouped or Affiliated Companies", 
                href: `/ModuleSales/Sales/Companies/GroupCompanies${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "For Deletion Companies", 
                description: "Companies to be Deleted", 
                href: `/ModuleSales/Sales/Companies/DeletionCompanies${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "Client History", 
                description: "Past Client Interactions", 
                href: `/ModuleSales/Sales/Reports/ClientHistory${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
        ],
    },
    {
        title: "Activities",
        icon: CiMemoPad,
        subItems: [
            { 
                title: "Scheduled Task", 
                description: "Upcoming Tasks and Reminders", 
                href: `/ModuleSales/Sales/Task/ScheduledActivity${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "Client Coverage Guide", 
                description: "Client Management Overview", 
                href: `/ModuleSales/Sales/Task/ClientCoverageGuide${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
        ],
    },
    {
        title: "Reports",
        icon: SlChart,
        subItems: [
            { 
                title: "Account Management", 
                description: "Manage Client Accounts", 
                href: `/ModuleSales/Sales/Reports/AccountManagement${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "Quotation Summary", 
                description: "Summary of Quotations", 
                href: `/ModuleSales/Sales/Reports/QuotationSummary${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "SO Summary", 
                description: "Sales Order Overview", 
                href: `/ModuleSales/Sales/Reports/SOSummary${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "Pending SO", 
                description: "Outstanding Sales Orders", 
                href: `/ModuleSales/Sales/Reports/PendingSO${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "CSR Inquiry Summary", 
                description: "Customer Service Inquiries", 
                href: `/ModuleSales/Sales/Reports/CSRSummary${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "SPF Summary", 
                description: "Special Pricing Form Breakdown",
                href: `/ModuleSales/Sales/Reports/SPFSummary${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "New Client Summary", 
                description: "Recently Onboarded Clients", 
                href: `/ModuleSales/Sales/Reports/NewClientSummary${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
        ],
    },
    {
        title: "Sales Performance",
        icon: CiWavePulse1,
        subItems: [
            { 
                title: "MTD and YTD", 
                href: `/ModuleSales/Sales/SalesPerformance/MTDYTD${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
        ],
    },
    {
        title: "National",
        icon: CiPhone,
        subItems: [
            { 
                title: "Daily Call Ranking", 
                href: `/ModuleSales/Sales/National/NationalDailyRanking${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
        ],
    },
    {
        title: "My Team",
        icon: CiUser,
        subItems: [
            { 
                title: "List of Sales Associate", 
                href: `/ModuleSales/Sales/Agents/ListSalesAssociate${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "Sales Associate Activity", 
                href: `/ModuleSales/Sales/Agents/SalesAssociateActivity${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "For Deletion", 
                href: `/ModuleSales/Sales/Agents/DeletionCompanies${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
        ],
    },
    {
        title: "Conversion Rates",
        icon: CiCoins1,
        subItems: [
            { 
                title: "Calls to Quote", 
                href: `/ModuleSales/Sales/ConversionRates/CallsToQuote${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "Quote to SO", 
                href: `/ModuleSales/Sales/ConversionRates/QuoteToSo${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "SO to SI", 
                href: `/ModuleSales/Sales/ConversionRates/SOToSI${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "Conversion Rate Summary", 
                href: `/ModuleSales/Sales/ConversionRates/ConversionRateSummary${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
        ],
    },
    {
        title: "Client Activity Board",
        icon: CiViewBoard,
        subItems: [
            { 
                title: "Account Records", 
                href: `/ModuleSales/Sales/ClientActivityBoard/AccountRecords${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "List of Companies", 
                href: `/ModuleSales/Sales/ClientActivityBoard/ListofCompanies${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
        ],
    },
    {
        title: "Help Center",
        icon: IoHelp,
        subItems: [
            { 
                title: "Tutorials", 
                href: `/ModuleSales/Sales/HelpCenter/Tutorials${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
        ],
    },
    {
        title: "What is Taskflow?",
        icon: CiCircleInfo,
        subItems: [
            { 
                title: "View Information", 
                href: `/ModuleSales/Sales/Information${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
        ],
    },
];

export default getMenuItems;
