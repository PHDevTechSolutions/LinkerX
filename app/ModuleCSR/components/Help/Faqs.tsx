"use client";

import React, { useState } from "react";

type AccordionProps = {};

const CSRFaqs: React.FC<AccordionProps> = () => {
    const [isOpen, setIsOpen] = useState(Array(7).fill(false));

    const titles = [
        "Payment Options",
        "Refund Requirements (3-5 Days)",
        "Delivery Options",
        "Branches",
        "Warranty",
        "Accreditation Requirements",
        "Delivery Option",
        "Production Promotion"
    ];

    const contents = [
        [
            "Bank Deposit (BDO and Metrobank)", 
            "Gcash", 
            "Credit Card (Client Needs to Visit Head Office to Swipe the Card)"
        ],
        [
            "Sales Invoice", 
            "Delivery Receipt", 
            "Collection Receipt", 
            "Deposit Slip/Transaction Reference"
        ],
        [
            "Company Truck Delivery: Schedule for 3-5 Working Days. Free Delivery Within Metro Manila for Purchases of at least P5,000.00", 
            "Free Delivery Outside Metro Manila: Available for Bulacan, Rizal, Pampanga, Cavite, Laguna, Batangas for Purchases of a least P25,000,00",
            "Third-Party Couriers: You can book through Lalamove and Grab",
            "Third-Party Services: AP Cargo and Capex",
            "Customer Pickup: Available from our Pasig Warehouse"
        ],
        [
            "Mandaluyong: Address: Suite 405, J&L Building, 251 Epifanio de los Santos Ave, Mandaluyong Metro Manila", 
            "Cebu Branch: Address: Unit #1 RGY Bldg, J De Veyra St., NRA, Carreta, Cebu City", 
            "Davao Branch: Address: Saavedra Bldg, No.3 Pag-Asa Village, Davao City, Matina Aplaya",
            "CDO Branch: Address: Warehouse #29, Alwana Business Park, Cugman, Cagayan De Oro, 9000 Misamis Oriental"
        ],
        [
            "Standard 1 Year Warranty"
        ],
        [
            "Please submit the following documents, Along with this application",
            "Current SEC/DTI Registration with articles and by-laws",
            "Current Mayor's Permit",
            "Current BIR Registration (Form 2303)",
            "Latest Financial Statement 2021",
            "General Information Sheet",
            "2 Valid Government I.D of Owners with Picture (Colored)",
            "Credit Terms Agreement and Conditions",
            "Note: Applications with incomplete details and documents will not be approved"
        ],
        [
            "Free Delivery Outside Metro Manila: Available for Rizal is 10K",
            "For Bulacan, Cavite is 15K",
            "For Pampanga, Laguna is 25K",
        ],
        [""]
    ];

    const toggleCollapse = (index: number) => {
        setIsOpen(prev => prev.map((state, i) => (i === index ? !state : state)));
    };

    return (
        <div className="mb-4 p-4 bg-white shadow-md rounded-lg space-y-2">
            {titles.map((title, index) => (
                <div key={index} className="border rounded-lg p-2">
                    <button
                        type="button"
                        onClick={() => toggleCollapse(index)}
                        className="w-full text-left font-semibold py-2 text-xs"
                    >
                        {title}
                    </button>
                    <div className={`transition-all ${isOpen[index] ? "block" : "hidden"} p-2 border-t`}> 
                        <ul className="list-disc list-inside p-2 text-xs">
                            {contents[index].map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
       
    );
};

export default CSRFaqs;
