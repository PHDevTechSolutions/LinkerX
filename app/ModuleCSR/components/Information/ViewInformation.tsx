"use client";

import React from "react";

const TaskFlow = () => {
    return (
        <div className="max-w-full mx-auto p-6 bg-white shadow-lg rounded-lg text-gray-900">
            {/* Large Image at the Top */}
            <div className="w-full flex justify-center mb-6">
                <img
                    src="/Ecodesk-Full.png"
                    alt="Ecodesk Banner"
                    className="w-full max-w-2xl h-auto rounded-lg md:max-w-xl sm:max-w-md"
                />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-center mb-4">Customer Ticketing System</h1>

            {/* Description */}
            <p className="text-gray-700 text-sm mb-4">
                EcoDesk is a cutting-edge Customer Ticketing Software developed to revolutionize customer support operations and ticket management within the organization. Designed to replace outdated, manual ticketing methods, EcoDesk enhances efficiency by automating ticket creation, tracking, and resolution—all within a seamless and user-friendly platform.

                This powerful system was built to support real-time customer service interactions, ensuring that support teams can handle inquiries faster and more effectively, ultimately improving customer satisfaction and operational workflow.
            </p>

            {/* Development and Technology */}
            <h2 className="text-lg font-semibold mt-6">Development and Technology</h2>
            <p className="text-gray-700 text-sm mb-4">
                EcoDesk was developed by <strong>Leroux Y. Xchire</strong>, utilizing a combination of React.js, Next.js, and Vue.js three of the most powerful web development frameworks. These technologies ensure:
            </p>
            <ul className="list-inside text-gray-700 text-sm">
                <li>✔ High-speed performance for handling large volumes of support tickets.</li>
                <li>✔ Scalability, allowing multiple users to interact with the system simultaneously.</li>
                <li>✔ Smooth and interactive UI, providing an efficient and hassle-free experience.</li>
            </ul>

            <p className="text-gray-700 text-sm mt-4 mb-4">
                The user interface and color scheme were meticulously designed by <strong>Baby Rose Nebril</strong>, ensuring an aesthetically pleasing and intuitive user experience. She also assisted <strong>Leroux Y. Xchire</strong> in implementing additional functionalities to refine the system.
                For deployment and security, <strong>Anthony Melgarejo</strong> took charge of configuring the network infrastructure and securing the system against cyber threats, data breaches, and unauthorized access. His expertise ensured that EcoDesk remains protected and performs efficiently under high loads.
                As a key component of the Enterprise Resource Planning (ERP) strategy, <strong>MC Rivera</strong> managed the successful integration and overall execution of EcoDesk, ensuring that it aligns seamlessly with other business systems like TaskFlow for a fully connected ecosystem.
            </p>


            {/* Key Features */}
            <h2 className="text-lg font-semibold mt-6">Key Features of EcoDesk</h2>

            <p className="text-gray-700 text-sm mt-4 font-semibold">Automated Ticketing System</p>
            <ul className="list-disc list-inside text-gray-700 text-sm">
                <li>Automatically generates support tickets and assigns them to the appropriate department.</li>
                <li>Categorizes tickets based on urgency and issue type.</li>
                <li>Ensures faster response times and improved workflow efficiency.</li>
            </ul>

            <p className="text-gray-700 text-sm mt-4 font-semibold">Interactive Dashboard with Charts</p>
            <ul className="list-disc list-inside text-gray-700 text-sm">
                <li>Provides real-time analytics on support tickets.</li>
                <li>Displays graphs and reports to track trends, ticket volume, response times, and resolutions.</li>
                <li>Helps businesses identify recurring customer issues and improve service quality.</li>
            </ul>

            <p className="text-gray-700 text-sm mt-4 font-semibold">Integration with TaskFlow</p>
            <ul className="list-disc list-inside text-gray-700 text-sm">
                <li>Seamlessly links EcoDesk tickets with TaskFlow, allowing businesses to track related tasks efficiently.</li>
                <li>Enables better collaboration between the customer support and sales teams.</li>
                <li>Supports automated task assignment, improving productivity and organization.</li>
            </ul>

            <p className="text-gray-700 text-sm mt-4 font-semibold">Automated Notifications and Alerts</p>
            <ul className="list-disc list-inside text-gray-700 text-sm">
                <li>Sends instant notifications about ticket updates, status changes, and urgent cases.</li>
                <li>Alerts both customers and support agents when actions are required.</li>
                <li>Reduces delays and ensures tickets are resolved on time.</li>
            </ul>

            <p className="text-gray-700 text-sm mt-4 font-semibold">Dark Mode System</p>
            <ul className="list-disc list-inside text-gray-700 text-sm">
                <li>Offers a visually comfortable interface for users working long hours.</li>
                <li>Reduces eye strain and provides a modern, sleek design option.</li>
                <li>Allows users to switch between light mode and dark mode for a personalized experience.</li>
            </ul>

            <h2 className="text-lg font-semibold mt-6">EcoDesk as Part of the ERP Strategy</h2>
            <p className="text-gray-700 text-sm mt-4 mb-4">
                EcoDesk is a fundamental piece of the company’s Enterprise Resource Planning (ERP) initiative. By integrating with TaskFlow, it bridges the gap between customer support and internal business processes, ensuring a fully connected and automated workflow.
            </p>


            {/* Copyright */}
            <h2 className="text-lg font-semibold mt-6">Copyright and Intellectual Property Protection</h2>
            <p className="text-gray-700 text-sm mb-4">
            EcoDesk is an exclusive proprietary system developed under EcoShift, and its replication, modification, or distribution by unauthorized individuals is strictly prohibited. Only members of the IT Department are authorized to manage, modify, or implement changes to the system.
                Any attempt to replicate, copy, or use Ecodesk without permission will be considered a violation of Copyright Infringement laws, leading to legal consequences. The software is protected under intellectual property rights, ensuring that its technology, framework, and operational methodologies remain exclusive to EcoShift and its authorized personnel.
            </p>

            {/* Conclusion */}
            <p className="text-gray-700 text-sm">
                EcoDesk is an essential tool for modern customer support, eliminating inefficiencies and introducing automation to streamline ticket handling. Through its smart integrations, intuitive features, and robust security, EcoDesk provides businesses with:
            </p>
            <ul className="list-inside text-gray-700 text-sm">
                <li>✔ Faster ticket resolutions.</li>
                <li>✔ Improved customer satisfaction.</li>
                <li>✔ Better workflow automation.</li>
                <li>✔ Seamless system integration</li>
            </ul>
            
            <h2 className="text-lg font-semibold mt-6">Development Team Behind EcoDesk</h2>
            <ul className="list-disc list-inside text-gray-700 text-sm">
                <li>Lead Developer (React.js, Next.js, Vue.js, Nodejs, MongoDB) - Leroux Y Xchire</li>
                <li>UI/UX Designer, Assistant Developer - Baby Rose Nebril</li>
                <li>Network Security & Deployment - Anthony Melgarejo</li>
                <li>Project Manager (ERP & Integration) - Mark (MC) Rivera</li>
            </ul>
        </div>
    );
};

export default TaskFlow;