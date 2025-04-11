"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../../ModuleCSR/components/User/UserFetcher";

// Components
import AddPostForm from "../../../../ModuleCSR/components/Users/AddUserForm";
import SearchFilters from "../../../../ModuleCSR/components/Users/SearchFilters";
import UsersTable from "../../../../ModuleCSR/components/Users/UsersTable";
import Pagination from "../../../../ModuleCSR/components/Users/Pagination";
import { CiCirclePlus } from "react-icons/ci";

// Toast Notifications
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListofUser: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [editUser, setEditUser] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(12);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    // Fetch all users from the API
    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/ModuleCSR/User/FetchUser");
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            toast.error("Error fetching users.");
            console.error("Error Fetching", error);
        }
    };

    // Handle editing a user
    const handleEdit = (post: any) => {
        setEditUser(post);
        setShowForm(true);
    };

    // Show delete modal
    const confirmDelete = (postId: string) => {
        setPostToDelete(postId);
        setShowDeleteModal(true);
    };

    // Handle deleting a user
    const handleDelete = async () => {
        if (!postToDelete) return;
        try {
            const response = await fetch(`/api/User/DeleteUser`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: postToDelete }),
            });

            if (response.ok) {
                setPosts(posts.filter((post) => post._id !== postToDelete));
                toast.success("User deleted successfully.");
            } else {
                toast.error("Failed to delete user.");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user.");
        } finally {
            setShowDeleteModal(false);
            setPostToDelete(null);
        }
    };

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => {
                        let filteredAccounts = posts;

                        // Apply role and department-based filtering
                        if (user) {
                            if (user.Role === "Admin") {
                                filteredAccounts = filteredAccounts.filter((post) => post.Role === "Staff");
                            } else if (user.Role === "Super Admin") {
                                filteredAccounts = filteredAccounts.filter((post) => post.Role === "Staff" || post.Role === "Admin");
                            } else if (user.Department) {
                                filteredAccounts = filteredAccounts.filter((post) => post.Department === user.Department);
                            }
                        }

                        // Apply search filter
                        filteredAccounts = filteredAccounts.filter((post) =>
                            [post?.Firstname, post?.Lastname].some((field) =>
                                field?.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                        );

                        const indexOfLastPost = currentPage * postsPerPage;
                        const indexOfFirstPost = indexOfLastPost - postsPerPage;
                        const currentPosts = filteredAccounts.slice(indexOfFirstPost, indexOfLastPost);
                        const totalPages = Math.ceil(filteredAccounts.length / postsPerPage);

                        return (
                            <div className="container mx-auto p-4 text-gray-900">
                                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                                    {showForm ? (
                                        <AddPostForm
                                            onCancel={() => {
                                                setShowForm(false);
                                                setEditUser(null);
                                            }}
                                            refreshPosts={fetchUsers}
                                            userName={user?.userName || ""}
                                            userDetails={{ id: editUser ? editUser._id : "" }}
                                            editUser={editUser}
                                        />
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-center mb-4">
                                                <button className="bg-blue-800 border-2 border-gray-900 text-white px-4 text-xs py-2 rounded flex items-center gap-1" onClick={() => setShowForm(true)}>
                                                    <CiCirclePlus size={20} />Add Ticket
                                                </button>
                                            </div>

                                            <div className="mb-4 p-4 border-4 border-gray-900 bg-white shadow-md rounded-lg">
                                                <h2 className="text-lg font-bold mb-2">List of Users</h2>
                                                <SearchFilters
                                                    searchTerm={searchTerm}
                                                    setSearchTerm={setSearchTerm}
                                                    postsPerPage={postsPerPage}
                                                    setPostsPerPage={setPostsPerPage}
                                                />
                                                <UsersTable posts={currentPosts} handleEdit={handleEdit} handleDelete={confirmDelete} />
                                                <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />

                                                <div className="text-xs mt-2">
                                                    Showing {indexOfFirstPost + 1} to {Math.min(indexOfLastPost, filteredAccounts.length)} of {filteredAccounts.length} entries
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {showDeleteModal && (
                                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                            <div className="bg-white p-4 rounded shadow-lg">
                                                <h2 className="text-xs font-bold mb-4">Confirm Deletion</h2>
                                                <p className="text-xs">Are you sure you want to delete this user?</p>
                                                <div className="mt-4 flex justify-end">
                                                    <button className="bg-red-500 text-white text-xs px-4 py-2 rounded mr-2" onClick={handleDelete}>
                                                        Delete
                                                    </button>
                                                    <button className="bg-gray-300 text-xs px-4 py-2 rounded" onClick={() => setShowDeleteModal(false)}>
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <ToastContainer />
                                </div>
                            </div>
                        );
                    }}
                </UserFetcher>
            </ParentLayout>
        </SessionChecker>
    );
};

export default ListofUser;
