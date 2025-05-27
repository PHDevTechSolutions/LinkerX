"use client";

import React, { useState, useEffect } from "react";
// Route for Main Layout
import ParentLayout from "../../components/Layouts/ParentLayout";
// Route for Session
import SessionChecker from "../../components/Session/SessionChecker";
// Route for Fetching Users
import UserFetcher from "../../components/User/UserFetcher";
// Route For Form
import AddFaqs from "../../components/Faqs/Form";
// Route for Search Filters
import SearchFilters from "../../components/Faqs/SearchFilters";
// Route for Table
import DTrackingTable from "../../components/Reports/DTracking/DTrackingTable";

// Toast 
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// Icons
import { CiCirclePlus } from "react-icons/ci";

const ReceivedPO: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [editPost, setEditPost] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
  
    const [startDate, setStartDate] = useState("");  // Start date for filtering
    const [endDate, setEndDate] = useState("");  // End date for filtering

    const [usersList, setUsersList] = useState<any[]>([]);

    const [userDetails, setUserDetails] = useState({
            UserId: "", ReferenceID: "", Firstname: "", Lastname: "", Email: "", Role: "",
        });

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch accounts from the API
    const fetchAccounts = async () => {
        try {
            const response = await fetch("/api/ModuleCSR/Faqs/Fetch");
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            toast.error("Error fetching accounts.");
            console.error("Error fetching accounts:", error);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

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
                        ReferenceID: data.ReferenceID || "",  // <-- Siguraduhin na ito ay may value
                        Firstname: data.Firstname || "",
                        Lastname: data.Lastname || "",
                        Email: data.Email || "",
                        Role: data.Role || "",
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

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/getUsers"); // API endpoint mo
                const data = await response.json();
                setUsersList(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const filteredAccounts = posts
        .filter((post) => {
            const isSearchMatch = post.CompanyName.toLowerCase().includes(searchTerm.toLowerCase());
            const isDateInRange =
                (!startDate || new Date(post.createdAt) >= new Date(startDate)) &&
                (!endDate || new Date(post.createdAt) <= new Date(endDate));

            // Apply role-based filtering
            if (userDetails.Role === "Super Admin" || userDetails.Role === "Admin") {
                // Super Admin & Admin can see all posts
                return isSearchMatch && isDateInRange;
            } else if (userDetails.Role === "Staff") {
                // Staff can only see posts with matching ReferenceID
                return post.ReferenceID === userDetails.ReferenceID && isSearchMatch && isDateInRange;
            }

            return false; // Return false if no matching role
        })
        .map((post) => {
            // Find matching agent by ReferenceID
            const agent = usersList.find((user) => user.ReferenceID === post.ReferenceID);

            return {
                ...post,
                AgentFirstname: agent?.Firstname || "Unknown",
                AgentLastname: agent?.Lastname || "Unknown",
            };
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Sorted by createdAt


    // Edit post function
    const handleEdit = (post: any) => {
        setEditPost(post);
        setShowForm(true);
    };

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => (
                        <div className="container mx-auto p-4">
                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                                {showForm ? (
                                    <AddFaqs
                                        onCancel={() => {
                                            setShowForm(false);
                                            setEditPost(null);
                                        }}
                                        refreshPosts={fetchAccounts}  // Pass the refreshPosts callback
                                        userName={user ? user.userName : ""}
                                        userDetails={{
                                            id: editPost ? editPost.UserId : userDetails.UserId,
                                            Role: user ? user.Role : "",
                                            ReferenceID: user ? user.ReferenceID : "", // <-- Ito ang dapat mong suriin
                                        }}
                                        editPost={editPost}
                                    />
                                ) : (
                                    <> <div className="flex justify-between items-center mb-4">

                                        <button className="bg-blue-800 text-white px-4 text-xs py-2 rounded flex items-center gap-1" onClick={() => setShowForm(true)}>
                                            <CiCirclePlus size={20} />Add Faqs
                                        </button>
                                    </div>
                                        <h2 className="text-lg font-bold mb-2">CSR Frequently Asked Questions</h2>
                                        <p className="text-xs mb-2">This section displays the CSR FAQs (Customer Service Representative Frequently Asked Questions). It provides answers to common inquiries related to CSR processes, ensuring quick access to essential information. If an error occurs, a message will be shown in red. The CSRFaqs component is responsible for rendering the list of frequently asked questions.</p>
                                        <div className="mb-4 p-4 bg-white shadow-md rounded-lg text-gray-900">
                                            <SearchFilters
                                                searchTerm={searchTerm}
                                                setSearchTerm={setSearchTerm}
                                                startDate={startDate}
                                                setStartDate={setStartDate}
                                                endDate={endDate}
                                                setEndDate={setEndDate}
                                            />

                                            <DTrackingTable
                                                posts={filteredAccounts}
                                                handleEdit={handleEdit}
                                            />
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

export default ReceivedPO;
