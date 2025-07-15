"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PiEyeFill } from "react-icons/pi";

interface Card1Props {
    userId: string | null;
    role: string;
}

const Card1: React.FC<Card1Props> = ({ userId, role }) => {
    const [showForm, setShowForm] = useState(false);
    const [loadingLink, setLoadingLink] = useState<string | null>(null);
    const router = useRouter();

    const handleNavigate = (href: string) => {
        setLoadingLink(href);
        router.push(href);
    };

    const links = [
        {
            title: "Customer Database",
            href: `/ModuleGlobal/ERP/Taskflow/CustomerDatabase?id=${userId}`,
            description: "Contains all customer-related data including accounts, info, contacts, and records."
        },
        {
            title: "Activity Logs",
            href: `/ModuleGlobal/ERP/Taskflow/ActivityLogs?id=${userId}`,
            description: "Tracks all actions and user activities within the system."
        },
        {
            title: "Progress Logs",
            href: `/ModuleGlobal/ERP/Taskflow/ProgressLogs?id=${userId}`,
            description: "Monitors project progress, task status, and workflow development."
        },
        {
            title: "CSR Inquiries",
            href: `/ModuleGlobal/ERP/Taskflow/CSRInquiries?id=${userId}`,
            description: "Handles customer service inquiries, messages, and concerns."
        },
        {
            title: "Territory Sales Associates",
            href: `/ModuleGlobal/ERP/Taskflow/TSA?id=${userId}`,
            description: "Module to manage and create TSA accounts for field agents."
        },
        {
            title: "Territory Sales Manager",
            href: `/ModuleGlobal/ERP/Taskflow/TSM?id=${userId}`,
            description: "Module to create and assign managers who oversee TSAs."
        },
        ...(role === "Super Admin"
            ? [{
                title: "Manager",
                href: `/ModuleGlobal/ERP/Taskflow/Manager?id=${userId}`,
                description: "Accessible only to Super Admin. Manage and assign managerial accounts."
            }]
            : [])
    ];

    return (
        <>
            {/* Card Display */}
            <div className="p-4 rounded-lg shadow hover:shadow-lg transition duration-300">
                <img
                    src="/images/logo/1.jpg"
                    alt="Taskflow"
                    className="w-full h-32 object-cover rounded-md mb-3"
                />
                <h3 className="text-md font-semibold mb-1">Taskflow</h3>
                <p className="text-sm text-gray-700 mb-4">
                    A system designed to monitor and streamline your team’s sales activities and workflows.
                </p>

                <button
                    onClick={() => setShowForm(true)}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-3 rounded flex gap-1"
                >
                   <PiEyeFill size={15}/> View
                </button>
            </div>

            {/* Modal Overlay */}
            {showForm && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white w-full max-w-md md:max-w-2xl p-6 rounded-lg shadow-xl relative max-h-[90vh] overflow-y-auto">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowForm(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-sm"
                        >
                            ✕
                        </button>

                        {/* Breadcrumb */}
                        <div className="text-sm text-gray-600 mb-4">
                            <span className="cursor-pointer text-blue-600 hover:underline" onClick={() => setShowForm(false)}>Applications</span> &gt; <span className="font-medium text-gray-800">Taskflow</span>
                        </div>

                        {/* Title */}
                        <h2 className="text-lg font-bold mb-4">Taskflow Modules</h2>

                        {/* Table of Contents */}
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

export default Card1;
