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
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [replyToEmail, setReplyToEmail] = useState<EmailData | null>(null);
    const [replyMessage, setReplyMessage] = useState("");

    const removeHtmlTagsAndSignature = (html: string) => {
        const cleanedText = html.replace(/<[^>]*>/g, "");
        const signaturePattern = /Your Name\s+Ecoshift Corporation \| Taskflow System/g;
        return cleanedText.replace(signaturePattern, "").trim();
    };

    // Filter emails based on sender or recipient
    const filteredPosts = posts.filter((email) => {
        if (activeTab === "sender") {
            return email.sender === userDetails.Email; // Sent tab
        }
        return email.recepient === userDetails.Email; // Inbox tab
    });

    // Handle Reply action in Inbox
    const handleReply = (email: EmailData) => {
        setReplyToEmail(email);
        setReplyMessage("");
        setShowReplyModal(true);
    };

    const handleSendReply = () => {
        const newEmail = {
            sender: userDetails.Email,
            recepient: replyToEmail?.sender || "",
            subject: `RE: ${replyToEmail?.subject}`,
            message: replyMessage,
            date_created: new Date().toISOString(),
            referenceid: replyToEmail?.referenceid || "",
            status: "Pending",
            id: crypto.randomUUID(),
        };
        console.log("Sending reply:", newEmail);
        setShowReplyModal(false);
    };

    return (
        <div className="bg-white shadow-md rounded overflow-hidden flex text-xs">
            {/* Tabs */}
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
                            {(activeTab === "recipient" || activeTab === "sender") && (
                                <th className="px-4 py-2 text-left">Action</th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((email) => (
                                <tr key={email.id} className="border-b hover:bg-gray-100">
                                    <td className="px-4 py-2 uppercase font-semibold">{email.subject}</td>
                                    <td className="px-4 py-2 capitalize">{removeHtmlTagsAndSignature(email.message)}</td>
                                    <td className="px-4 py-2">{format(parseISO(email.date_created), "MMM dd, yyyy - h:mm:ss a")}</td>
                                    {activeTab === "recipient" ? (
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => handleReply(email)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Reply
                                            </button>
                                        </td>
                                    ) : (
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => handleEdit(email)} // Use handleEdit in the Sent tab
                                                className="text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-gray-500">
                                    No emails found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Reply Modal */}
            {showReplyModal && replyToEmail && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h2 className="text-sm font-bold mb-4">Reply to {replyToEmail.sender}</h2>
                        <div className="text-xs space-y-2">
                            <div>
                                <label>From:</label>
                                <input
                                    type="text"
                                    value={userDetails.Email}
                                    readOnly
                                    className="w-full border px-2 py-1 rounded text-xs"
                                />
                            </div>
                            <div>
                                <label>To:</label>
                                <input
                                    type="text"
                                    value={replyToEmail.sender}
                                    readOnly
                                    className="w-full border px-2 py-1 rounded text-xs"
                                />
                            </div>
                            <div>
                                <label>Subject:</label>
                                <input
                                    type="text"
                                    value={`RE: ${replyToEmail.subject}`}
                                    readOnly
                                    className="w-full border px-2 py-1 rounded text-xs"
                                />
                            </div>
                            <div>
                                <label>Message:</label>
                                <textarea
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    placeholder="Type your reply..."
                                    className="w-full border px-2 py-1 rounded text-xs min-h-[100px]"
                                />
                            </div>
                            <div className="text-right mt-3">
                                <button
                                    onClick={() => setShowReplyModal(false)}
                                    className="px-3 py-1 mr-2 text-xs bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSendReply}
                                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersCard;
