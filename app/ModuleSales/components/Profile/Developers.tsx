"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * Contributors:
 * - Maricris Mercado
 */

type Contributor = {
    label: string;
    value: string;
    roleTag: string;
};

const contributors: Contributor[] = [
    { label: "Team Leader", value: "Rivera, Mark Christopher", roleTag: "Leader" },
    { label: "Mern Stack, Fullstack Developer, Database Master", value: "Roluna, Liesther ( Leroux Y Xchire )", roleTag: "Fullstack" },
    { label: "React Developer, Mern Stack", value: "Nebril, Babyrose", roleTag: "Frontend" },
    { label: "Network Engineer", value: "Melgarejo, Anthony", roleTag: "Network" },
];

const roleColors: Record<string, string> = {
    Leader: "bg-blue-100 text-blue-800",
    Fullstack: "bg-green-100 text-green-800",
    Frontend: "bg-purple-100 text-purple-800",
    Network: "bg-yellow-100 text-yellow-800",
};

const versionLogs = [
    { version: "v1.0", date: "2025-05-30", change: "Initial contributor list created" },
    { version: "v1.1", date: "2025-05-30", change: "Enhanced UI with tags, animation, and log section" },
];

const Developer: React.FC = () => {
    const [formData] = useState<Record<string, string>>(
        contributors.reduce((acc, field) => ({ ...acc, [field.label]: field.value }), {})
    );

    return (
        <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 p-6 bg-white shadow-lg rounded-2xl text-gray-800 max-w-4xl mx-auto"
        >
            <h2 className="text-2xl font-bold text-center mb-4">Project Contributors</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contributors.map((field, index) => (
                    <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium">{field.label}</label>
                            <span className={`text-xs px-2 py-1 rounded-full ${roleColors[field.roleTag]}`}>
                                {field.roleTag}
                            </span>
                        </div>
                        <input
                            type="text"
                            className="w-full bg-gray-100 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData[field.label]}
                            readOnly
                        />
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Version History</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                    {versionLogs.map((log, i) => (
                        <li key={i} className="flex justify-between bg-gray-50 p-2 rounded-md">
                            <span className="font-medium">{log.version}</span>
                            <span>{log.change}</span>
                            <span className="text-xs text-gray-400">{log.date}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <p className="text-right text-xs text-gray-500 italic mt-4">
                Contributor: Maricris Mercado
            </p>
        </motion.form>
    );
};

export default Developer;