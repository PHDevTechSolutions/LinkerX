import React, { useState, useEffect, ReactNode } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    setUserId(id);
  }, []);

  return (
    <div className={`flex style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" ${isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(!isSidebarOpen)} isDarkMode={isDarkMode} />
      <div className={`flex-grow transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"} md:ml-64`}>
        <Navbar onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} onToggleTheme={() => setDarkMode(!isDarkMode)} isDarkMode={isDarkMode} />
        <main className="p-4 min-h-screen">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default ParentLayout;
