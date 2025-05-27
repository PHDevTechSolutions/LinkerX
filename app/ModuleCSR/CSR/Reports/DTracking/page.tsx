"use client";

import React, { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";
import AddTracking from "../../../components/Reports/DTracking/AddTracking";
import SearchFilters from "../../../components/Reports/DTracking/SearchFilters";
import DTrackingTable from "../../../components/Reports/DTracking/DTrackingTable";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { CiCirclePlus, CiExport } from "react-icons/ci";

const ReceivedPO: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [editPost, setEditPost] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
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
            const response = await fetch("/api/ModuleCSR/DTracking/FetchTracking");
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

    // Show delete modal
    const confirmDelete = (postId: string) => {
        setPostToDelete(postId);
        setShowDeleteModal(true);
    };

    // Delete post function
    const handleDelete = async () => {
        if (!postToDelete) return;
        try {
            const response = await fetch(`/api/ModuleCSR/DTracking/Delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: postToDelete }),
            });

            if (response.ok) {
                setPosts(posts.filter((post) => post._id !== postToDelete));
                toast.success("Account deleted successfully.");
            } else {
                toast.error("Failed to delete account.");
            }
        } catch (error) {
            toast.error("Failed to delete account.");
            console.error("Error deleting account:", error);
        } finally {
            setShowDeleteModal(false);
            setPostToDelete(null);
        }
    };

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Receive PO");

        // Add headers to the worksheet
        worksheet.columns = [
            { header: "User Name", key: "userName" },
            { header: "Company Name", key: "companyName" },
            { header: "Customer Name", key: "customerName" },
            { header: "Contact Number", key: "contactNumber" },
            { header: "Ticket Type", key: "ticketType" },
            { header: "Ticket Concern", key: "ticketConcern" },
            { header: "Department", key: "department" },
            { header: "Pending Days", key: "pendingDays" },
            { header: "Endorsed Date", key: "endorsedDate" },
            { header: "Closed Date", key: "closedDate" },
            { header: "Tracking Remarks", key: "trackingRemarks" },
            { header: "Tracking Status", key: "trackingStatus" },
        ];

        // Filter data to include only records with "PO Received" remarks
        const filteredData = filteredAccounts.filter(post => post.Department);

        // Add data to the worksheet
        filteredData.forEach((post) => {
            worksheet.addRow({
                userName: post.userName,
                companyName: post.CompanyName,
                customerName: post.CustomerName,
                contactNumber: post.ContactNumber,
                ticketType: post.TicketType,
                ticketConcern: post.TicketConcern,
                department: post.Department,
                pendingDays: post.PendingDays,
                endorsedDate: post.EndorsedDate,
                closedDate: post.ClosedDate,
                trackingRemarks: post.TrackingRemarks,
                trackingStatus: post.TrackingStatus
            });
        });

        // Create the Excel file and trigger the download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        saveAs(blob, "dtracking.xlsx");
    };

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => (
                        <div className="container mx-auto p-4">
                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                                {showForm ? (
                                    <AddTracking
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
                                            <CiCirclePlus size={20} />Add Record
                                        </button>
                                    </div>
                                        <h2 className="text-lg font-bold mb-2">D-Tracking</h2>
                                        <p className="text-xs mb-2">This section provides tracking details for deliveries or distribution (D-Tracking). It helps monitor the status and progress of shipments, ensuring timely and efficient tracking of dispatched items.</p>
                                        <div className="mb-4 p-4 bg-white shadow-md rounded-lg text-gray-900">
                                            <SearchFilters
                                                searchTerm={searchTerm}
                                                setSearchTerm={setSearchTerm}
                                                startDate={startDate}
                                                setStartDate={setStartDate}
                                                endDate={endDate}
                                                setEndDate={setEndDate}
                                            />
                                            <button onClick={exportToExcel} className="mb-4 px-4 py-2 bg-gray-100 shadow-sm text-dark text-xs flex items-center gap-1 rounded"><CiExport size={20} /> Export to Excel</button>
                                            <DTrackingTable
                                                posts={filteredAccounts}
                                                handleEdit={handleEdit}
                                                handleDelete={confirmDelete}
                                            />
                                        </div>
                                    </>
                                )}

                                {showDeleteModal && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]">
                                        <div className="bg-white p-4 rounded shadow-lg">
                                            <h2 className="text-xs font-bold mb-4">Confirm Deletion</h2>
                                            <p className="text-xs">Are you sure you want to delete this account?</p>
                                            <div className="mt-4 flex justify-end">
                                                <button className="bg-red-500 text-white text-xs px-4 py-2 rounded mr-2" onClick={handleDelete}>Delete</button>
                                                <button className="bg-gray-300 text-xs px-4 py-2 rounded" onClick={() => setShowDeleteModal(false)}>Cancel</button>
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

export default ReceivedPO;
