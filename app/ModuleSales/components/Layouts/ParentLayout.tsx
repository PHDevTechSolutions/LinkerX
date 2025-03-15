"use client";

import React, { useState, ReactNode, useEffect } from "react";
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

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className={`flex font-sans ${isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} isDarkMode={isDarkMode} />
      <div className={`flex-grow transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"} md:ml-64`}>
        <Navbar onToggleSidebar={toggleSidebar} onToggleTheme={toggleTheme} isDarkMode={isDarkMode}  />
        <main className="p-4 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ParentLayout;
