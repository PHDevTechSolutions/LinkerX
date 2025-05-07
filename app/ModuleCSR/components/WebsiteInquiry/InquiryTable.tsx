import React, { useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";

interface Post {
    _id: string;
    CustomerName: string;
    CompanyName: string;
    EmailAddress: string;
    ContactNumber: string;
    Status: string;
    Message: string;
    createdAt: string;
}

interface InquirytableProps {
    posts: Post[];
    handleEdit: (post: Post) => void;
    handleDelete: (postId: string) => void;
    Role: string;
    fetchAccounts: () => void;
}

const Inquirytable: React.FC<InquirytableProps> = ({ posts, handleEdit, handleDelete, Role, fetchAccounts, }) => {
    const updatedPosts = useMemo(() => posts, [posts]);

    useEffect(() => {
        console.log("Role in AccountsTable:", Role);
    }, [Role]);


    const updateStatus = async (postId: string) => {
        try {
            // Send PUT request to the API to update the status
            const response = await fetch(`/api/ModuleCSR/WebsiteInquiry/UpdateStatus`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: postId, // Pass the correct postId
                    Status: "Checked", // Set the status to "Checked"
                }),
            });

            if (response.ok) {
                toast.success("Status updated successfully", {
                    autoClose: 1000,
                    onClose: () => {
                        fetchAccounts(); // Refresh the accounts table after updating status
                    },
                });
            } else {
                toast.error("Failed to update status", {
                    autoClose: 1000,
                });
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Error updating status", {
                autoClose: 1000,
            });
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                    <tr className="text-xs text-left whitespace-nowrap border-l-4 border-emerald-400">
                        <th className="px-6 py-4 font-semibold text-gray-700">Customer Name</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Company Name</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Email Address</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Contact Number</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Message</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Date Submitted</th>
                        <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {updatedPosts.map((post) => (
                        <tr key={post._id} className="border-b whitespace-nowrap">
                            <td className="px-6 py-4 text-xs capitalize">{post.CustomerName}</td>
                            <td className="px-6 py-4 text-xs uppercase">{post.CompanyName}</td>
                            <td className="px-6 py-4 text-xs">{post.EmailAddress}</td>
                            <td className="px-6 py-4 text-xs">{post.ContactNumber}</td>
                            <td className="px-6 py-4 text-xs capitalize">{post.Message}</td>
                            <td className="px-6 py-4 text-xs">
                                <span
                                    className={`inline-flex items-center px-2 py-1 text-[10px] font-semibold rounded-full ${post.Status === "Pending"
                                        ? "bg-red-500 text-white"
                                        : "bg-green-500 text-white"
                                        }`}
                                >
                                    {/* Icon based on status */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        {post.Status === "Pending" ? (
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 9l-7 7-7-7"
                                            />
                                        ) : (
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 13l4 4L19 7"
                                            />
                                        )}
                                    </svg>
                                    {post.Status}
                                </span>
                            </td>


                            <td className="px-6 py-4 text-xs">{post?.createdAt ? new Date(post.createdAt).toLocaleString() : "N/A"}</td>
                            <td className="px-6 py-4 text-xs">
                                {/* Update Status Button */}
                                <button onClick={() => updateStatus(post._id)} className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition">Read</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Inquirytable;
