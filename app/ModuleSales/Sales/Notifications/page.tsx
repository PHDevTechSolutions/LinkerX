"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../components/Layouts/ParentLayout";
import SessionChecker from "../../components/Session/SessionChecker";
import UserFetcher from "../../components/User/UserFetcher";

// Components
import AddPostForm from "../../components/Boards/Notes/AddUserForm";
import UsersCard from "../../components/Notification/UsersTable"; // Assuming this is the component handling the Kanban-style cards

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
            const response = await fetch("/api/ModuleSales/Notification/FetchNotifications");
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

    // Filter users by search term (title)
    const filteredAccounts = Array.isArray(posts)
        ? posts
            .filter((post) => {
                const hasType = !!post?.type; // Check if type exists
                const matchesSearchTerm =
                    hasType && post.type.toLowerCase().includes(searchTerm.toLowerCase());

                const postDate = post.date_created ? new Date(post.date_created) : null;
                const isWithinDateRange =
                    (!startDate || (postDate && postDate >= new Date(startDate))) &&
                    (!endDate || (postDate && postDate <= new Date(endDate)));

                const matchesClientType = selectedClientType
                    ? post?.typeclient === selectedClientType
                    : true;

                // ✅ ReferenceID-based filtering based on user role
                const userReferenceID = userDetails.ReferenceID;
                const matchesReferenceID =
                    (userDetails.Role === "Manager" && post?.manager === userReferenceID) ||
                    (userDetails.Role === "Territory Sales Manager" && post?.tsm === userReferenceID) ||
                    (userDetails.Role === "Territory Sales Associate" && post?.referenceid === userReferenceID);

                return (
                    hasType &&
                    matchesSearchTerm &&
                    isWithinDateRange &&
                    matchesClientType &&
                    matchesReferenceID
                );
            })
            .sort(
                (a, b) =>
                    new Date(b.date_created).getTime() -
                    new Date(a.date_created).getTime()
            )
        : [];


    const currentPosts = filteredAccounts.slice();
    const totalPages = Math.ceil(filteredAccounts.length);

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
                                        }}
                                        editUser={editUser}
                                    />
                                ) : (
                                    <>
                                        <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                                            <h2 className="text-lg font-bold mb-2">Notifications</h2>
                                            <UsersCard
                                                posts={filteredAccounts}
                                                userDetails={userDetails}
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
