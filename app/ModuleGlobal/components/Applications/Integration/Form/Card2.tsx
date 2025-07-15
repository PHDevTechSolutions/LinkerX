"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PiEyeFill } from "react-icons/pi";

interface Card2Props {
    userId: string | null;
    role: string;
}

const Card2: React.FC<Card2Props> = ({ userId, role }) => {
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
            href: `/ModuleGlobal/ERP/Ecodesk/CustomerDatabase${userId ? `?id=${encodeURIComponent(userId)}` : ""}`,
            description: "Stores all client profiles, contact details, and records relevant to support handling."
        },
        {
            title: "Ticket Logs",
            href: `/ModuleGlobal/ERP/Ecodesk/Ticket${userId ? `?id=${encodeURIComponent(userId)}` : ""}`,
            description: "Logs all submitted support tickets, including statuses, resolutions, and timestamps."
        },
        {
            title: "Received PO",
            href: `/ModuleGlobal/ERP/Ecodesk/PO${userId ? `?id=${encodeURIComponent(userId)}` : ""}`,
            description: "Tracks all purchase orders received from clients, their status, and attachments."
        },
        {
            title: "SKU Listing",
            href: `/ModuleGlobal/ERP/Ecodesk/SKU${userId ? `?id=${encodeURIComponent(userId)}` : ""}`,
            description: "Maintains a catalog of stock keeping units for reference and ticket tagging."
        },
        {
            title: "D-Tracking Logs",
            href: `/ModuleGlobal/ERP/Ecodesk/Tracking${userId ? `?id=${encodeURIComponent(userId)}` : ""}`,
            description: "Monitors delivery tracking numbers and updates for outbound logistics."
        },
        {
            title: "Outbound Calls",
            href: `/ModuleGlobal/ERP/Ecodesk/OutboundCall${userId ? `?id=${encodeURIComponent(userId)}` : ""}`,
            description: "Logs all follow-up and support outbound call activities and results."
        },
        {
            title: "CSR Agents",
            href: `/ModuleGlobal/ERP/Ecodesk/CSRAgent${userId ? `?id=${encodeURIComponent(userId)}` : ""}`,
            description: "Allows management of CSR agents, assignments, and credentials."
        },
        ...(role === "Super Admin"
            ? [{
                title: "CSR Admins",
                href: `/ModuleGlobal/ERP/Ecodesk/CSRAdmin${userId ? `?id=${encodeURIComponent(userId)}` : ""}`,
                description: "Manage CSR Admin accounts and their access to Ecodesk modules."
            }]
            : [])
    ];

    return (
        <>
            {/* Card Display */}
            <div className="p-4 rounded-lg shadow hover:shadow-lg transition duration-300">
                <img
                    src="/images/logo/2.jpg"
                    alt="Ecodesk"
                    className="w-full h-32 object-cover rounded-md mb-3"
                />
                <h3 className="text-md font-semibold mb-1">Ecodesk</h3>
                <p className="text-sm text-gray-700 mb-4">
                    A helpdesk system to manage and resolve customer concerns through organized ticketing.
                </p>

                <button
                    onClick={() => setShowForm(true)}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-3 rounded flex gap-1"
                >
                    <PiEyeFill size={15} /> View
                </button>
            </div>

            {/* Modal Overlay */}
            {showForm && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white w-full max-w-md md:max-w-2xl p-6 rounded-lg shadow-xl relative overflow-y-auto max-h-[90vh]">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowForm(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-sm"
                        >
                            ✕
                        </button>

                        {/* Breadcrumb */}
                        <div className="text-sm text-gray-600 mb-4">
                            <Link href="/Orders">Applications</Link> &gt; <span className="font-medium text-gray-800">Ecodesk</span>
                        </div>

                        {/* Title */}
                        <h2 className="text-lg font-bold mb-4">Ecodesk Modules</h2>

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

export default Card2;
