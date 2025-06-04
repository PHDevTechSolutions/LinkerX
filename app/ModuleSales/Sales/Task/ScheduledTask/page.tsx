"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";

// Components
import Filters from "../../../components/Task/ScheduledTask/Filters";
import Main from "../../../components/Task/ScheduledTask/Main";

// Toast Notifications
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Fetch Users
const ListofUser: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [userDetails, setUserDetails] = useState({ UserId: "", Firstname: "", Lastname: "", Manager: "", TSM: "",
        Email: "", Role: "", Department: "", Company: "", TargetQuota: "", ReferenceID: "", });

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
                        Manager: data.Manager || "",
                        TSM: data.TSM || "",
                        Role: data.Role || "",
                        Department: data.Department || "",
                        Company: data.Company || "",
                        TargetQuota: data.TargetQuota || "",
                        ReferenceID: data.ReferenceID || "",
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
            const response = await fetch("/api/ModuleSales/Reports/AccountManagement/FetchActivity");
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
                // Check if the company name matches the search term
                const matchesSearchTerm = post?.companyname
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());

                // Parse the date_created field
                const postDate = post.date_created ? new Date(post.date_created) : null;

                // Check if the post's date is within the selected date range
                const isWithinDateRange =
                    (!startDate || (postDate && postDate >= new Date(startDate))) &&
                    (!endDate || (postDate && postDate <= new Date(endDate)));

                // Check if the post's reference ID matches the current user's ReferenceID
                const matchesReferenceID =
                    post?.referenceid === userDetails.ReferenceID ||
                    post?.ReferenceID === userDetails.ReferenceID;

                // Return the filtered result
                return matchesSearchTerm && isWithinDateRange && matchesReferenceID;
            })
            .sort(
                (a, b) =>
                    new Date(b.date_created).getTime() -
                    new Date(a.date_created).getTime()
            )
        : [];

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => (
                        <div className="container mx-auto p-4 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-1">
                                <>
                                    <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                                        <h2 className="text-lg font-bold mb-2">Scheduled Task</h2>
                                        <p className="text-xs text-gray-600 mb-4">
                                            This section provides an organized overview of <strong>client accounts</strong> handled by the Sales team. It enables users to efficiently monitor account status, track communications, and manage key activities and deliverables. The table below offers a detailed summary to support effective relationship management and ensure client needs are consistently met.
                                        </p>

                                        <Filters
                                            searchTerm={searchTerm}
                                            setSearchTerm={setSearchTerm}
                                            startDate={startDate}
                                            setStartDate={setStartDate}
                                            endDate={endDate}
                                            setEndDate={setEndDate}
                                        />

                                        <Main
                                            posts={filteredAccounts}
                                            userDetails={userDetails}
                                            fetchAccount={fetchAccount}
                                        />
                                    </div>
                                </>
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
