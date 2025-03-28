"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";

// Components
import AddPostForm from "../../../components/Task/DailyActivity/AddUserForm";
import UsersTable from "../../../components/Task/Callback/UsersTable";

// Toast Notifications
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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

    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [modalCompanyName, setModalCompanyName] = useState("");

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

    // Fetch all callbacks from the API
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

    // Check if any callback date matches today's date
    useEffect(() => {
        const checkCallbacks = () => {
            const now = new Date();

            posts.forEach((post) => {
                const callbackDate = new Date(post.callback); // Assuming post.callback is a timestamp

                // Compare the exact date and time (hours and minutes)
                const isSameDate = callbackDate.toDateString() === now.toDateString();
                const isSameTime = callbackDate.getHours() === now.getHours() && callbackDate.getMinutes() === now.getMinutes();

                if (isSameDate && isSameTime) {
                    // Show the modal with the company name
                    setModalCompanyName(post.companyname);
                    setIsModalOpen(true);

                    // Set a timer to close the modal after 30 minutes
                    setTimeout(() => {
                        setIsModalOpen(false);
                    }, 1800000); // 30 minutes
                }
            });
        };

        // Calculate how many milliseconds until the next minute
        const now = new Date();
        const delayUntilNextMinute = 60000 - now.getSeconds() * 1000;

        // Trigger a one-time check at the next exact minute
        const timeout = setTimeout(() => {
            checkCallbacks();
            // Then, continue to check every minute after that
            setInterval(checkCallbacks, 60000);
        }, delayUntilNextMinute);

        return () => {
            clearTimeout(timeout); // Cleanup the timeout
            clearInterval(timeout); // Cleanup the interval when component unmounts
        };
    }, [posts]);


    // Filter users by search term (firstname, lastname)
    const filteredAccounts = Array.isArray(posts)
        ? posts
            .filter((post) => {
                // Ensure typeactivity is either "Outbound Call" or "Inbound Call"
                const isRelevantCall =
                    post?.typeactivity === "Outbound Call" || post?.typeactivity === "Inbound Call";

                // Ensure callback is not null or empty
                const hasCallback = post?.callback && post.callback.trim() !== "";

                // Ensure companyname exists
                const hasCompanyName = !!post?.companyname;

                // Search term filter (company name or callback)
                const matchesSearchTerm =
                    (hasCompanyName &&
                        post.companyname.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (hasCallback && post.callback.toLowerCase().includes(searchTerm.toLowerCase()));

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
                    isRelevantCall && // Must be either Inbound or Outbound Call
                    hasCallback &&
                    hasCompanyName &&
                    matchesSearchTerm &&
                    isWithinDateRange &&
                    matchesClientType &&
                    matchesReferenceID && // Ensure only relevant posts appear
                    matchesRole
                );
            })
            .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime()) // Sort by date_created (newest first)
        : [];

    const currentPosts = filteredAccounts.slice();
    const totalPages = Math.ceil(filteredAccounts.length);


    const confirmDelete = (postId: string) => {
        setPostToDelete(postId);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!postToDelete) return;
        try {
            const response = await fetch(`/api/ModuleSales/Task/DailyActivity/DeleteActivity`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: postToDelete }),
            });

            if (response.ok) {
                setPosts(posts.filter((post) => post.id !== postToDelete));
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
                            <div className="grid grid-cols-1 md:grid-cols-1">
                                {showForm ? (
                                    <></>
                                ) : (
                                    <>
                                        <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                                            <h2 className="text-lg font-bold mb-2">Callback's</h2>
                                            <p className="text-xs text-gray-600 mb-4">
                                                This section displays all the callbacks that are scheduled, along with their set times. You can track the callback timings and stay updated with the upcoming tasks.
                                                The calendar and timer functionality allows for better scheduling and monitoring of each callback, ensuring no callback is missed.
                                            </p>
                                            <UsersTable
                                                posts={currentPosts}
                                                handleDelete={confirmDelete}
                                            />
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
