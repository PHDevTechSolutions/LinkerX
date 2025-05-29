"use client";

import React from "react";

const TaskFlow = () => {
    return (
        <div className="max-w-full mx-auto p-6 bg-white shadow-lg rounded-lg text-gray-900">
            {/* Large Image at the Top */}
            <div className="w-full flex justify-center mb-6">
                <img
                    src="/taskflow-full.png"
                    alt="TaskFlow Banner"
                    className="w-full max-w-2xl h-auto rounded-lg md:max-w-xl sm:max-w-md"
                />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-center mb-4">Time and Motion System</h1>

            {/* Description */}
            <p className="text-gray-700 text-sm mb-4">
                TaskFlow is an advanced Time and Motion System proposed by <strong>Leroux Y. Xchire</strong> and the entire IT Department to enhance the efficiency of the Sales Department. This innovative solution was designed to streamline various tasks such as activity tracking, time logging, and workflow automation a significant upgrade from the traditional method of using Excel sheets, which was later converted into a full-fledged software application.
            </p>

            {/* Development and Technology */}
            <h2 className="text-lg font-semibold mt-6">Development and Technology</h2>
            <p className="text-gray-700 text-sm mb-4">
                The TaskFlow software was meticulously developed by <strong>Leroux Y. Xchire</strong> using modern web technologies, including React.js and Next.js. Notably, Next.js is a powerful framework originally built within the Facebook ecosystem, making it highly capable of handling a large volume of users while ensuring speed and efficiency.
                The system's visual identity and user experience were carefully crafted by <strong>Baby Rose Nebril</strong>, who played a crucial role in designing the color palette and overall interface, ensuring an intuitive and aesthetically pleasing experience for users.
                For network configuration, security protocols, and platform deployment, <strong>Anthony Melgarejo</strong> provided expertise in setting up a robust infrastructure to protect the system from potential threats and ensure smooth operation. Meanwhile, <strong>MC Rivera</strong> took charge of project management, overseeing the entire development lifecycle and ensuring successful implementation across departments.
            </p>

            <h2 className="text-lg font-semibold mt-6">TaskFlow as Part of ERP Strategy</h2>
            <p className="text-gray-700 text-sm mb-4">
                TaskFlow is not just a standalone system; it plays a vital role in the broader Enterprise Resource Planning (ERP) strategy. Through seamless integration with EcoDesk, TaskFlow extends its functionality to support a more interconnected and automated enterprise system.
            </p>

            {/* Key Features */}
            <h2 className="text-lg font-semibold mt-6">Key Features</h2>
            <ul className="list-inside text-gray-700 text-sm">
                <li>✔ Automated Task Management – Enables users to create, assign, and track tasks with ease.</li>
                <li>✔ Time Tracking & Timers – Logs working hours, providing accurate time records for activities.</li>
                <li>✔ Smart Notes & Pins – Allows users to pin important information and notes for quick access.</li>
                <li>✔ Integrated Calendar & Scheduling – Helps manage deadlines and plan tasks efficiently.</li>
                <li>✔ Automated Notifications & Reminders – Sends alerts to ensure tasks and deadlines are met.</li>
                <li>✔ Agent Tracking – Monitors field agents in real time, improving accountability and reporting.</li>
                <li>✔ Quotation Management – Facilitates the creation of sales quotations, streamlining the sales process.</li>
                <li>✔ EcoDesk Integration – Seamlessly connects with the EcoDesk Customer Ticketing System, allowing unified operations across platforms.</li>
            </ul>

            {/* Copyright */}
            <h2 className="text-lg font-semibold mt-6">Copyright and Intellectual Property Protection</h2>
            <p className="text-gray-700 text-sm mb-4">
                TaskFlow is an exclusive proprietary system developed under EcoShift, and its replication, modification, or distribution by unauthorized individuals is strictly prohibited. Only members of the IT Department are authorized to manage, modify, or implement changes to the system.

                Any attempt to replicate, copy, or use TaskFlow without permission will be considered a violation of Copyright Infringement laws, leading to legal consequences. The software is protected under intellectual property rights, ensuring that its technology, framework, and operational methodologies remain exclusive to EcoShift and its authorized personnel.
            </p>

            {/* Conclusion */}
            <p className="text-gray-700 text-sm">
                TaskFlow is a groundbreaking system that empowers the Sales Department by automating repetitive processes, optimizing workflow management, and improving time efficiency. Through its cutting-edge technology, thoughtful design, and strong security measures, TaskFlow serves as a critical component of the organization's ERP strategy, ensuring seamless collaboration and enhanced productivity across teams.
                With its innovative automation capabilities, TaskFlow redefines time management and task efficiency, helping businesses operate with greater speed, accuracy, and scalability—while maintaining the highest level of security and exclusivity. 🚀
            </p>
        </div>
    );
};

export default TaskFlow;