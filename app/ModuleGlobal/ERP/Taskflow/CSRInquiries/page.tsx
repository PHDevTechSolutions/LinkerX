"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";
// Tools Global
import SearchFilters from "../../../components/Tools/SearchFilters";
import Pagination from "../../../components/Tools/Pagination";
// Route
import Form from "../../../components/UserManagement/CSRAgent/Form";
import Table from "../../../components/Inquiries/Table";
// Toast
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { CiSquarePlus } from "react-icons/ci";

const Inquiries: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [editUser, setEditUser] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(12);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);

    const [userDetails, setUserDetails] = useState({
        UserId: "", ReferenceID: "", Firstname: "", Lastname: "", Email: "", Role: "", Department: "", Company: "",
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
                        ReferenceID: data.ReferenceID,
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

    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/ModuleGlobal/Inquiries/FetchData");
            const data = await response.json();

            if (Array.isArray(data)) {
                setPosts(data);
            } else if (Array.isArray(data.data)) {
                setPosts(data.data);
            } else {
                console.error("Fetched data is not an array:", data);
                toast.error("Fetched data is invalid.");
                setPosts([]);
            }
        } catch (error) {
            toast.error("Error fetching users.");
            console.error("Error Fetching", error);
        }
    };


    const filteredAccounts = Array.isArray(posts)
        ? posts.filter((post) =>
            [post?.referenceid].some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        : [];

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredAccounts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredAccounts.length / postsPerPage);

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEdit = (post: any) => {
        setEditUser(post);
        setShowForm(true);
    };

    const confirmDelete = (postId: string) => {
        setPostToDelete(postId);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!postToDelete) return;
        try {
            const response = await fetch(`/api/ModuleSales/UserManagement/ManagerDirector/DeleteUser`, {
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
                            <div className="grid grid-cols-1">
                                {showForm ? (
                                    <Form
                                        onCancel={() => {
                                            setShowForm(false);
                                            setEditUser(null);
                                        }}
                                        refreshPosts={fetchUsers}
                                        userName={user ? user.userName : ""}
                                        userDetails={{ id: editUser ? editUser._id : userDetails.UserId }}
                                        editUser={editUser}
                                    />
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center mb-4">
                                            <button
                                                className="flex items-center gap-1 border bg-white text-black text-xs px-4 py-2 shadow-md rounded hover:bg-blue-900 hover:text-white"
                                                onClick={() => setShowForm(true)}>
                                                <CiSquarePlus size={20} /> Add Account
                                            </button>
                                        </div>
                                        <div className="p-4 bg-white border shadow rounded-md">
                                            <h2 className="text-lg font-bold mb-4">CSR Agent</h2>
                                            <SearchFilters
                                                searchTerm={searchTerm}
                                                setSearchTerm={setSearchTerm}
                                                postsPerPage={postsPerPage}
                                                setPostsPerPage={setPostsPerPage}
                                            />
                                            <Table
                                                currentPosts={currentPosts}
                                                handleEdit={handleEdit}
                                                confirmDelete={confirmDelete}
                                            />
                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                setCurrentPage={setCurrentPage}
                                            />
                                            <div className="text-xs mt-2">
                                                Showing {indexOfFirstPost + 1} to {Math.min(indexOfLastPost, filteredAccounts.length)} of {filteredAccounts.length} entries
                                            </div>
                                        </div>
                                    </>
                                )}

                                {showDeleteModal && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]">
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

export default Inquiries;