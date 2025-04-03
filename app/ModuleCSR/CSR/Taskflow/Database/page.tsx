"use client"; // This should be at the top if you're using Next.js 13 or later with the app directory.

import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";

import SearchFilters from "../../../components/Database/SearchFilters";
import OutboundTable from "../../../components/Taskflow/Database/UsersTable";
import Pagination from "../../../components/Database/Pagination";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ExcelJS from 'exceljs';
import { CiExport } from "react-icons/ci";

// Main Page Component
const OutboundCallPage: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTSA, setselectedTSA] = useState("");
    const [selectedClientType, setSelectedClientType] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [usersList, setUsersList] = useState<any[]>([]);
    const [userDetails, setUserDetails] = useState({
        UserId: "", ReferenceID: "", Firstname: "", Lastname: "", Email: "", Role: "",
    });

    const [showAccessModal, setShowAccessModal] = useState(false);
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

    const fetchData = async () => {
        try {
            const response = await fetch("/api/ModuleSales/Companies/CompanyAccounts/FetchAllAccount");
            const data = await response.json();
            setPosts(data.data);
        } catch (error) {
            toast.error("Error fetching progress.");
            console.error("Error Fetching", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Fetch users from MongoDB or PostgreSQL
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

    // Filter posts based on search and selected client type
    const filteredPosts = posts
        .filter((post) => {
            const accountName = post.companyname ? post.companyname.toLowerCase() : '';
            const AgentFirstname = post.AgentFirstname ? post.AgentFirstname.toLowerCase() : '';

            const matchesSearch = accountName.includes(searchTerm.toLowerCase()) ||
                AgentFirstname.includes(searchTerm.toLowerCase());

            const matchesClientType = selectedClientType ? post.typeclient === selectedClientType : true;

            // Date range filtering
            const postStartDate = post.startdate ? new Date(post.startdate) : null;
            const postEndDate = post.enddate ? new Date(post.enddate) : null;
            const isWithinDateRange = (!startDate || (postStartDate && postStartDate >= new Date(startDate))) &&
                (!endDate || (postEndDate && postEndDate <= new Date(endDate)));

            return matchesSearch && matchesClientType && isWithinDateRange;
        })
        .map((post) => {
            // Hanapin ang Agent na may parehong ReferenceID sa usersList
            const agent = usersList.find((user) => user.ReferenceID === post.referenceid);

            // Hanapin ang manager na may parehong ReferenceID sa usersList
            const salesmanager = usersList.find((user) => user.ReferenceID === post.tsm);

            return {
                ...post,
                AgentFirstname: agent ? agent.Firstname : "Unknown",
                AgentLastname: agent ? agent.Lastname : "Unknown",
                ManagerFirstname: salesmanager ? salesmanager.Firstname : "Unknown",
                ManagerLastname: salesmanager ? salesmanager.Lastname : "Unknown",
            };
        });

    // Pagination logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const exportToExcel = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Outbound Calls");

        // Set column headers
        worksheet.columns = [
            { header: 'TSA Fullname', key: 'fullname', width: 20 },
            { header: 'Company Name', key: 'account_name', width: 20 },
            { header: 'Contact Person', key: 'contact_person', width: 20 },
            { header: 'Contact No', key: 'contact_number', width: 20 },
            { header: 'Email.', key: 'email', width: 20 },
            { header: 'Type of Client', key: 'type_of_client', width: 20 },
            { header: 'Address', key: 'address', width: 20 },
        ];

        // Loop through all filtered posts to ensure the full set of data is exported
        filteredPosts.forEach((post) => {
            worksheet.addRow({
                fullname: post.fullname,
                account_name: post.account_name,
                contact_person: post.contact_person,
                contact_number: post.contact_number,
                email: post.email,
                type_of_client: post.type_of_client,
                address: post.address,
            });
        });

        // Save to file
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "database.xlsx";
            link.click();
        });
    };

    //const isRestrictedUser =
        //userDetails?.Role !== "Super Admin" && userDetails?.ReferenceID !== "LR-CSR-849432";

    // Automatically show modal if the user is restricted
    //useEffect(() => {
        //if (isRestrictedUser) {
            //setShowAccessModal(true);
        //} else {
            //setShowAccessModal(false);
        //}
    //}, [isRestrictedUser]);

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(userName) => (
                        <div className="container mx-auto p-4 relative">
                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                                <h2 className="text-lg font-bold mb-2">Account Records Management</h2>
                                <p className="text-xs mb-2">
                                    This section displays the Account Management Database, which serves as a central hub for storing and managing account-related records. It provides an organized way to track and update account details efficiently.
                                </p>

                                {/* Display total entries */}
                                <div className="mb-4 text-xs">
                                    Total Entries: {filteredPosts.length}
                                </div>

                                <div className="mb-4 p-4 bg-white shadow-md rounded-md text-gray-900">
                                    <SearchFilters
                                        searchTerm={searchTerm}
                                        setSearchTerm={setSearchTerm}
                                        selectedTSA={selectedTSA}
                                        setselectedTSA={setselectedTSA}
                                        selectedClientType={selectedClientType}
                                        setSelectedClientType={setSelectedClientType}
                                        selectedStatus={selectedStatus}
                                        setSelectedStatus={setSelectedStatus}
                                        postsPerPage={postsPerPage}
                                        setPostsPerPage={setPostsPerPage}
                                        startDate={startDate}
                                        setStartDate={setStartDate}
                                        endDate={endDate}
                                        setEndDate={setEndDate}
                                    />
                                    <button onClick={exportToExcel} className="mb-4 px-4 py-2 bg-gray-100 shadow-sm text-dark text-xs flex items-center gap-1 rounded"><CiExport size={20} /> Export to Excel</button>

                                    <OutboundTable posts={currentPosts} />
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        setCurrentPage={setCurrentPage}
                                    />
                                </div>

                                {showAccessModal && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 rounded-md">
                                        <div className="bg-white p-6 rounded shadow-lg w-96">
                                            <h2 className="text-lg font-bold text-red-600 mb-4">⚠️ On Migration</h2>
                                            <p className="text-sm text-gray-700 mb-4">
                                                You do not have the  necessary permissions to perform this action.
                                                Only <strong>Super Admin</strong> or <strong>Leroux Y Xchire</strong> can access this section.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <ToastContainer />
                            </div>
                        </div>
                    )}
                </UserFetcher>
            </ParentLayout>
        </SessionChecker>
    );
};

export default OutboundCallPage;
