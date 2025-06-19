"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";
// Components
import Filters from "../../../components/Companies/GroupCompanies/Filters";
import Table from "../../../components/Companies/GroupCompanies/Table";
// Toast Notifications
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const GroupAccounts: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClientType, setSelectedClientType] = useState("");
    const [startDate, setStartDate] = useState(""); // Default to null
    const [endDate, setEndDate] = useState(""); // Default to null
    const [userDetails, setUserDetails] = useState({
        UserId: "", ReferenceID: "", Firstname: "", Lastname: "", Email: "", Role: "", Department: "", Company: "",
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [postsLoading, setPostsLoading] = useState<boolean>(true);
    const [showSpinner, setShowSpinner] = useState(true);

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
    const fetchAccount = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/ModuleSales/UserManagement/CompanyAccounts/FetchAccount");
            const data = await response.json();
            console.log("Fetched data:", data); // Debugging line
            setPosts(data.data); // Make sure you're setting `data.data` if API response has `{ success: true, data: [...] }`
        } catch (error) {
            toast.error("Error fetching users.");
            console.error("Error Fetching", error);
        } finally {
            setLoading(false);
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

            // Check if the post matches the selected client type
            const matchesClientType = selectedClientType
                ? post?.typeclient === selectedClientType
                : true;

            // Get the reference ID from userDetails
            const referenceID = userDetails.ReferenceID; // Manager's ReferenceID from MongoDB

            // Check the user's role for filtering
            const matchesRole =
                userDetails.Role === "Super Admin"
                    ? true // Super Admin sees all data
                    : userDetails.Role === "Territory Sales Associate" || userDetails.Role === "Territory Sales Manager"
                        ? post?.referenceid === referenceID // TSA and TSM see only their assigned companies
                        : false; // Default false if no match

            // Return the filtered result
            return matchesSearchTerm && isWithinDateRange && matchesClientType && matchesRole;
        })
        : [];

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => (
                        <div className="container mx-auto p-4 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-1">

                                <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                                    <h2 className="text-lg font-bold mb-2">List of Accounts - Company Groups</h2>
                                    <p className="text-xs text-gray-600 mb-4">
                                        This section allows you to filter and search through different company groups.
                                        You can use the search bar to search for company names and apply various filters based on client type and the date range.
                                        The filter options help you narrow down your results efficiently, making it easier to manage and track company groups.
                                    </p>
                                    <Filters
                                        searchTerm={searchTerm}
                                        setSearchTerm={setSearchTerm}
                                    />
                                    <Table
                                        posts={filteredAccounts}
                                    />
                                </div>
                                <ToastContainer className="text-xs" autoClose={1000} />
                            </div>
                        </div>
                    )}
                </UserFetcher>
            </ParentLayout>
        </SessionChecker>
    );
};

export default GroupAccounts;
