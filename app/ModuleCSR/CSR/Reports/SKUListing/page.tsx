"use client";

import React, { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";
import AddSkuListing from "../../../components/Reports/SKUListing/AddSkuListing";
import SkuTable from "../../../components/Reports/SKUListing/SkuTable";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { CiExport } from "react-icons/ci";

const SKUListing: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [editPost, setEditPost] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    const [startDate, setStartDate] = useState("");  // Start date for filtering
    const [endDate, setEndDate] = useState("");  // End date for filtering
    const [userDetails, setUserDetails] = useState({
        UserId: "", ReferenceID: "", Firstname: "", Lastname: "", Email: "", Role: "",
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch accounts from the API
    const fetchAccounts = async () => {
        try {
            const response = await fetch("/api/ModuleCSR/SkuListing/FetchSku");
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

    // Filter accounts based on search term and city address
    const filteredAccounts = posts
        .filter((post) => {
            const remarks = typeof post.Remarks === "string" ? post.Remarks.toLowerCase() : "";

            const isRemarksMatch =
                remarks === "no stocks / insufficient stocks" ||
                remarks === "item not carried" ||
                remarks === "non standard item";

            const isDateInRange =
                (!startDate || new Date(post.createdAt) >= new Date(startDate)) &&
                (!endDate || new Date(post.createdAt) <= new Date(endDate));

            const baseFilters = isRemarksMatch && isDateInRange;

            if (userDetails.Role === "Super Admin" || userDetails.Role === "Admin") {
                return baseFilters;
            }

            if (userDetails.Role === "Staff") {
                return post.ReferenceID === userDetails.ReferenceID && baseFilters;
            }

            return false; // Fallback for unknown roles
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
            const response = await fetch(`/api/ModuleCSR/SkuListing/DeleteSku`, {
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

    // Export to Excel logic
    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("SKU Listings");

        // Add headers to the worksheet
        worksheet.columns = [
            { header: "User Name", key: "userName" },
            { header: "Created At", key: "createdAt" },
            { header: "Company Name", key: "companyName" },
            { header: "Remarks", key: "remarks" },
            { header: "Item Code", key: "itemCode" },
            { header: "Item Description", key: "itemDescription" },
            { header: "Quantity", key: "qtySold" },
            { header: "Sales Agent", key: "salesAgent" }
        ];

        // Filter data to include only records with "PO Received" remarks
        const filteredData = filteredAccounts.filter(post => post.Remarks === "Item Not Carried" || post.Remarks === "No Stocks / Insufficient Stocks" || post.Remarks === "Non Standard Item");

        // Add data to the worksheet
        filteredData.forEach((post) => {
            worksheet.addRow({
                userName: post.userName,
                createdAt: new Date(post.createdAt).toLocaleString(), // Format the date as needed
                companyName: post.CompanyName,
                remarks: post.Remarks,
                itemCode: post.ItemCode,
                itemDescription: post.ItemDescription,
                qtySold: post.QtySold,
                salesAgent: post.SalesAgent
            });
        });

        // Create the Excel file and trigger the download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        saveAs(blob, "sku_listing.xlsx");
    };

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => (
                        <div className="container mx-auto p-4">
                            <div className="grid grid-cols-1 md:grid-cols-1">
                                {showForm ? (
                                    <AddSkuListing
                                        onCancel={() => {
                                            setShowForm(false);
                                            setEditPost(null);
                                        }}
                                        refreshPosts={fetchAccounts}  // Pass the refreshPosts callback
                                        userName={user ? user.userName : ""}
                                        editPost={editPost}
                                    />
                                ) : (
                                    <>
                                        <h2 className="text-lg font-bold mb-2">SKU Listing's</h2>
                                        <p className="text-xs mb-2">This section displays a list of SKUs (Stock Keeping Units) and includes filtering options to refine the data. Users can search by keyword, adjust the number of displayed entries, and filter results within a specific date range. Additionally, an "Export to Excel" button allows users to download the SKU data for further analysis.</p>
                                        <div className="mb-4 p-4 bg-white shadow-md rounded-lg text-gray-900">
                                            <button onClick={exportToExcel} className="mb-4 px-4 py-2 bg-gray-100 shadow-sm text-dark text-xs flex items-center gap-1 rounded"><CiExport size={20} /> Export to Excel</button>
                                            <SkuTable
                                                posts={filteredAccounts}
                                                handleEdit={handleEdit}
                                                handleDelete={confirmDelete}
                                                setPosts={setPosts}
                                                Role={user ? user.Role : ""}
                                            />
                                        </div>
                                    </>
                                )}

                                {showDeleteModal && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
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

export default SKUListing;

