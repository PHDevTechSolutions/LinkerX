import { CiUser, CiSettings, CiCoins1, CiViewBoard, CiMemoPad, CiWavePulse1, CiPhone, CiCircleInfo, } from "react-icons/ci";
import { SlChart } from "react-icons/sl";
import { IoHelp } from "react-icons/io5";
import TaskflowIcon from './TaskflowIcon';
import XchireIcon from './XchireIcon';
import Ecodesk from './EcodeskIcon';

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
      title: 'User Management',
      icon: CiUser,
      subItems: [
        { title: 'Territory Sales Associates', href: `/ModuleGlobal/ERP/UserManagement/TSA${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Territory Sales Manager', href: `/ModuleGlobal/ERP/UserManagement/TSM${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Manager', href: `/ModuleGlobal/ERP/UserManagement/ManagerDirectors${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'CSR Agents', href: `/ModuleGlobal/ERP/UserManagement/CSRAgent${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'CSR Admins', href: `/ModuleGlobal/ERP/UserManagement/CSRAdmin${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Admin Management',
      icon: CiUser,
      subItems: [
        { title: 'Admin', href: `/ModuleGlobal/ERP/UserManagement/Employees${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Settings',
      icon: CiSettings,
      subItems: [
        { title: 'Maintenance', href: `/ModuleGlobal/ERP/Settings/Maintenance${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'API Keys', href: `/ModuleGlobal/ERP/Settings/APIKeys${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Help Center',
      icon: IoHelp,
      subItems: [
        { title: 'Tutorials', href: `/ModuleGlobal/ERP/HelpCenter/Tutorials${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
];

export default getMenuItems;
