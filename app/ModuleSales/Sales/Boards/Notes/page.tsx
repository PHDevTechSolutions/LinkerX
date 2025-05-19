"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";

// Components
import AddPostForm from "../../../components/Boards/Notes/AddUserForm";
import UsersCard from "../../../components/Boards/Notes/UsersTable"; // Assuming this is the component handling the Kanban-style cards

// Toast Notifications
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { CiTrash, CiCircleRemove, CiStickyNote } from "react-icons/ci";

const ListofUser: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [editUser, setEditUser] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClientType, setSelectedClientType] = useState("");
    const [startDate, setStartDate] = useState(""); // Default to null
    const [endDate, setEndDate] = useState(""); // Default to null
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);

    const [userDetails, setUserDetails] = useState({
        UserId: "", ReferenceID: "", Manager: "", TSM: "", Firstname: "", Lastname: "", Email: "", Role: "", Department: "", Company: "",
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
                        UserId: data._id,
                        ReferenceID: data.ReferenceID || "",
                        Manager: data.Manager || "",
                        TSM: data.TSM || "",
                        Firstname: data.Firstname || "",
                        Lastname: data.Lastname || "",
                        Email: data.Email || "",
                        Role: data.Role || "",
                        Department: data.Department || "",
                        Company: data.Company || "",
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

    // Fetch all posts from the API
    const fetchAccount = async () => {
        try {
            const response = await fetch("/api/ModuleSales/Boards/Notes/FetchNotes");
            const data = await response.json();
            setPosts(data.data);
        } catch (error) {
            toast.error("Error fetching users.");
            console.error("Error Fetching", error);
        }
    };

    useEffect(() => {
        fetchAccount();
    }, []);

    const updatePostStatus = async (postId: string, newStatus: string) => {
        const response = await fetch(`/api/ModuleSales/Boards/Notes/UpdateStatus`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: postId,
                status: newStatus,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Status updated successfully!', data.updatedPost);

            // Update the local state with the new data from the backend
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId ? { ...post, status: newStatus } : post
                )
            );
        } else {
            console.error('Failed to update status');
        }
    };

    // Filter users by search term (title)
    const filteredAccounts = Array.isArray(posts)
        ? posts
            .filter((post) => {
                const hasTitle = !!post?.title;
                const matchesSearchTerm =
                    hasTitle && post.title.toLowerCase().includes(searchTerm.toLowerCase());

                const postDate = post.date_created ? new Date(post.date_created) : null;
                const isWithinDateRange =
                    (!startDate || (postDate && postDate >= new Date(startDate))) &&
                    (!endDate || (postDate && postDate <= new Date(endDate)));

                const matchesClientType = selectedClientType
                    ? post?.typeclient === selectedClientType
                    : true;

                const userReferenceID = userDetails.ReferenceID;
                const matchesReferenceID =
                    post?.referenceid === userReferenceID || post?.ReferenceID === userReferenceID;

                const matchesRole =
                    userDetails.Role === "Super Admin" || userDetails.Role === "Territory Sales Associate";

                return (
                    hasTitle &&
                    matchesSearchTerm &&
                    isWithinDateRange &&
                    matchesClientType &&
                    matchesReferenceID &&
                    matchesRole
                );
            })
            .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
        : [];

    const currentPosts = filteredAccounts.slice();
    const totalPages = Math.ceil(filteredAccounts.length);

    const confirmDelete = (postId: string) => {
        setPostToDelete(postId);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!postToDelete) return;
        try {
            const response = await fetch(`/api/ModuleSales/Task/DailyActivity/DeleteActivity`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: postToDelete }),
            });

            if (response.ok) {
                setPosts(posts.filter((post) => post.id !== postToDelete));
                toast.success("Post deleted successfully.");
            } else {
                toast.error("Failed to delete post.");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete post.");
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
                        <div className="container mx-auto p-4 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                                {/* Backdrop overlay */}
                                {showForm && (
                                    <div
                                        className="fixed inset-0 bg-black bg-opacity-50 z-30"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditUser(null);
                                        }}
                                    ></div>
                                )}

                                {/* Sliding Form */}
                                <div
                                    className={`fixed top-0 right-0 h-full p-2 w-full md:w-1/4 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto ${showForm ? "translate-x-0" : "translate-x-full"
                                        }`}
                                >
                                    {showForm && (
                                        <AddPostForm
                                            onCancel={() => {
                                                setShowForm(false);
                                                setEditUser(null);
                                            }}
                                            refreshPosts={fetchAccount}
                                            userDetails={{
                                                id: editUser ? editUser.id : userDetails.UserId,
                                                referenceid: editUser ? editUser.referenceid : userDetails.ReferenceID,
                                            }}
                                            editUser={editUser}
                                        />
                                    )}
                                </div>

                                <div className="flex justify-between items-center mb-4">
                                    <button
                                        className="flex items-center gap-1 border bg-white text-black text-xs px-4 py-2 shadow-sm rounded hover:bg-blue-900 hover:text-white transition"
                                        onClick={() => setShowForm(true)}
                                    >
                                        <CiStickyNote size={16} /> Create Notes
                                    </button>
                                </div>

                                <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                                    <h2 className="text-lg font-bold mb-2">Notes</h2>
                                    <p className="text-xs text-gray-600 mb-4">
                                        The <strong>Kanban Board</strong> here is used to manage and track the progress of various tasks or activities. It helps in organizing the workflow and provides a clear visual representation of task status. The board is divided into different columns such as "Backlogs," "Priority," "Important", and "Finished," allowing users to move tasks across these stages. This system enhances collaboration by allowing team members to easily update and track the status of each task, making it an effective tool for managing tasks, improving productivity, and ensuring smoother coordination within the team.
                                    </p>
                                    <UsersCard
                                        posts={currentPosts}
                                        handleDelete={confirmDelete}
                                        updatePostStatus={updatePostStatus} // Pass the updatePostStatus function
                                    />
                                </div>

                                {showDeleteModal && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                        <div className="bg-white p-4 rounded shadow-lg">
                                            <h2 className="text-xs font-bold mb-4">Confirm Deletion</h2>
                                            <p className="text-xs">Are you sure you want to delete this post?</p>
                                            <div className="mt-4 flex justify-end">
                                                <button className="bg-red-500 text-white text-xs px-4 py-2 rounded mr-2 flex items-center gap-1" onClick={handleDelete}><CiTrash size={20} />Delete</button>
                                                <button className="bg-gray-300 text-xs px-4 py-2 rounded flex items-center gap-1" onClick={() => setShowDeleteModal(false)}><CiCircleRemove size={20} /> Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <ToastContainer className="text-xs" />
                            </div>
                        </div>
                    )}
                </UserFetcher>
            </ParentLayout>
        </SessionChecker>
    );
};

export default ListofUser;
