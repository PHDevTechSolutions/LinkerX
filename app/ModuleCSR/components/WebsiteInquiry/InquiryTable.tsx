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
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-100 text-left text-xs uppercase font-bold border-b">
                        <th className="p-3 border">Customer Name</th>
                        <th className="p-3 border">Company Name</th>
                        <th className="p-3 border">Email Address</th>
                        <th className="p-3 border">Contact Number</th>
                        <th className="p-3 border">Message</th>
                        <th className="p-3 border">Status</th>
                        <th className="p-3 border">Date Submitted</th>
                        <th className="p-3 border text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {updatedPosts.map((post) => (
                        <tr key={post._id} className="border-b text-xs capitalize hover:bg-gray-50 capitalize">
                            <td className="p-3 border">{post.CustomerName}</td>
                            <td className="p-3 border">{post.CompanyName}</td>
                            <td className="p-3 border lowercase">{post.EmailAddress}</td>
                            <td className="p-3 border">{post.ContactNumber}</td>
                            <td className="p-3 border">{post.Message}</td>
                            <td className="p-3 border">
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


                            <td className="p-3 border">{post?.createdAt ? new Date(post.createdAt).toLocaleString() : "N/A"}</td>
                            <td className="p-3 border text-center">
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
