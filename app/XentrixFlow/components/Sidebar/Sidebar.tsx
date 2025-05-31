import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// Route for Sidebar Menu
import { getSidebarMenu } from "../../components/Sidebar/SidebarMenu";
// Route for Menu Layout
import SidebarMenu from "../../components/Sidebar/SidebarMenuLayout";
// Route for Profile Information
import SidebarUserInfo from "../../components/Sidebar/SidebarUserInfo"; // Menu Information

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void; isDarkMode: boolean }> = ({
  isOpen,
  onClose,
  isDarkMode,
  
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [agentMode, setAgentMode] = useState(false);
  const [userDetails, setUserDetails] = useState({
    Firstname: "",
    Lastname: "",
    Location: "",
    Role: "",
    Company: "",
    Status: "",
    ReferenceID: "",
    Department: "",
  });
  const router = useRouter();

  const selectedAvatar =
    typeof window !== "undefined"
      ? localStorage.getItem("selectedAvatar") || `https://robohash.org/${userDetails.Firstname}${userDetails.Lastname}?size=200x200`
      : "";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUserId(params.get("id"));
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/FetchUser/user?id=${encodeURIComponent(userId)}`);
        if (!response.ok) throw new Error("Failed to fetch user details");

        const data = await response.json();
        setUserDetails({
          Firstname: data.Firstname || "Leroux",
          Lastname: data.Lastname || "Xchire",
          Location: data.Location || "Philippines",
          Role: data.Role || "Admin",
          Company: data.Company || "Ecoshift Corporation",
          Status: data.Status || "None",
          ReferenceID: data.ReferenceID,
          Department: data.Department || "",
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const filteredMenuItems = getSidebarMenu(userId, userDetails.Role, agentMode);

  // Decide logo based on department
  const logoSrc = userDetails.Department === "CSR" ? "/ecodesk.png" : "/taskflow.png";

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>}
      <div
        className={`fixed inset-y-0 left-0 z-50 h-screen transition-all duration-300 flex flex-col
          ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"} 
          ${collapsed ? "w-16" : "w-64"} 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Top part with logo */}
        <div className="flex items-center justify-between p-5 flex-shrink-0">
          <div className="flex items-center">
            <img src={logoSrc} alt="Logo" className="h-8 mr-2" />
            <Link href={`/ModuleSales/Sales/Dashboard${userId ? `?id=${encodeURIComponent(userId)}` : ""}`}>
              <h1 className={`text-md font-bold transition-opacity ${collapsed ? "opacity-0" : "opacity-100"}`}>
                <span>TASK - </span>
                <span className="inline-block transform scale-x-[-1]">FLOW</span>
              </h1>
            </Link>
          </div>
        </div>

        {/* Menu + scrollable area */}
        <SidebarMenu userId={userId} filteredMenuItems={filteredMenuItems} collapsed={collapsed} />

        {/* Fixed bottom user info */}
        <SidebarUserInfo userDetails={userDetails} selectedAvatar={selectedAvatar} collapsed={collapsed} isDarkMode={isDarkMode} />
      </div>
    </>
  );
};

export default Sidebar;
