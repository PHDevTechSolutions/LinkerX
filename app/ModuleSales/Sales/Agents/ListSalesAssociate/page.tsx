"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";

// Components
import AddPostForm from "../../../components/Agents/ListSalesAssociate/AddUserForm";
import SearchFilters from "../../../components/UserManagement/TerritorySalesAssociates/SearchFilters";
import UsersTable from "../../../components/Agents/ListSalesAssociate/UsersTable";
import Pagination from "../../../components/UserManagement/TerritorySalesAssociates/Pagination";

// Toast Notifications
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
        UserId: "", ReferenceID: "", Firstname: "", Lastname: "", Email: "", Role: "", Department: "", Company: "",
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
                        ReferenceID: data.ReferenceID || "",
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

    // Fetch all users from the API
    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/ModuleSales/UserManagement/TerritorySalesAssociates/FetchUser");
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            toast.error("Error fetching users.");
            console.error("Error Fetching", error);
        }
    };

    // Filter users by search term (firstname, lastname)
    const filteredAccounts = posts.filter((post) => {
        // Exclude if status is Resigned or Terminated
        const isExcludedStatus = ["Resigned", "Terminated"].includes(post?.Status);
        if (isExcludedStatus) return false;

        // Check if the user's name matches the search term
        const matchesSearchTerm = [post?.Firstname, post?.Lastname]
            .some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()));

        // Get the reference ID from userDetails
        const referenceID = userDetails.ReferenceID;

        // Check role-based filtering
        const matchesRole =
            userDetails.Role === "Super Admin"
                ? post?.Role === "Territory Sales Associate"
                : userDetails.Role === "Manager"
                    ? post?.Role === "Territory Sales Associate" && post?.Manager === referenceID
                    : userDetails.Role === "Territory Sales Manager"
                        ? post?.Role === "Territory Sales Associate" && post?.TSM === referenceID
                        : userDetails.Role === "Special Access"
                            ? true // Special Access can see all posts
                            : false;

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
                                        <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                                            <h2 className="text-lg font-bold mb-2">Agents</h2>
                                            <p className="text-xs text-gray-600 mb-4">
                                                <strong>Agents</strong> are responsible for managing client relationships,
                                                driving sales, and expanding market reach within their designated territories.
                                                They play a key role in engaging with customers, following up on leads,
                                                and ensuring excellent service. Their performance is evaluated based on
                                                client interactions, successful conversions, and overall contribution to sales growth.
                                            </p>
                                            <SearchFilters
                                                searchTerm={searchTerm}
                                                setSearchTerm={setSearchTerm}
                                                postsPerPage={postsPerPage}
                                                setPostsPerPage={setPostsPerPage}
                                            />
                                            <UsersTable
                                                posts={currentPosts}
                                                handleEdit={handleEdit}
                                                userDetails={userDetails}
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
