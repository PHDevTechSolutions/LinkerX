"use client";

import React, { useState } from "react";

const CSRFaqs: React.FC = () => {
    const [isOpen, setIsOpen] = useState(Array(8).fill(false));

    const faqData = [
        {
            title: "Payment Options",
            content: [
                "Bank Deposit (BDO and Metrobank)",
                "Gcash",
                "Credit Card (Client Needs to Visit Head Office to Swipe the Card)"
            ]
        },
        {
            title: "Refund Requirements (3-5 Days)",
            content: [
                "Sales Invoice",
                "Delivery Receipt",
                "Collection Receipt",
                "Deposit Slip/Transaction Reference"
            ]
        },
        {
            title: "Delivery Options",
            content: [
                "Company Truck Delivery: 3-5 working days. Free within Metro Manila for purchases of at least P5,000.00.",
                "Free Delivery Outside Metro Manila: Available in Bulacan, Rizal, Pampanga, Cavite, Laguna, and Batangas for purchases of at least P25,000.00.",
                "Third-Party Couriers: Available via Lalamove and Grab.",
                "Third-Party Services: AP Cargo and Capex.",
                "Customer Pickup: Available from our Pasig Warehouse."
            ]
        },
        {
            title: "Branches",
            content: [
                "Mandaluyong: Suite 405, J&L Building, 251 Epifanio de los Santos Ave, Mandaluyong Metro Manila.",
                "Cebu Branch: Unit #1 RGY Bldg, J De Veyra St., NRA, Carreta, Cebu City.",
                "Davao Branch: Saavedra Bldg, No.3 Pag-Asa Village, Davao City, Matina Aplaya.",
                "CDO Branch: Warehouse #29, Alwana Business Park, Cugman, Cagayan De Oro, 9000 Misamis Oriental."
            ]
        },
        {
            title: "Warranty",
            content: ["Standard 1-Year Warranty"]
        },
        {
            title: "Accreditation Requirements",
            content: [
                "Submit the following documents along with the application:",
                "Current SEC/DTI Registration with articles and by-laws.",
                "Current Mayor's Permit.",
                "Current BIR Registration (Form 2303).",
                "Latest Financial Statement 2021.",
                "General Information Sheet.",
                "2 Valid Government IDs of owners with pictures (colored).",
                "Credit Terms Agreement and Conditions.",
                "**Note:** Applications with incomplete details and documents will not be approved."
            ]
        },
        {
            title: "Additional Delivery Options",
            content: [
                "Free Delivery Outside Metro Manila:",
                "For Rizal: Minimum purchase of P10,000.",
                "For Bulacan, Cavite: Minimum purchase of P15,000.",
                "For Pampanga, Laguna: Minimum purchase of P25,000."
            ]
        },
        {
            title: "Production Promotion",
            content: []
        }
    ];

    const toggleCollapse = (index: number) => {
        setIsOpen(prev => prev.map((state, i) => (i === index ? !state : state)));
    };

    return (
        <div className="mb-4 p-4 bg-white shadow-md rounded-lg space-y-2 text-gray-900">
            {faqData.map((faq, index) => (
                <div key={index} className="border rounded-lg p-2">
                    <button
                        type="button"
                        onClick={() => toggleCollapse(index)}
                        className="w-full text-left font-semibold py-2 text-xs"
                    >
                        {faq.title}
                    </button>
                    {isOpen[index] && (
                        <div className="p-2 border-t">
                            <ul className="list-disc list-inside p-2 text-xs">
                                {faq.content.length > 0 ? faq.content.map((item, i) => (
                                    <li key={i}>{item}</li>
                                )) : <p className="text-gray-500 text-xs">No details available.</p>}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CSRFaqs;
