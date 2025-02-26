"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";

// Components
import AddPostForm from "../../../components/Task/DailyActivity/AddUserForm";
import SearchFilters from "../../../components/Task/DailyActivity/SearchFilters";
import UsersTable from "../../../components/Task/DailyActivity/UsersTable";

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
    const [currentPage, setCurrentPage] = useState("");
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
            const response = await fetch("/api/ModuleSales/Task/DailyActivity/FetchTask");
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

              // Check if the post matches the selected client type
              const matchesClientType = selectedClientType
                  ? post?.typeclient === selectedClientType
                  : true;

              // Get the reference ID from userDetails
              const referenceID = userDetails.ReferenceID; // Manager's ReferenceID from MongoDB

              // Check the user's role for filtering
              const matchesRole =
                  userDetails.Role === "Super Admin" || userDetails.Role === "Territory Sales Associate"
                      ? true // Both Super Admin and TSA can see the posts
                      : false; // Default false if no match

              // Return the filtered result
              return matchesSearchTerm && isWithinDateRange && matchesClientType && matchesRole;
          })
          .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime()) // Sort by date_created in descending order
    : [];

    const currentPosts = filteredAccounts.slice();
    const totalPages = Math.ceil(filteredAccounts.length);

    // Handle editing a post
    const handleEdit = (post: any) => {
        setEditUser(post);
        setShowForm(true);
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const response = await fetch("/api/ModuleSales/Task/DailyActivity/UpdateStatus", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, activitystatus: newStatus }),
            });
    
            if (response.ok) {
                toast.success("Status updated successfully.");
                fetchAccount(); // Auto-refresh table after update
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || "Failed to update status.");
            }
        } catch (error) {
            toast.error("Failed to update status.");
            console.error("Error updating status:", error);
        }
    };

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
                        <div className="container mx-auto p-4">
                            {showForm ? (
                                <AddPostForm
                                    onCancel={() => {
                                        setShowForm(false);
                                        setEditUser(null);
                                    }}
                                    refreshPosts={fetchAccount}  // Pass the refreshPosts callback
                                    userDetails={{
                                        id: editUser ? editUser.id : userDetails.UserId,
                                        referenceid: editUser ? editUser.referenceid : userDetails.ReferenceID,
                                        manager: editUser ? editUser.manager : userDetails.Manager,
                                        tsm: editUser ? editUser.tsm : userDetails.TSM,
                                    }}   // Ensure id is passed correctly
                                    editUser={editUser}
                                />
                            ) : (
                                <>
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                className="flex items-center gap-1 border bg-white text-black text-xs px-4 py-2 shadow-sm rounded hover:bg-blue-900 hover:text-white transition"
                                                onClick={() => setShowForm(true)}
                                            >
                                                <CiSquarePlus size={16} /> Create Task
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                                        <h2 className="text-lg font-bold mb-2">My Task</h2>
                                        <SearchFilters
                                            searchTerm={searchTerm}
                                            setSearchTerm={setSearchTerm}
                                            selectedClientType={selectedClientType}
                                            setSelectedClientType={setSelectedClientType}
                                            startDate={startDate}
                                            setStartDate={setStartDate}
                                            endDate={endDate}
                                            setEndDate={setEndDate}
                                        />
                                        <UsersTable
                                            posts={currentPosts}
                                            handleEdit={handleEdit}
                                            handleStatusUpdate={handleStatusUpdate}
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

                            <ToastContainer className="text-xs" autoClose={1000} />
                        </div>
                    )}
                </UserFetcher>
            </ParentLayout>
        </SessionChecker>
    );
};

export default ListofUser;
