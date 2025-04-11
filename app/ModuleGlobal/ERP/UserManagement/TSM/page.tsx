"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../../ModuleSales/components/User/UserFetcher";

// Components
import AddPostForm from "../../../../ModuleSales/components/UserManagement/TerritorySalesManager/AddUserForm";
import SearchFilters from "../../../../ModuleSales/components/UserManagement/TerritorySalesManager/SearchFilters";
import UsersTable from "../../../../ModuleSales/components/UserManagement/TerritorySalesManager/UsersTable";
import Pagination from "../../../../ModuleSales/components/UserManagement/TerritorySalesManager/Pagination";

// Toast Notifications
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Icons
import { CiSquarePlus } from "react-icons/ci";

const ListofUser: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [editUser, setEditUser] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(12);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);

    const [userDetails, setUserDetails] = useState({
        UserId: "", ReferenceID: "", Firstname: "", Lastname: "", Email: "", Role: "", Department: "", Company: "", Manager: "", TSM: "",
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
                        ReferenceID: data.ReferenceID,
                        Firstname: data.Firstname || "",
                        Lastname: data.Lastname || "",
                        Email: data.Email || "",
                        Role: data.Role || "",
                        Department: data.Department || "",
                        Company: data.Company || "",
                        Manager: data.Manager || "",
                        TSM: data.TSM || "",
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

    // Fetch all users from the API
    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/ModuleSales/UserManagement/TerritorySalesManager/FetchUser");
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            toast.error("Error fetching users.");
            console.error("Error Fetching", error);
        }
    };

    // Filter users by search term (firstname, lastname)
    const filteredAccounts = posts.filter((post) => {
        // Check if the user's name matches the search term
        const matchesSearchTerm = [post?.Firstname, post?.Lastname]
            .some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()));

        // Get the reference ID from userDetails
        const referenceID = userDetails.ReferenceID; // TSM's ReferenceID from MongoDB

        // Check role-based filtering
        const matchesRole = userDetails.Role === "Super Admin"
            ? post?.Role === "Territory Sales Manager" && post?.Department === "Sales" // Super Admin sees TSM in Sales department
            : userDetails.Role === "Admin"
                ? post?.Role === "Territory Sales Manager" && post?.Department === "Sales" && post?.Role !== "Super Admin" // Admin sees TSM in Sales department but not Super Admin
                : false; // Default false if no match


        // Return the filtered result
        return matchesSearchTerm && matchesRole;
    });

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredAccounts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredAccounts.length / postsPerPage);

    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle editing a post
    const handleEdit = (post: any) => {
        setEditUser(post);
        setShowForm(true);
    };

    // Show delete modal
    const confirmDelete = (postId: string) => {
        setPostToDelete(postId);
        setShowDeleteModal(true);
    };

    // Handle deleting a post
    const handleDelete = async () => {
        if (!postToDelete) return;
        try {
            const response = await fetch(`/api/ModuleSales/UserManagement/TerritorySalesManager/DeleteUser`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: postToDelete }),
            });

            if (response.ok) {
                setPosts(posts.filter((post) => post._id !== postToDelete));
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
                                {showForm ? (
                                    <AddPostForm
                                        onCancel={() => {
                                            setShowForm(false);
                                            setEditUser(null);
                                        }}
                                        refreshPosts={fetchUsers}  // Pass the refreshPosts callback
                                        userName={user ? user.userName : ""}  // Ensure userName is passed properly
                                        userDetails={{ id: editUser ? editUser._id : userDetails.UserId }}  // Ensure id is passed correctly
                                        editUser={editUser}
                                    />

                                ) : (
                                    <>
                                        <div className="flex justify-between items-center mb-4">
                                            <button className="flex items-center gap-1 border border-2 border-gray-900 bg-white text-black text-xs px-4 py-2 shadow-md rounded hover:bg-blue-900 hover:text-white transition" onClick={() => setShowForm(true)}>
                                                <CiSquarePlus size={20} />Add Account
                                            </button>
                                        </div>

                                        <div className="mb-4 p-4 bg-white border-4 border-gray-900 shadow-md rounded-lg">
                                            <h2 className="text-lg font-bold mb-2">Territory Sales Manager</h2>
                                            <SearchFilters
                                                searchTerm={searchTerm}
                                                setSearchTerm={setSearchTerm}
                                                postsPerPage={postsPerPage}
                                                setPostsPerPage={setPostsPerPage}
                                            />
                                            <UsersTable
                                                posts={currentPosts}
                                                handleEdit={handleEdit}
                                                handleDelete={confirmDelete}
                                                Role={user ? user.Role : ""}
                                                Department={user ? user.Department : ""}
                                                TSM={user ? user.TSM : ""}
                                                Manager={user ? user.Manager : ""}
                                                fetchUsers={fetchUsers}
                                            />
                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                setCurrentPage={setCurrentPage}
                                            />

                                            <div className="text-xs mt-2">
                                                Showing {indexOfFirstPost + 1} to{" "}
                                                {Math.min(indexOfLastPost, filteredAccounts.length)} of{" "}
                                                {filteredAccounts.length} entries
                                            </div>
                                        </div>
                                    </>
                                )}

                                {showDeleteModal && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                        <div className="bg-white p-4 rounded shadow-lg">
                                            <h2 className="text-xs font-bold mb-4">Confirm Deletion</h2>
                                            <p className="text-xs">Are you sure you want to delete this post?</p>
                                            <div className="mt-4 flex justify-end">
                                                <button
                                                    className="bg-red-500 text-white text-xs px-4 py-2 rounded mr-2"
                                                    onClick={handleDelete}
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    className="bg-gray-300 text-xs px-4 py-2 rounded"
                                                    onClick={() => setShowDeleteModal(false)}
                                                >
                                                    Cancel
                                                </button>
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

export default ListofUser;
