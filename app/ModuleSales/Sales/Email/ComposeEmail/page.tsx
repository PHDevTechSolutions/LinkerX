"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../../ModuleSales/components/User/UserFetcher";

// Components
import AddPostForm from "../../../../ModuleSales/components/Email/ComposeEmail/AddUserForm";
import UsersCard from "../../../../ModuleSales/components/Email/ComposeEmail/EmailTable"; // Assuming this is the component handling the Kanban-style cards

// Toast Notifications
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { CiTrash, CiCircleRemove, CiEdit } from "react-icons/ci";

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
            const response = await fetch("/api/ModuleSales/Email/ComposeEmail/FetchEmail");
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
        ? posts.filter((post) => {
            const hasSubject = !!post?.subject;
            const matchesSearchTerm =
                hasSubject && post.subject.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesClientType = true; // Assuming you don't need client type here

            const matchesRecipient = post?.recepient === userDetails.Email;
            const matchesSender = post?.sender === userDetails.Email;

            // Apply filter for either recipient or sender matching user email
            return (
                hasSubject &&
                matchesSearchTerm &&
                matchesClientType &&
                (matchesRecipient || matchesSender) // Match if either recipient or sender
            );
        })
        : [];

    const currentPosts = filteredAccounts.slice();
    const totalPages = Math.ceil(filteredAccounts.length);


    const handleEdit = (post: any) => {
        setEditUser(post);
        setShowForm(true);
    };

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => (
                        <div className="container mx-auto p-4 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                                {showForm ? (
                                    <AddPostForm
                                        onCancel={() => {
                                            setShowForm(false);
                                            setEditUser(null);
                                        }}
                                        refreshPosts={fetchAccount}
                                        userDetails={{
                                            id: editUser ? editUser.id : userDetails.UserId,
                                            referenceid: editUser ? editUser.referenceid : userDetails.ReferenceID,
                                            sender: editUser ? editUser.sender : userDetails.Email,
                                        }}
                                        editUser={editUser}
                                    />
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center mb-4">
                                            <button
                                                className="flex items-center gap-1 border bg-white text-black text-xs px-4 py-2 shadow-sm rounded hover:bg-blue-900 hover:text-white transition"
                                                onClick={() => setShowForm(true)}
                                            >
                                                <CiEdit size={16} /> Compose
                                            </button>
                                        </div>

                                        <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                                            <h2 className="text-lg font-bold mb-2">XendMail</h2>
                                            <p className="text-xs text-gray-600 mb-4">
                                                The <strong>XendMail</strong> feature allows users to compose new emails and efficiently manage their status updates. It simplifies the workflow by providing a clear visual representation of the email’s current status. Users can categorize emails into stages such as "Draft," "Sent," "Pending," and "Archived," enabling easy tracking and progress monitoring. This system enhances team collaboration by allowing users to quickly update the status of each email, improving communication efficiency and ensuring smooth coordination across the team.
                                            </p>

                                            <UsersCard
                                                posts={currentPosts}
                                                handleEdit={(user) => handleEdit(user)}
                                                userDetails={userDetails}
                                                fetchAccount={fetchAccount}
                                            />
                                        </div>
                                    </>
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
