import React, { useState } from "react";
import { format, parseISO } from "date-fns";

interface EmailData {
    id: string;
    subject: string;
    message: string;
    date_created: string;
    referenceid: string;
    status: "Remove" | "Archive" | "Pending";
    recepient: string;
    sender: string;
}

interface UsersCardProps {
    posts: EmailData[];
    handleEdit: (post: EmailData) => void;
    userDetails: {
        Email: string;
    };
}

const UsersCard: React.FC<UsersCardProps> = ({ posts, handleEdit, userDetails }) => {
    const [activeTab, setActiveTab] = useState<"sender" | "recipient">("sender");

    const removeHtmlTagsAndSignature = (html: string) => {
        const cleanedText = html.replace(/<[^>]*>/g, "");
        const signaturePattern = /Your Name\s+Ecoshift Corporation \| Taskflow System/g;
        return cleanedText.replace(signaturePattern, "").trim();
    };

    // Filter emails based on sender or recipient
    const filteredPosts = posts.filter((email) => {
        if (activeTab === "sender") {
            return email.sender === userDetails.Email; // Use actual user email from userDetails
        }
        return email.recepient === userDetails.Email; // Use actual user email from userDetails
    });

    return (
        <div className="bg-white shadow-md rounded overflow-hidden flex text-xs">
            {/* Tab Navigation on the left side */}
            <div className="flex flex-col w-1/8 mt-4">
                <button
                    className={`px-4 py-2 text-left ${activeTab === "recipient" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                    onClick={() => setActiveTab("recipient")}
                >
                    Inbox
                </button>
                <button
                    className={`px-4 py-2 text-left ${activeTab === "sender" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                    onClick={() => setActiveTab("sender")}
                >
                    Sent
                </button>
            </div>

            {/* Email Table */}
            <div className="flex-1 p-4 overflow-auto">
                <table className="min-w-full table-auto border-collapse text-xs">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2 text-left">Subject</th>
                            <th className="px-4 py-2 text-left">Message</th>
                            <th className="px-4 py-2 text-left">Date Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((email) => (
                                <tr
                                    key={email.id}
                                    className="border-b cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleEdit(email)}
                                >
                                    <td className="px-4 py-2 uppercase font-semibold">{email.subject}</td>
                                    <td className="px-4 py-2 capitalize">
                                        {removeHtmlTagsAndSignature(email.message)}
                                    </td>
                                    <td className="px-4 py-2">
                                        {format(parseISO(email.date_created), "MMM dd, yyyy - h:mm:ss a")}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-gray-500">
                                    No emails found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersCard;
