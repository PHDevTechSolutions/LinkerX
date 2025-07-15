"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PiEyeFill } from "react-icons/pi";

interface Card4Props {
  userId: string | null;
  role: string;
}

const Card4: React.FC<Card4Props> = ({ userId, role }) => {
  const [showForm, setShowForm] = useState(false);
  const [loadingLink, setLoadingLink] = useState<string | null>(null);
  const router = useRouter();

  const handleNavigate = (href: string) => {
    setLoadingLink(href);
    router.push(href);
  };

  const links = [
    {
      title: "WooCommerce Orders",
      href: `/ModuleGlobal/ERP/Website/Ecoshift/Orders${userId ? `?id=${encodeURIComponent(userId)}` : ""}`,
      description: "Manage all orders placed through the WooCommerce-based Ecoshift storefront.",
    }
  ];

  return (
    <>
      {/* Card Display */}
      <div className="p-4 rounded-lg shadow hover:shadow-lg transition duration-300">
        <img
          src="/images/logo/4.jpg"
          alt="WooCommerce"
          className="w-full h-32 object-cover rounded-md mb-3"
        />
        <h3 className="text-md font-semibold mb-1">WooCommerce</h3>
        <p className="text-sm text-gray-700 mb-4">
          A customizable eCommerce platform for building online stores on WordPress.
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
              <span className="font-medium text-gray-800">WooCommerce</span>
            </div>

            {/* Title */}
            <h2 className="text-lg font-bold mb-4">WooCommerce Module</h2>

            {/* Link */}
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

export default Card4;
