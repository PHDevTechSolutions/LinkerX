"use client";

import React, { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";
import AddTracking from "../../../components/Reports/DTracking/AddTracking";
import SearchFilters from "../../../components/Reports/ReceivedPO/SearchFilters";
import DTrackingTable from "../../../components/Reports/DTracking/DTrackingTable";
import Pagination from "../../../components/Reports/DTracking/Pagination";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { CiCirclePlus, CiExport  } from "react-icons/ci";

const ReceivedPO: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [editPost, setEditPost] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    const [startDate, setStartDate] = useState("");  // Start date for filtering
    const [endDate, setEndDate] = useState("");  // End date for filtering

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
                            <div className="grid grid-cols-1 md:grid-cols-1">
                                {showForm ? (
                                    <AddTracking
                                        onCancel={() => {
                                            setShowForm(false);
                                            setEditPost(null);
                                        }}
                                        refreshPosts={fetchAccounts}  // Pass the refreshPosts callback
                                        userName={user ? user.userName : ""}
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
                                                postsPerPage={postsPerPage}
                                                setPostsPerPage={setPostsPerPage}
                                                startDate={startDate}
                                                setStartDate={setStartDate}
                                                endDate={endDate}
                                                setEndDate={setEndDate}
                                            />
                                            <button onClick={exportToExcel} className="mb-4 px-4 py-2 bg-gray-100 shadow-sm text-dark text-xs flex items-center gap-1 rounded"><CiExport size={20} /> Export to Excel</button>
                                            <DTrackingTable
                                                posts={currentPosts}
                                                handleEdit={handleEdit}
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
