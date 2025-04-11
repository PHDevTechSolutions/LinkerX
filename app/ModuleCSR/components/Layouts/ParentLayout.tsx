"use client";

import React, { useState, ReactNode } from "react";
import Sidebar from "../Sidebar/Sidebar";  // Ensure the correct import path
import Navbar from "../Navbar/Navbar";    // Ensure the correct import path

interface ParentLayoutProps {
  children: ReactNode;
}

const ParentLayout: React.FC<ParentLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setDarkMode] = useState(
      typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
    );

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`flex style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }} ${isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(!isSidebarOpen)} isDarkMode={isDarkMode} />
      <div className={`flex-grow transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"} md:ml-64`}>
        <Navbar onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} onToggleTheme={() => setDarkMode(!isDarkMode)} isDarkMode={isDarkMode} />
        <main className="p-4 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ParentLayout;
