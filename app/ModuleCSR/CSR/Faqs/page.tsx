"use client";

import React, { useState, useEffect } from "react";
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/Session/SessionChecker";
import UserFetcher from "../../components/User/UserFetcher";
import AddFaqs from "../../components/Faqs/Form";
import Table from "../../components/Faqs/Table";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { CiCirclePlus } from "react-icons/ci";

const ReceivedPO: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [editPost, setEditPost] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [usersList, setUsersList] = useState<any[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    const [userDetails, setUserDetails] = useState({
        UserId: "",
        ReferenceID: "",
        Firstname: "",
        Lastname: "",
        Email: "",
        Role: "",
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAccounts = async () => {
        try {
            const response = await fetch("/api/ModuleCSR/Faqs/Fetch");
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            toast.error("Error fetching accounts.");
            console.error("Error fetching accounts:", error);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            const params = new URLSearchParams(window.location.search);
            const userId = params.get("id");

            if (userId) {
                try {
                    const response = await fetch(`/api/user?id=${encodeURIComponent(userId)}`);
                    if (!response.ok) throw new Error("Failed to fetch user data");
                    const data = await response.json();
                    setUserDetails({
                        UserId: data._id,
                        ReferenceID: data.ReferenceID || "",
                        Firstname: data.Firstname || "",
                        Lastname: data.Lastname || "",
                        Email: data.Email || "",
                        Role: data.Role || "",
                    });
                } catch (err: unknown) {
                    console.error("Error fetching user data:", err);
                    setError("Failed to load user data. Please try again later.");
                } finally {
                    setLoading(false);
                }
            } else {
                setError("User ID is missing.");
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/getUsers");
                const data = await response.json();
                setUsersList(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const filteredAccounts = posts
        .filter((post) => {
            const isSearchMatch = post.Title.toLowerCase().includes(searchTerm.toLowerCase());
            const isDateInRange =
                (!startDate || new Date(post.createdAt) >= new Date(startDate)) &&
                (!endDate || new Date(post.createdAt) <= new Date(endDate));

            return isSearchMatch && isDateInRange;
        })
        .map((post) => {
            const agent = usersList.find((user) => user.ReferenceID === post.ReferenceID);
            return {
                ...post,
                AgentFirstname: agent?.Firstname || "Unknown",
                AgentLastname: agent?.Lastname || "Unknown",
            };
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


    const handleEdit = (post: any) => {
        setEditPost(post);
        setShowForm(true);
    };

    // Show delete modal
    const confirmDelete = (postId: string) => {
        setPostToDelete(postId);
        setShowDeleteModal(true);
    };

    // Delete post function
    const handleDelete = async () => {
        if (!postToDelete) return;
        try {
            const response = await fetch(`/api/ModuleCSR/Faqs/Delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: postToDelete }),
            });

            if (response.ok) {
                setPosts(posts.filter((post) => post._id !== postToDelete));
                toast.success("Account deleted successfully.");
            } else {
                toast.error("Failed to delete account.");
            }
        } catch (error) {
            toast.error("Failed to delete account.");
            console.error("Error deleting account:", error);
        } finally {
            setShowDeleteModal(false);
            setPostToDelete(null);
        }
    };

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => (
                        <div className="container mx-auto p-4">
                            <div className="grid grid-cols-1">
                                {showForm ? (
                                    <AddFaqs
                                        onCancel={() => {
                                            setShowForm(false);
                                            setEditPost(null);
                                        }}
                                        refreshPosts={fetchAccounts}
                                        userName={user ? user.userName : ""}
                                        userDetails={{
                                            id: editPost ? editPost.UserId : userDetails.UserId,
                                            Role: user ? user.Role : "",
                                            ReferenceID: user ? user.ReferenceID : "",
                                        }}
                                        editPost={editPost}
                                    />
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center mb-4">
                                            {userDetails.Role !== "Staff" && (
                                            <button
                                                className="bg-blue-800 text-white px-4 text-xs py-2 rounded flex items-center gap-1"
                                                onClick={() => setShowForm(true)}
                                            >
                                                <CiCirclePlus size={20} />
                                                Add Faqs
                                            </button>
                                            )}
                                        </div>
                                        <h2 className="text-lg font-bold mb-2">CSR Frequently Asked Questions</h2>
                                        <p className="text-xs mb-2">
                                            This section displays the CSR FAQs (Customer Service Representative Frequently Asked Questions). It provides answers to common inquiries related to CSR processes, ensuring quick access to essential information. If an error occurs, a message will be shown in red. The CSRFaqs component is responsible for rendering the list of frequently asked questions.
                                        </p>
                                        <div className="mb-4 p-4 bg-white shadow-md rounded-lg text-gray-900">
                                            {/* Pass user?.Role directly as role prop */}
                                            <Table
                                                posts={filteredAccounts}
                                                handleEdit={handleEdit}
                                                handleDelete={confirmDelete}
                                                role={user ? user.Role : ""}
                                            />
                                        </div>
                                    </>
                                )}
                                {showDeleteModal && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]">
                                        <div className="bg-white p-4 rounded shadow-lg">
                                            <h2 className="text-xs font-bold mb-4">Confirm Deletion</h2>
                                            <p className="text-xs">Are you sure you want to delete this account?</p>
                                            <div className="mt-4 flex justify-end">
                                                <button className="bg-red-500 text-white text-xs px-4 py-2 rounded mr-2" onClick={handleDelete}>Delete</button>
                                                <button className="bg-gray-300 text-xs px-4 py-2 rounded" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <ToastContainer className="text-xs" autoClose={1000} />
                            </div>
                        </div>
                    )}
                </UserFetcher>
            </ParentLayout>
        </SessionChecker>
    );
};

export default ReceivedPO;
