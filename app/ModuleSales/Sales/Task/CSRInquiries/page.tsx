"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";

// Components
import AddPostForm from "../../../components/UserManagement/CompanyAccounts/AddUserForm";
import SearchFilters from "../../../components/Task/CSRInquiries/SearchFilters";
import UsersTable from "../../../components/Task/CSRInquiries/UsersTable";
import Pagination from "../../../components/UserManagement/CompanyAccounts/Pagination";

// Toast Notifications
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ListofUser: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [showImportForm, setShowImportForm] = useState(false);
    const [editUser, setEditUser] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(12);
    const [selectedClientType, setSelectedClientType] = useState("");
    const [startDate, setStartDate] = useState(""); // Default to null
    const [endDate, setEndDate] = useState(""); // Default to null

    const [userDetails, setUserDetails] = useState({
        UserId: "", Firstname: "", Lastname: "", Email: "", Role: "", Department: "", Company: "", TargetQuota: "",
    });
    const [TargetQuota, setTargetQuota] = useState("");
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
                        Firstname: data.Firstname || "",
                        Lastname: data.Lastname || "",
                        Email: data.Email || "",
                        Role: data.Role || "",
                        Department: data.Department || "",
                        Company: data.Company || "",
                        TargetQuota: data.TargetQuota || "",
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
    const fetchAccount = async () => {
        try {
            const response = await fetch("/api/ModuleSales/Task/CSRInquiries/FetchInquiries");
            const data = await response.json();
            console.log("Fetched data:", data); // Debugging line
            setPosts(data.data); // Make sure you're setting `data.data` if API response has `{ success: true, data: [...] }`
        } catch (error) {
            toast.error("Error fetching users.");
            console.error("Error Fetching", error);
        }
    };

    useEffect(() => {
        fetchAccount();
    }, []);

    // Filter users by search term (firstname, lastname)
    const filteredAccounts = Array.isArray(posts)
        ? posts.filter((post) => {
            // Check if the company name matches the search term
            const matchesSearchTerm = post?.companyname?.toLowerCase().includes(searchTerm.toLowerCase());

            // Parse the date_created field
            const postDate = post.date_created ? new Date(post.date_created) : null;

            // Check if the post's date is within the selected date range
            const isWithinDateRange = (
                (!startDate || (postDate && postDate >= new Date(startDate))) &&
                (!endDate || (postDate && postDate <= new Date(endDate)))
            );

            // Return the filtered result
            return matchesSearchTerm && isWithinDateRange;
        }).sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime()) // Sort by date_created (newest first)
        : [];

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredAccounts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredAccounts.length / postsPerPage);

    // Handle editing a post
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
                            {showForm ? (
                                <AddPostForm
                                    onCancel={() => {
                                        setShowForm(false);
                                        setEditUser(null);
                                    }}
                                    refreshPosts={fetchAccount}  // Pass the refreshPosts callback
                                    userDetails={{ id: editUser ? editUser.id : userDetails.UserId }}  // Ensure id is passed correctly
                                    editUser={editUser}
                                />

                            ) : (
                                <>
                                    <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                                        <h2 className="text-lg font-bold mb-2">CSR Inquiries</h2>
                                        <p className="text-xs text-gray-600 mb-4">
                                            The table under <strong>CSR Inquiries</strong> displays all company accounts that have been endorsed by the CSR department. These accounts come from various sources, including the company website and other channels. This section serves as a comprehensive record of all CSR-endorsed inquiries and transactions, allowing users to track and manage client interactions effectively.
                                        </p>
                                        <SearchFilters
                                            searchTerm={searchTerm}
                                            setSearchTerm={setSearchTerm}
                                            postsPerPage={postsPerPage}
                                            setPostsPerPage={setPostsPerPage}
                                            startDate={startDate}
                                            setStartDate={setStartDate}
                                            endDate={endDate}
                                            setEndDate={setEndDate}
                                        />
                                        <UsersTable
                                            posts={currentPosts}
                                            handleEdit={handleEdit}
                                            TargetQuota={userDetails.TargetQuota}
                                            fetchAccount={fetchAccount}
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
                    )}
                </UserFetcher>
            </ParentLayout>
        </SessionChecker>
    );
};

export default ListofUser;
