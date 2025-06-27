import { CiUser, CiSettings, CiCoins1, CiViewBoard, CiMemoPad, CiWavePulse1, CiPhone, CiCircleInfo, } from "react-icons/ci";
import { SlChart } from "react-icons/sl";
import { IoHelp } from "react-icons/io5";
import { BsBuildings } from "react-icons/bs";

const getMenuItems = (userId: string | null = "") => [
    {
        title: "Customer Database",
        icon: BsBuildings,
        subItems: [
            { 
                title: "Active", 
                description: "Regular Client", 
                href: `/ModuleBD/BD/Companies/Active${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "New Client", 
                description: "Outbound / CSR Endorsement / Client Dev", 
                href: `/ModuleBD/BD/Companies/NewClient${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "Non-Buying", 
                description: "Existing Client / Continous Quote / No SO", 
                href: `/ModuleBD/BD/Companies/NonBuying${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "Inactive", 
                description: "Order 6 Months Ago - Last Purchased", 
                href: `/ModuleBD/BD/Companies/Inactive${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "Group / Affiliate", 
                description: "Grouped or Affiliated Companies", 
                href: `/ModuleBD/BD/Companies/GroupCompanies${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "For Deletion Companies", 
                description: "Companies to be Deleted", 
                href: `/ModuleBD/BD/Companies/DeletionCompanies${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "Client History", 
                description: "Past Client Interactions", 
                href: `/ModuleBD/BD/Companies/ClientHistory${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
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
                href: `/ModuleBD/BD/Task/ScheduledActivity${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "Client Coverage Guide", 
                description: "Client Management Overview", 
                href: `/ModuleBD/BD/Task/ClientCoverageGuide${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
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
                href: `/ModuleBD/BD/Reports/AccountManagement${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "Quotation Summary", 
                description: "Summary of Quotations", 
                href: `/ModuleBD/BD/Reports/QuotationSummary${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "SO Summary", 
                description: "Sales Order Overview", 
                href: `/ModuleBD/BD/Reports/SOSummary${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "Pending SO", 
                description: "Outstanding Sales Orders", 
                href: `/ModuleBD/BD/Reports/PendingSO${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "CSR Inquiry Summary", 
                description: "Customer Service Inquiries", 
                href: `/ModuleBD/BD/Reports/CSRSummary${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "SPF Summary", 
                description: "Special Pricing Form Breakdown",
                href: `/ModuleBD/BD/Reports/SPFSummary${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "New Client Summary", 
                description: "Recently Onboarded Clients", 
                href: `/ModuleBD/BD/Reports/NewClientSummary${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
        ],
    },
    {
        title: "Sales Performance",
        icon: CiWavePulse1,
        subItems: [
            { 
                title: "MTD and YTD", 
                href: `/ModuleBD/BD/SalesPerformance/MTDYTD${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
        ],
    },
    {
        title: "National",
        icon: CiPhone,
        subItems: [
            { 
                title: "Daily Call Ranking", 
                href: `/ModuleBD/BD/National/NationalDailyRanking${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
        ],
    },
    {
        title: "My Team",
        icon: CiUser,
        subItems: [
            { 
                title: "List of Sales Associate", 
                href: `/ModuleBD/BD/Agents/ListSalesAssociate${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "Sales Associate Activity", 
                href: `/ModuleBD/BD/Agents/SalesAssociateActivity${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "For Deletion", 
                href: `/ModuleBD/BD/Agents/DeletionCompanies${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
        ],
    },
    {
        title: "Conversion Rates",
        icon: CiCoins1,
        subItems: [
            { 
                title: "Calls to Quote", 
                href: `/ModuleBD/BD/ConversionRates/CallsToQuote${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "Quote to SO", 
                href: `/ModuleBD/BD/ConversionRates/QuoteToSo${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "SO to SI", 
                href: `/ModuleBD/BD/ConversionRates/SOToSI${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "Conversion Rate Summary", 
                href: `/ModuleBD/BD/ConversionRates/ConversionRateSummary${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
        ],
    },
    {
        title: "Client Activity Board",
        icon: CiViewBoard,
        subItems: [
            { 
                title: "Account Records", 
                href: `/ModuleBD/BD/ClientActivityBoard/AccountRecords${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
            { 
                title: "List of Companies", 
                href: `/ModuleBD/BD/ClientActivityBoard/ListofCompanies${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
        ],
    },
    {
        title: "Help Center",
        icon: IoHelp,
        subItems: [
            { 
                title: "Tutorials", 
                href: `/ModuleBD/BD/HelpCenter/Tutorials${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
        ],
    },
    {
        title: "What is Taskflow?",
        icon: CiCircleInfo,
        subItems: [
            { 
                title: "View Information", 
                href: `/ModuleBD/BD/Information${userId ? `?id=${encodeURIComponent(userId)}` : ""}` 
            },
        ],
    },
];

export default getMenuItems;
