"use client";

import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

type FooterProps = {
  userRole?: string;
  systemStatus?: "operational" | "down";
};

const Footer: React.FC<FooterProps> = ({ userRole = "Sales Associate", systemStatus = "operational" }) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 z-50 p-3 bg-green-700 hover:bg-green-800 text-white rounded-full shadow-lg transition duration-300"
          aria-label="Back to top"
        >
          <FaArrowUp />
        </button>
      )}

      <footer className="bg-green-600 text-white py-4 w-full relative">
        <div className="container mx-auto text-center text-xs px-4">
          <p className="font-bold">
            &copy; {new Date().getFullYear()} Ecoshift Corporation | ERP Module - XentrixFlow
            <span className="bg-orange-700 ml-2 px-2 py-1 rounded-md text-[10px]">Version 3.2</span>
          </p>

          <div className="mt-2 text-[10px] italic flex justify-center items-center gap-2">
            <span className="flex items-center gap-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  systemStatus === "operational" ? "bg-green-400 animate-pulse" : "bg-red-500"
                }`}
              ></span>
              {systemStatus === "operational" ? "System Operational" : "System Down"}
            </span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
