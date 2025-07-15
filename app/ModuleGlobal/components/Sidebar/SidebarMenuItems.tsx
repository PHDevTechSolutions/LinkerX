import { FcLink, FcPuzzle, FcManager, FcLock, FcInfo, FcCommandLine } from "react-icons/fc";

const getMenuItems = (
  userId: string | null = "",
  role: string | null = ""
) => [
    {
      title: 'Applications',
      icon: FcPuzzle,
      subItems: [
        { title: 'Modules', href: `/ModuleGlobal/ERP/Application/Integration${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Linker X',
      icon: FcLink,
      subItems: [
        { title: 'Links', href: `/ModuleGlobal/ERP/Links/${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'IT Systems & Operations',
      icon: FcCommandLine,
      subItems: [
        { title: 'Asset Inventory', href: `/ModuleGlobal/ERP/IT/Assets/${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Employee Monitoring', href: `/ModuleGlobal/ERP/Links/${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Network Performance', href: `/ModuleGlobal/ERP/Links/${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Network Credentials', href: `/ModuleGlobal/ERP/Links/${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'PRS & Transmittals', href: `/ModuleGlobal/ERP/Links/${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'System Credentials', href: `/ModuleGlobal/ERP/Links/${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'User Accounts',
      icon: FcManager,
      subItems: [
        { title: 'Other Roles', href: `/ModuleGlobal/ERP/Admin/Other${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
        { title: 'Sessions', href: `/ModuleGlobal/ERP/Admin/Session${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
    {
      title: 'Admin Management',
      icon: FcLock,
      subItems: [
        ...(role === "Super Admin"
          ? [{ title: 'Admin', href: `/ModuleGlobal/ERP/Admin/User${userId ? `?id=${encodeURIComponent(userId)}` : ''}` }]
          : []),
      ],
    },
    {
      title: 'Help Center',
      icon: FcInfo,
      subItems: [
        { title: 'Tutorials', href: `/ModuleGlobal/ERP/HelpCenter/Tutorials${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
      ],
    },
  ];

export default getMenuItems;
