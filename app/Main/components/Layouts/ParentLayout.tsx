import React, { useState, useEffect, ReactNode } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { FcLink } from "react-icons/fc"; // logo icon like in sidebar

interface ParentLayoutProps {
  children: ReactNode;
}

const ParentLayout: React.FC<ParentLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    setUserId(id);
  }, []);

  return (
    <div
      className="flex flex-col h-screen bg-gray-100"
      style={{ fontFamily: "'Arial', cursive, sans-serif" }}
    >
      {/* Top Header */}
      <header className="w-full bg-white shadow-md p-4 flex items-center justify-between border-b border-gray-300">
        <img
          src="/LinkerX.png"
          alt="LinkerX Logo"
          className="h-14 object-contain"
        />
      </header>


      {/* Content with Sidebar and Main */}
      <div className="flex flex-grow bg-gray-100">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(!isSidebarOpen)}
        />
        <div
          className={`flex-grow transition-all duration-300 ${isSidebarOpen ? "ml-0" : "ml-0"} md:ml-0`}
        >
          <main
            className="min-h-screen"
            style={{ padding: "30px" }}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ParentLayout;
