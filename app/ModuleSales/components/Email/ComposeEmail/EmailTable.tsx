import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { CiInboxIn, CiPaperplane, CiTrash } from "react-icons/ci";
import { FaPlus, FaMinus } from "react-icons/fa";
import { GoInbox } from "react-icons/go";

interface EmailData {
    id: string;
    subject: string;
    message: string;
    date_created: string;
    referenceid: string;
    status: "Pending";
    recepient: string;
    sender: string;
}

interface UsersCardProps {
    posts: EmailData[];
    handleEdit: (post: EmailData) => void;
    userDetails: {
        Email: string;
    };
    fetchAccount: () => Promise<void>;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts, handleEdit, userDetails, fetchAccount }) => {
    const [activeTab, setActiveTab] = useState<"sender" | "recipient">("sender");
    const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [replyToEmail, setReplyToEmail] = useState<EmailData | null>(null);
    const [replyMessage, setReplyMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [emailsPerPage] = useState(50);
    const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
    const [isLoadingAction, setIsLoadingAction] = useState<"Archive" | "Remove" | null>(null);

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
            return email.sender === userDetails.Email;
        }
        if (activeTab === "recipient") {
            return email.recepient === userDetails.Email;
        }
        return true;
    });

    const groupedEmails = activeTab === "recipient" ? groupBySender(filteredPosts) : null;

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

    const handleSelectAll = () => {
        if (selectedEmails.size === currentEmails.length) {
            setSelectedEmails(new Set());
        } else {
            const newSelection = new Set(currentEmails.map((email) => email.id));
            setSelectedEmails(newSelection);
        }
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


    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Pagination Component
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredPosts.length / emailsPerPage); i++) {
        pageNumbers.push(i);
    }

    const toggleGroup = (sender: string) => {
        setOpenGroups(prev => {
            const newOpenGroups = new Set(prev);
            if (newOpenGroups.has(sender)) {
                newOpenGroups.delete(sender);
            } else {
                newOpenGroups.add(sender);
            }
            return newOpenGroups;
        });
    };

    return (
        <div className="bg-white shadow-md rounded overflow-hidden text-xs">
            {/* Tabs */}
            <div className="flex border-b">
                <button className={`px-4 py-2 text-left flex gap-1 ${activeTab === "recipient" ? "bg-blue-900 text-white" : "bg-gray-100"}`} onClick={() => setActiveTab("recipient")}><CiInboxIn size={15} />Inbox</button>
                <button className={`px-4 py-2 text-left flex gap-1 ${activeTab === "sender" ? "bg-blue-900 text-white" : "bg-gray-100"}`} onClick={() => setActiveTab("sender")}><CiPaperplane size={15} />Sent</button>
            </div>

            {/* Email Table */}
            <div className="flex-1 p-4 overflow-auto">
                <table className="min-w-full table-auto border-collapse text-xs">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2 text-left flex gap-2"><input type="checkbox" checked={selectedEmails.size === currentEmails.length} onChange={handleSelectAll} />Select All</th>
                            <th className="px-4 py-2 text-left">Subject</th>
                            <th className="px-4 py-2 text-left">Message</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Date Created</th>
                            {(activeTab === "recipient" || activeTab === "sender") && (
                                <th className="px-4 py-2 text-left">Action</th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {activeTab === "recipient" ? (
                            Object.keys(groupedEmails || {}).map((sender) => (
                                <React.Fragment key={sender}>
                                    <tr className="bg-white">
                                        <td colSpan={5} className="w-full border-b-2 px-4 py-2 font-semibold cursor-pointer flex items-center" onClick={() => toggleGroup(sender)}>
                                            <span className="mr-2">
                                                {openGroups.has(sender) ? <FaMinus /> : <FaPlus size={10} />}
                                            </span>
                                            {sender}
                                        </td>
                                    </tr>

                                    {openGroups.has(sender) && groupedEmails![sender].map((email) => (
                                        <tr key={email.id} className="border-b hover:bg-gray-100">
                                            <td className="px-4 py-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEmails.has(email.id)}
                                                    onChange={() => handleCheckboxChange(email.id)}
                                                />
                                            </td>
                                            <td className="px-4 py-2 uppercase font-semibold">{email.subject}</td>
                                            <td className="px-4 py-2 capitalize">
                                                {removeHtmlTagsAndSignature(email.message).length > 100
                                                    ? removeHtmlTagsAndSignature(email.message).slice(0, 100) + "..."
                                                    : removeHtmlTagsAndSignature(email.message)}
                                            </td>
                                            <td className="px-4 py-2 uppercase font-semibold">{email.status}</td>
                                            <td className="px-4 py-2">{format(parseISO(email.date_created), "MMM dd, yyyy - h:mm:ss a")}</td>
                                            <td className="px-4 py-2">
                                                <button
                                                    onClick={() => handleReply(email)}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Reply?
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))
                        ) : (
                            filteredPosts.map((email) => (
                                <tr key={email.id} className="border-b hover:bg-gray-100">
                                    <td className="px-4 py-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedEmails.has(email.id)}
                                            onChange={() => handleCheckboxChange(email.id)}
                                        />
                                    </td>
                                    <td className="px-4 py-2 uppercase font-semibold">{email.subject}</td>
                                    <td className="px-4 py-2 capitalize">
                                        {removeHtmlTagsAndSignature(email.message).length > 150
                                            ? removeHtmlTagsAndSignature(email.message).slice(0, 150) + "..."
                                            : removeHtmlTagsAndSignature(email.message)}
                                    </td>

                                    <td className="px-4 py-2 uppercase font-semibold">{email.status}</td>
                                    <td className="px-4 py-2">{format(parseISO(email.date_created), "MMM dd, yyyy - h:mm:ss a")}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleEdit(email)} // Use handleEdit in the Sent tab
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </button>
                                        
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="mt-4 flex justify-end">
                    <ul className="flex space-x-2">
                        {pageNumbers.map((number) => (
                            <li key={number}>
                                <button
                                    onClick={() => paginate(number)}
                                    className={`px-3 py-1 rounded ${currentPage === number ? "bg-blue-900 text-white" : "bg-gray-200"}`}
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
                                <input type="text" value={userDetails.Email} readOnly className="w-full border px-2 py-2 rounded text-xs" />
                            </div>
                            <div>
                                <label>To:</label>
                                <input type="text" value={replyToEmail.sender} readOnly className="w-full border px-2 py-2 rounded text-xs" />
                            </div>
                            <div>
                                <label>Subject:</label>
                                <input type="text" value={`RE: ${replyToEmail.subject}`} readOnly className="w-full border px-2 py-2 rounded text-xs" />
                            </div>
                            <div>
                                <label>Message:</label>
                                <textarea value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} placeholder="Type your reply..." className="w-full border px-2 py-1 rounded text-xs min-h-[100px] capitalize" />
                            </div>
                            <div className="text-right mt-3">
                                <button onClick={() => setShowReplyModal(false)}
                                    className="mr-2 bg-white text-black text-xs px-4 py-2 hover:rounded hover:bg-blue-900 hover:text-white transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSendReply}
                                    className="border bg-white text-black text-xs px-4 py-2 shadow-sm rounded hover:bg-blue-900 hover:text-white transition"
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
