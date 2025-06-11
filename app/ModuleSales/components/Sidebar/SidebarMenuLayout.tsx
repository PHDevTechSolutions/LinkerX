import React, { useState, useEffect } from "react";
import { FaRegCircle } from "react-icons/fa";
import { CiGrid42 } from "react-icons/ci";
import Link from "next/link";
import { TbAtom, TbAtomOff } from "react-icons/tb";
import { BiCollapse, BiExpand, BiCustomize, BiSearch } from "react-icons/bi";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
// Rout for Sidebar Modal Customization
import SidebarModalCustomize from "../../components/Sidebar/SidebarModalCustomize";

interface MenuItem {
  title: string;
  icon: React.ElementType;
  subItems: { title: string; href: string; icon?: React.ElementType }[];
}

interface SidebarMenuProps {
  userId: string | null;
  filteredMenuItems: MenuItem[];
  collapsed: boolean;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  userId,
  filteredMenuItems,
  collapsed,
}) => {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  // Manage open sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    const saved = localStorage.getItem("sidebarSections");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("sidebarSections", JSON.stringify(openSections));
  }, [openSections]);

  // Customize modal state
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  // Tabs: 0 = Main Items, 1 = Sub Items
  const [activeTab, setActiveTab] = useState(0);

  // Store selected visibility preferences
  // Initialize from localStorage or default all true
  const [visibleItems, setVisibleItems] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    const saved = localStorage.getItem("sidebarVisibleItems");
    if (saved) return JSON.parse(saved);
    // Default all visible
    const defaultVisibles: Record<string, boolean> = {};
    filteredMenuItems.forEach((item) => {
      defaultVisibles[item.title] = true;
      item.subItems.forEach((sub) => {
        defaultVisibles[`${item.title}::${sub.title}`] = true;
      });
    });
    return defaultVisibles;
  });

  // Save visibility prefs to localStorage
  useEffect(() => {
    localStorage.setItem("sidebarVisibleItems", JSON.stringify(visibleItems));
  }, [visibleItems]);

  const handleToggle = (section: string) =>
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));

  const expandAll = () => {
    const allOpen = filteredMenuItems.reduce((acc, item) => {
      acc[item.title] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setOpenSections(allOpen);
  };

  const collapseAll = () => {
    const allClosed = filteredMenuItems.reduce((acc, item) => {
      acc[item.title] = false;
      return acc;
    }, {} as Record<string, boolean>);
    setOpenSections(allClosed);
  };

  // Filter sidebar items by search and visibility
  const filteredItems = filteredMenuItems
    .filter(
      (item) =>
        visibleItems[item.title] &&
        (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.subItems.some(
            (sub) =>
              visibleItems[`${item.title}::${sub.title}`] &&
              sub.title.toLowerCase().includes(searchTerm.toLowerCase())
          ))
    )
    .map((item) => ({
      ...item,
      subItems: item.subItems.filter(
        (sub) => visibleItems[`${item.title}::${sub.title}`]
      ),
    }));

  const allExpanded =
    filteredItems.length > 0 &&
    filteredItems.every((item) => openSections[item.title]);

  // Handlers for checkbox toggle in customize modal
  const toggleVisibility = (key: string) => {
    setVisibleItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <div className="flex flex-col flex-grow overflow-y-auto p-2 text-xs">
        {/* Controls Row */}
        <div className="flex items-center justify-between mb-3 gap-2">
          {/* Left side: Customize */}
          <div>
            <button
              onClick={() => setIsCustomizeOpen(true)}
              className="text-xs px-2 py-1 bg-cyan-400 text-white rounded-md hover:bg-cyan-500 transition flex items-center gap-1"
              type="button"
            >
              <BiCustomize size={16} /> Customize
            </button>
          </div>

          {/* Right side: Collapse/Expand & Search */}
          <div className="flex gap-1">
            {allExpanded ? (
              <button
                onClick={collapseAll}
                className="text-xs px-2 py-1 rounded flex items-center hover:bg-cyan-400 hover:text-white dark:hover:bg-gray-700 transition"
                aria-label="Collapse all sections"
                type="button"
                title="Collapse Sidebar"
              >
                <BiCollapse size={16} />
              </button>
            ) : (
              <button
                onClick={expandAll}
                className="text-xs px-2 py-1 rounded flex items-center hover:bg-cyan-400 hover:text-white dark:hover:bg-gray-700 transition"
                aria-label="Expand all sections"
                type="button"
                title="Expand Sidebar"
              >
                <BiExpand size={16} />
              </button>
            )}

            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen((prev) => !prev)}
              className="text-xs px-2 py-1 hover:rounded-md hover:bg-cyan-400 hover:text-white transition flex items-center"
              type="button"
              aria-label="Toggle search"
              title="Search Menu"
            >
              <BiSearch size={18} />
            </button>
          </div>
        </div>


        {/* Search bar popup */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-3 overflow-hidden"
              style={{ position: "relative", zIndex: 20 }}
            >
              <input
                type="text"
                placeholder="Search..."
                className="w-full p-2 text-xs rounded-md border dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative w-full">
          {/* Inner bottom glowing line */}
          <div className="pointer-events-none absolute bottom-1 left-1 right-1 h-[2px] 
                  bg-cyan-400 opacity-80 rounded-sm
                  shadow-[0_0_8px_2px_rgba(0,255,255,0.6)]
                  animate-pulse" />
          <Link
            href={`/ModuleSales/Sales/Dashboard/${userId ? `?id=${encodeURIComponent(userId)}` : ""}`}
            className="relative flex items-center w-full p-4 hover:bg-gray-200 hover:text-black rounded-md hover:shadow-md active:scale-95 transition"
          >
            <CiGrid42 size={22} className="mr-1" /> Dashboard
          </Link>
        </div>

        {filteredItems.map((item, index) => (
          <div key={index} className="w-full">
            <button
              onClick={() => handleToggle(item.title)}
              role="button"
              aria-expanded={!!openSections[item.title]}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleToggle(item.title);
              }}
              title={collapsed ? item.title : undefined}
              className={`flex items-center w-full p-4 hover:bg-gray-200 hover:text-black rounded-md transition-all hover:shadow-md active:scale-95 ${collapsed ? "justify-center relative group" : ""
                }`}
            >
              <item.icon size={18} />
              {!collapsed && <span className="ml-2">{item.title}</span>}
              <span className="ml-auto">
                {openSections[item.title] ? <TbAtomOff size={15} /> : <TbAtom size={15} />}
              </span>

              {collapsed && (
                <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 text-xs rounded bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {item.title}
                </span>
              )}
            </button>

            <AnimatePresence initial={false}>
              {openSections[item.title] && !collapsed && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div>
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        prefetch
                        className={`flex items-center w-full p-4 hover:bg-gray-200 hover:text-black transition-all ${pathname === subItem.href ? "bg-orange-300 text-white" : ""
                          }`}
                      >
                        {subItem.icon && <subItem.icon size={12} className="mr-2" />}
                        <FaRegCircle size={10} className="mr-2 ml-2" />
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Customize Modal */}
      <AnimatePresence>
        {isCustomizeOpen && (
          <SidebarModalCustomize
            visibleItems={visibleItems}
            filteredMenuItems={filteredMenuItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            toggleVisibility={toggleVisibility}
            onClose={() => setIsCustomizeOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default SidebarMenu;
