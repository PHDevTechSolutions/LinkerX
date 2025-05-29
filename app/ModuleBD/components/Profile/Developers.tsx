"use client";

import React, { useState } from "react";

type FormProps = {};

const Developer: React.FC<FormProps> = () => {
    const fields = [
        { label: "Team Leader", value: "Rivera, Mark Christopher" },
        { label: "Mern Stack, Fullstack Developer, Database Master", value: "Roluna, Liesther ( Leroux Y Xchire )" },
        { label: "React Developer, Mern Stack", value: "Nebril, Babyrose" },
        { label: "Network Engineer", value: "Melgarejo, Anthony" },
    ];

    const [formData, setFormData] = useState<Record<string, string>>(
        fields.reduce((acc, field) => ({ ...acc, [field.label]: field.value }), {})
    );
    
    const handleChange = (label: string, value: string) => {
        setFormData((prev) => ({ ...prev, [label]: value }));
    };

    return (
        <form className="space-y-4 p-4 bg-white shadow-md rounded-lg text-gray-900">
            <div className="grid grid-cols-2 gap-4">
            {fields.map((field, index) => (
                <div key={index} className="p-4">
                    <label className="block font-semibold mb-1 text-xs">{field.label}</label>
                    <input
                        type="text"
                        className="w-full border rounded-md p-2 text-xs"
                        value={formData[field.label]}
                        onChange={(e) => handleChange(field.label, e.target.value)}
                        readOnly
                    />
                </div>
            ))}
            </div>
        </form>
    );
};

export default Developer;