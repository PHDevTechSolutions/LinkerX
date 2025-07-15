import { FcLink, FcPuzzle, FcManager, FcLock, FcInfo } from "react-icons/fc";

const getMenuItems = (
  userId: string | null = "",
  role: string | null = ""
) => [
    {
      title: 'Applications',
      icon: FcPuzzle,
      subItems: [
        { title: 'Integration', href: `/ModuleGlobal/ERP/Application/Integration${userId ? `?id=${encodeURIComponent(userId)}` : ''}` },
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
