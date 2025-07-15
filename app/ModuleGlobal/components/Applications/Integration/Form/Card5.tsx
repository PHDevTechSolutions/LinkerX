"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PiEyeFill } from "react-icons/pi";

interface Card5Props {
  userId: string | null;
  role: string;
}

const Card5: React.FC<Card5Props> = ({ userId, role }) => {
  const [showForm, setShowForm] = useState(false);
  const [loadingLink, setLoadingLink] = useState<string | null>(null);
  const router = useRouter();

  const handleNavigate = (href: string) => {
    setLoadingLink(href);
    router.push(href);
  };

  const links = [
    {
      title: "Shopify Orders",
      href: `/ModuleGlobal/ERP/Website/Shopify/Orders${userId ? `?id=${encodeURIComponent(userId)}` : ""}`,
      description: "View and manage all customer orders placed through the Shopify storefront.",
    },
    {
      title: "Shopify Products",
      href: `/ModuleGlobal/ERP/Website/Shopify/Products${userId ? `?id=${encodeURIComponent(userId)}` : ""}`,
      description: "Browse and edit product listings synced with the Shopify backend.",
    }
  ];

  return (
    <>
      {/* Card Display */}
      <div className="p-4 rounded-lg shadow hover:shadow-lg transition duration-300">
        <img
          src="/images/logo/5.jpg"
          alt="Shopify"
          className="w-full h-32 object-cover rounded-md mb-3"
        />
        <h3 className="text-md font-semibold mb-1">Shopify</h3>
        <p className="text-sm text-gray-700 mb-4">
          A leading platform for creating, managing, and scaling your online business.
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-3 rounded flex gap-1"
        >
          <PiEyeFill size={15} /> View
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-md md:max-w-2xl p-6 rounded-lg shadow-xl relative">
            {/* Close Button */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-sm"
            >
              ✕
            </button>

            {/* Breadcrumb */}
            <div className="text-sm text-gray-600 mb-4">
              <span className="cursor-pointer text-blue-600 hover:underline" onClick={() => setShowForm(false)}>Applications</span> &gt;
              <span className="font-medium text-gray-800">Shopify</span>
            </div>

            {/* Title */}
            <h2 className="text-lg font-bold mb-4">Shopify Modules</h2>

            {/* Links List */}
            <ul className="space-y-2">
              {links.map((link, index) => (
                <li key={index} className="border p-4 rounded text-xs">
                  <button
                    onClick={() => handleNavigate(link.href)}
                    className="text-blue-600 hover:underline font-medium"
                    disabled={loadingLink === link.href}
                  >
                    {loadingLink === link.href ? "Loading..." : link.title}
                  </button>
                  <p className="text-gray-600 mt-1">{link.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Card5;
