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
    const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [replyToEmail, setReplyToEmail] = useState<EmailData | null>(null);
    const [replyMessage, setReplyMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [emailsPerPage] = useState(5); // Adjust this value for number of emails per page

    const removeHtmlTagsAndSignature = (html: string) => {
        const cleanedText = html.replace(/<[^>]*>/g, "");
        const signaturePattern = /Your Name\s+Ecoshift Corporation \| Taskflow System/g;
        return cleanedText.replace(signaturePattern, "").trim();
    };

    // Group emails by sender if the tab is "sender"
    const groupBySender = (emails: EmailData[]) => {
        return emails.reduce((groups, email) => {
            const sender = email.sender;
            if (!groups[sender]) {
                groups[sender] = [];
            }
            groups[sender].push(email);
            return groups;
        }, {} as Record<string, EmailData[]>);
    };

    // Filter and group emails based on the active tab
    const filteredPosts = posts.filter((email) => {
        if (activeTab === "sender") {
            return email.sender === userDetails.Email; // Sent tab
        }
        return email.recepient === userDetails.Email; // Inbox tab
    });

    const groupedEmails = activeTab === "recipient" ? groupBySender(filteredPosts) : null;

    // Pagination Logic
    const indexOfLastEmail = currentPage * emailsPerPage;
    const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
    const currentEmails = filteredPosts.slice(indexOfFirstEmail, indexOfLastEmail);

    // Handle selecting or deselecting an email
    const handleCheckboxChange = (emailId: string) => {
        const updatedSelection = new Set(selectedEmails);
        if (updatedSelection.has(emailId)) {
            updatedSelection.delete(emailId);
        } else {
            updatedSelection.add(emailId);
        }
        setSelectedEmails(updatedSelection);
    };

    // Handle Select All checkbox
    const handleSelectAll = () => {
        if (selectedEmails.size === currentEmails.length) {
            setSelectedEmails(new Set());
        } else {
            const newSelection = new Set(currentEmails.map((email) => email.id));
            setSelectedEmails(newSelection);
        }
    };

    // Handle the batch update action (Archive or Remove)
    const handleBatchAction = (action: "Archive" | "Remove") => {
        const updatedPosts = posts.map((email) => {
            if (selectedEmails.has(email.id)) {
                return { ...email, status: action };
            }
            return email;
        });
        console.log("Updated posts:", updatedPosts);
        // Update the posts in the backend here
    };

    // Handle Reply action in Inbox
    const handleReply = (email: EmailData) => {
        setReplyToEmail(email);
        setReplyMessage("");  // Clear the previous reply message
        setShowReplyModal(true);  // Show the modal for replying
    };

    const handleSendReply = async () => {
        if (!replyToEmail) return; // Make sure there is an email to reply to

        // Create the new email reply
        const newEmail = {
            sender: userDetails.Email,
            recepient: replyToEmail.sender || "",  // Replying to the sender
            subject: `RE: ${replyToEmail.subject}`,
            message: replyMessage,
            date_created: new Date().toISOString(),
            referenceid: replyToEmail.referenceid || "",
            status: "Pending",
            id: crypto.randomUUID(), // Generate a unique ID for the reply
        };

        console.log("Sending reply:", newEmail);

        try {
            // Sending the new reply to the backend API
            const response = await fetch("/api/ModuleSales/Email/ComposeEmail/ReplyEmail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newEmail),
            });

            const data = await response.json();

            if (data.success) {
                console.log("Reply sent successfully:", data);
                setShowReplyModal(false); // Close the modal on success
            } else {
                console.error("Failed to send reply:", data.error);
            }
        } catch (error) {
            console.error("Error sending reply:", error);
        }
    };

    // Pagination Handler
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Pagination Component
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredPosts.length / emailsPerPage); i++) {
        pageNumbers.push(i);
    }

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
                {/* Batch Action */}
                <div className="mb-2">
                    <button
                        onClick={() => handleBatchAction("Archive")}
                        className="mr-2 px-3 py-1 bg-green-500 text-white rounded"
                    >
                        Archive
                    </button>
                    <button
                        onClick={() => handleBatchAction("Remove")}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                        Remove
                    </button>
                </div>
                <table className="min-w-full table-auto border-collapse text-xs">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2 text-left">
                                <input
                                    type="checkbox"
                                    checked={selectedEmails.size === currentEmails.length}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="px-4 py-2 text-left">Subject</th>
                            <th className="px-4 py-2 text-left">Message</th>
                            <th className="px-4 py-2 text-left">Date Created</th>
                            {(activeTab === "recipient" || activeTab === "sender") && (
                                <th className="px-4 py-2 text-left">Action</th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {currentEmails.map((email) => (
                            <tr key={email.id} className="border-b hover:bg-gray-100">
                                <td className="px-4 py-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedEmails.has(email.id)}
                                        onChange={() => handleCheckboxChange(email.id)}
                                    />
                                </td>
                                <td className="px-4 py-2 uppercase font-semibold">{email.subject}</td>
                                <td className="px-4 py-2 capitalize">{removeHtmlTagsAndSignature(email.message)}</td>
                                <td className="px-4 py-2">{format(parseISO(email.date_created), "MMM dd, yyyy - h:mm:ss a")}</td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => handleReply(email)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Reply
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="mt-4 flex justify-center">
                    <ul className="flex space-x-2">
                        {pageNumbers.map((number) => (
                            <li key={number}>
                                <button
                                    onClick={() => paginate(number)}
                                    className={`px-3 py-1 rounded ${currentPage === number ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                                >
                                    {number}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
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
                                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Send Reply
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
