"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";

// Components
import AddPostForm from "../../../components/Task/DailyActivity/AddUserForm";
import UsersTable from "../../../components/Task/ClientCoverageGuide/UsersTable";
import SearchFilters from "../../../components/Task/ClientCoverageGuide/SearchFilters";
import Pagination from "../../../components/UserManagement/ManagerDirectors/Pagination";

// Toast Notifications
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ListofUser: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClientType, setSelectedClientType] = useState("");
    const [startDate, setStartDate] = useState(""); // Default to null
    const [endDate, setEndDate] = useState(""); // Default to null

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
                        UserId: data._id, // Set the user's id here
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

    // Fetch all users from the API
    const fetchAccount = async () => {
        try {
            const response = await fetch("/api/ModuleSales/Task/Callback/FetchProgress");
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
        ? posts
            .filter((post) => {
                // Ensure companyname exists
                const hasCompanyName = !!post?.companyname;

                // Search term filter (company name)
                const matchesSearchTerm =
                    hasCompanyName &&
                    post.companyname.toLowerCase().includes(searchTerm.toLowerCase());

                // Date range filter
                const postDate = post.date_created ? new Date(post.date_created) : null;
                const isWithinDateRange =
                    (!startDate || (postDate && postDate >= new Date(startDate))) &&
                    (!endDate || (postDate && postDate <= new Date(endDate)));

                // Client type filter
                const matchesClientType = selectedClientType
                    ? post?.typeclient === selectedClientType
                    : true;

                // Get the reference ID from userDetails
                const userReferenceID = userDetails.ReferenceID; // Manager's ReferenceID from MongoDB

                // Match reference ID (PostgreSQL "referenceid" or MongoDB "ReferenceID")
                const matchesReferenceID =
                    post?.referenceid === userReferenceID || post?.ReferenceID === userReferenceID;

                // User role filter
                const matchesRole =
                    userDetails.Role === "Super Admin" || userDetails.Role === "Territory Sales Associate";

                // Final filtering condition
                return (
                    hasCompanyName && // Ensure company name exists
                    matchesSearchTerm &&
                    isWithinDateRange &&
                    matchesClientType &&
                    matchesReferenceID && // Ensure only relevant posts appear
                    matchesRole
                );
            })
            .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime()) // Sort by date_created (newest first)
        : [];

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => (
                        <div className="container mx-auto p-4 text-gray-900">
                            {showForm ? (
                                <></>
                            ) : (
                                <>
                                    <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                                        <h2 className="text-lg font-bold mb-2">Client Coverage Guide</h2>
                                        <p className="text-xs text-gray-600 mb-4">
                                            The <strong>Client Coverage Guide</strong> provides a comprehensive overview of all transaction histories for each company. It serves as a detailed record of discussions and agreements made with clients, helping to track important conversations, updates, and transactions. By reviewing this guide, users can quickly access relevant information about each client, ensuring efficient management of customer relations and providing a reliable reference for future interactions.
                                        </p>
                                        <SearchFilters
                                            searchTerm={searchTerm}
                                            setSearchTerm={setSearchTerm}
                                        />
                                        <UsersTable
                                            posts={filteredAccounts}
                                        />
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
