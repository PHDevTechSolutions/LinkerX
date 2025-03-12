"use client";

import React, { useState, ReactNode } from "react";
import Sidebar from "../Sidebar/Sidebar";  // Ensure the correct import path
import Navbar from "../Navbar/Navbar";    // Ensure the correct import path

interface ParentLayoutProps {
  children: ReactNode;
}

const ParentLayout: React.FC<ParentLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <div className={`flex-grow transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"} md:ml-64`}>
        <Navbar onToggleSidebar={toggleSidebar} />
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ParentLayout;
