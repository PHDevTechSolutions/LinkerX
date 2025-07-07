import { CiUser, CiSettings } from "react-icons/ci";
import { IoHelp } from "react-icons/io5";
import TaskflowIcon from './TaskflowIcon';
import Ecodesk from './EcodeskIcon';

const getMenuItems = (userId: string | null = "") => [
    {
      title: 'Taskflow',
      icon: TaskflowIcon,
      subItems: [
        { 
          title: 'Customer Database', 
          href: `/ModuleGlobal/ERP/Taskflow/CustomerDatabase${userId ? `?id=${encodeURIComponent(userId)}` : ''}` 
        },
        { 
          title: 'Activity Logs', 
          href: `/ModuleGlobal/ERP/Taskflow/ActivityLogs${userId ? `?id=${encodeURIComponent(userId)}` : ''}` 
        },
        { 
          title: 'Progress Logs', 
          href: `/ModuleGlobal/ERP/Taskflow/ProgressLogs${userId ? `?id=${encodeURIComponent(userId)}` : ''}` 
        },
        { 
          title: 'CSR Inquiries', 
          href: `/ModuleGlobal/ERP/Taskflow/CSRInquiries${userId ? `?id=${encodeURIComponent(userId)}` : ''}` 
        },
        { 
          title: 'Notifications', 
          href: `/ModuleGlobal/ERP/Taskflow/Notifications${userId ? `?id=${encodeURIComponent(userId)}` : ''}` 
        },
        { 
          title: 'Territory Sales Associates', 
          href: `/ModuleGlobal/ERP/Taskflow/TSA${userId ? `?id=${encodeURIComponent(userId)}` : ''}` 
        },
        { 
          title: 'Territory Sales Manager', 
          href: `/ModuleGlobal/ERP/Taskflow/TSM${userId ? `?id=${encodeURIComponent(userId)}` : ''}` 
        },
        { 
          title: 'Manager', 
          href: `/ModuleGlobal/ERP/Taskflow/Manager${userId ? `?id=${encodeURIComponent(userId)}` : ''}` 
        },
      ],
    },
    {
      title: 'Ecodesk',
      icon: Ecodesk,
      subItems: [
        { 
          title: 'Customer Database', 
          href: `/ModuleGlobal/ERP/Ecodesk/CustomerDatabase${userId ? `?id=${encodeURIComponent(userId)}` : ''}` 
        },
        { 
          title: 'Ticket Logs', 
          href: `/ModuleGlobal/ERP/Ecodesk/OutboundCall${userId ? `?id=${encodeURIComponent(userId)}` : ''}` 
        },
        { 
          title: 'Tracking Logs', 
          href: `/ModuleGlobal/ERP/Ecodesk/Database${userId ? `?id=${encodeURIComponent(userId)}` : ''}` 
        },
        { 
          title: 'CSR Agents', 
          href: `/ModuleGlobal/ERP/UserManagement/CSRAgent${userId ? `?id=${encodeURIComponent(userId)}` : ''}` 
        },
        { 
          title: 'CSR Admins', 
          href: `/ModuleGlobal/ERP/UserManagement/CSRAdmin${userId ? `?id=${encodeURIComponent(userId)}` : ''}` 
        },
      ],
    },
    {
      title: 'Admin Management',
      icon: CiUser,
      subItems: [
        { 
          title: 'Admin', 
          href: `/ModuleGlobal/ERP/UserManagement/Admin${userId ? `?id=${encodeURIComponent(userId)}` : ''}` 
        },
        { 
          title: 'Sessions', 
          href: `/ModuleGlobal/ERP/UserManagement/Sessions${userId ? `?id=${encodeURIComponent(userId)}` : ''}` 
        },
      ],
    },
    {
      title: 'Help Center',
      icon: IoHelp,
      subItems: [
        { 
          title: 'Tutorials', 
          href: `/ModuleGlobal/ERP/HelpCenter/Tutorials${userId ? `?id=${encodeURIComponent(userId)}` : ''}` 
        },
      ],
    },
];

export default getMenuItems;
