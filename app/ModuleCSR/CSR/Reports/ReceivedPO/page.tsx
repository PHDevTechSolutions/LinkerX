"use client";

import React, { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";
import AddReceivedPO from "../../../components/Reports/ReceivedPO/AddReceivedPO";
import SearchFilters from "../../../components/Reports/ReceivedPO/SearchFilters";
import ReceivedPOTable from "../../../components/Reports/ReceivedPO/ReceivedPOTable";
import Pagination from "../../../components/Reports/ReceivedPO/Pagination";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ReceivedPO: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [editPost, setEditPost] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(12);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    const [startDate, setStartDate] = useState("");  // Start date for filtering
    const [endDate, setEndDate] = useState("");  // End date for filtering

    // Fetch accounts from the API
    const fetchAccounts = async () => {
        try {
            const response = await fetch("/api/ModuleCSR/ReceivedPO/FetchReceivedPO");
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

    const filteredAccounts = posts.filter((post) => {
        const isSearchMatch = post.CompanyName.toLowerCase().includes(searchTerm.toLowerCase());
        const isDateInRange =
            (!startDate || new Date(post.createdAt) >= new Date(startDate)) &&
            (!endDate || new Date(post.createdAt) <= new Date(endDate));
        
        return isSearchMatch && isDateInRange;
    });

    // Pagination logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredAccounts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredAccounts.length / postsPerPage);

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
            const response = await fetch(`/api/ModuleCSR/ReceivedPO/DeleteReceivedPO`, {
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
            { header: "Contact Number", key: "contactNumber" },
            { header: "PO Number", key: "ponumber" },
            { header: "Amount", key: "amount" },
            { header: "SO Number", key: "sonumber" },
            { header: "SO Date", key: "sodate" },
            { header: "Payment Terms", key: "paymentterms" },
            { header: "Payment Date", key: "paymentdate" },
            { header: "Delivery Date", key: "deliverydate" },
            { header: "PO Status", key: "postatus" },
            { header: "PO Source", key: "posource" },
            { header: "Remarks", key: "remarks" }
        ];
    
        // Filter data to include only records with "PO Received" remarks
        const filteredData = filteredAccounts.filter(post => post.Remarks === "PO Received");
    
        // Add data to the worksheet
        filteredData.forEach((post) => {
            worksheet.addRow({
                userName: post.userName,
                companyName: post.CompanyName,
                contactNumber: post.ContactNumber,
                ponumber: post.PONUmber,
                amount: post.Amount,
                sonumber: post.SONumber,
                sodate: post.SODate,
                paymentterms: post.PaymentTerms,
                paymentdate: post.PaymentDate,
                deliverydate: post.DeliveryDate,
                postatus: post.POStatus,
                posource: post.POSource,
                remarks: post.Remarks
            });
        });
    
        // Create the Excel file and trigger the download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        saveAs(blob, "po_monitoring.xlsx");
    };
    
    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => (
                        <div className="container mx-auto p-4">
                            <div className="grid grid-cols-1 md:grid-cols-1">
                                {showForm ? (
                                    <AddReceivedPO
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
                                        <h2 className="text-lg font-bold mb-2">Received PO Monitoring</h2>
                                        <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
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
                                            <button onClick={exportToExcel} className="mb-4 px-4 py-2 bg-blue-500 text-white text-xs rounded">Export to Excel</button>
                                            <ReceivedPOTable
                                                posts={currentPosts}
                                                handleEdit={handleEdit}
                                                handleDelete={confirmDelete}
                                                Role={user ? user.Role : ""}
                                            />
                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                setCurrentPage={setCurrentPage}
                                            />
                                            <div className="text-xs mt-2">
                                                Showing {indexOfFirstPost + 1} to {Math.min(indexOfLastPost, filteredAccounts.length)} of {filteredAccounts.length} entries
                                            </div>
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

export default ReceivedPO;
