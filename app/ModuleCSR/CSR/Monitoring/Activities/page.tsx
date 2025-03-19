"use client";

import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";
import AddAccountForm from "../../../components/Monitoring/AddActivityForm";
import SearchFilters from "../../../components/Monitoring/SearchFilters";
import AccountsTable from "../../../components/Monitoring/ActivityTable";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { CiCirclePlus } from "react-icons/ci";

const ActivityPage: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [editPost, setEditPost] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setselectedStatus] = useState("");
    const [salesAgent, setSalesAgent] = useState("");
    const [TicketReceived, setTicketReceived] = useState("");
    const [TicketEndorsed, setTicketEndorsed] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);

    const [userDetails, setUserDetails] = useState({
        UserId: "", ReferenceID: "", Firstname: "", Lastname: "", Email: "", Role: "",
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch user data based on query parameters (user ID)
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
                        UserId: data._id, // Set the user's id here
                        ReferenceID: data.ReferenceID || "",  // <-- Siguraduhin na ito ay may value
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

    // Fetch accounts from the API
    const fetchActivity = async () => {
        try {
            const response = await fetch("/api/ModuleCSR/Monitorings/FetchActivity");
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            toast.error("Error fetching accounts.");
            console.error("Error fetching accounts:", error);
        }
    };

    useEffect(() => {
        fetchActivity();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const response = await fetch("/api/ModuleCSR/Monitorings/UpdateStatus", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, Status: newStatus }),
            });

            if (response.ok) {
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post._id === id ? { ...post, Status: newStatus } : post
                    )
                );
                toast.success("Status updated successfully.");
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || "Failed to update status.");
            }
        } catch (error) {
            toast.error("Failed to update status.");
            console.error("Error updating status:", error);
        }
    };

    const handleRemarksUpdate = async (id: string, NewRemarks: string) => {
        try {
            const response = await fetch("/api/ModuleCSR/Monitorings/UpdateRemarks", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, Remarks: NewRemarks }),
            });

            if (response.ok) {
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post._id === id ? { ...post, Remarks: NewRemarks } : post
                    )
                );
                toast.success("Status updated successfully.");
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || "Failed to update status.");
            }
        } catch (error) {
            toast.error("Failed to update status.");
            console.error("Error updating status:", error);
        }
    };

    // Filter accounts based on search term, channel, sales agent, and date range
    const filteredAccounts = posts.filter((post) => {
        const matchesSearchTerm =
            post.CompanyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.CustomerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (post.TicketReferenceNumber && post.TicketReferenceNumber.includes(searchTerm)) ||
            post.ContactNumber.includes(searchTerm);

        const matchesStatus = selectedStatus ? post.Status.includes(selectedStatus) : true;
        const matchesSalesAgent = salesAgent ? post.SalesAgent.toLowerCase().includes(salesAgent.toLowerCase()) : true;

        const matchesDateRange =
            (!TicketReceived || new Date(post.TicketReceived) >= new Date(TicketReceived)) &&
            (!TicketEndorsed || new Date(post.TicketEndorsed) <= new Date(TicketEndorsed));

        if (userDetails.Role === "Super Admin") {
            return matchesSearchTerm && matchesStatus && matchesSalesAgent && matchesDateRange;
        } else if (userDetails.Role === "Admin") {
            return post.Role === "Staff" && matchesSearchTerm && matchesStatus && matchesSalesAgent && matchesDateRange;
        } else if (userDetails.Role === "Staff") {
            return post.ReferenceID === userDetails.ReferenceID && matchesSearchTerm && matchesStatus && matchesSalesAgent && matchesDateRange;
        }

        return false; // Default case: if none of the roles match, return false
    });

    // Edit post function
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
            const response = await fetch(`/api/ModuleCSR/Monitorings/DeleteActivity`, {
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
                            <div className="grid grid-cols-1 md:grid-cols-1">
                                {showForm ? (
                                    <AddAccountForm
                                        onCancel={() => {
                                            setShowForm(false);
                                            setEditPost(null);
                                        }}
                                        refreshPosts={fetchActivity}
                                        userName={user ? user.userName : ""}
                                        userDetails={{
                                            id: editPost ? editPost.UserId : userDetails.UserId,
                                            Role: user ? user.Role : "",
                                            ReferenceID: user ? user.ReferenceID : "", // <-- Ito ang dapat mong suriin
                                        }}
                                        editPost={editPost}
                                    />

                                ) : (
                                    <>
                                        <div className="flex justify-between items-center mb-4">
                                            <button className="bg-blue-800 text-white px-4 text-xs py-2 rounded flex items-center gap-1" onClick={() => setShowForm(true)}>
                                                <CiCirclePlus size={20} />Add Ticket
                                            </button>
                                        </div>
                                        <h2 className="text-lg font-bold mb-2">Tickets Summary</h2>
                                        <p className="text-xs mb-4">
                                            This section provides an overview of ticket management, including the creation of new tickets and
                                            a list of endorsed, closed, and open tickets. It allows filtering based on various criteria to help
                                            track and manage ticket statuses efficiently.
                                        </p>
                                        <div className="mb-4 p-4 bg-white shadow-md rounded-lg text-gray-900">
                                            <SearchFilters
                                                searchTerm={searchTerm}
                                                setSearchTerm={setSearchTerm}
                                                selectedStatus={selectedStatus}
                                                setselectedStatus={setselectedStatus}
                                                salesAgent={salesAgent}
                                                setSalesAgent={setSalesAgent}
                                                TicketReceived={TicketReceived}
                                                setTicketReceived={setTicketReceived}
                                                TicketEndorsed={TicketEndorsed}
                                                setTicketEndorsed={setTicketEndorsed}
                                            />
                                            <AccountsTable
                                                posts={filteredAccounts}
                                                handleEdit={handleEdit}
                                                handleDelete={confirmDelete}
                                                handleStatusUpdate={handleStatusUpdate}
                                                handleRemarksUpdate={handleRemarksUpdate}
                                            />
                                        </div>
                                    </>
                                )}

                                {showDeleteModal && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
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

export default ActivityPage;
