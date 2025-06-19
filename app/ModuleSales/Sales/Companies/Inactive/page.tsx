"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";

// Components
import Form from "../../../components/Companies/CompanyAccounts/Form";
import SearchFilters from "../../../components/Companies/CompanyAccounts/Filters";
import Container from "../../../components/Companies/CompanyAccounts/Container";
import Pagination from "../../../components/UserManagement/CompanyAccounts/Pagination";
import FuturisticSpinner from "../../../components/Spinner/FuturisticSpinner";

// Toast Notifications
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Icons
import { CiImport } from "react-icons/ci";

const InactiveAccounts: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [showImportForm, setShowImportForm] = useState(false);
    const [editUser, setEditUser] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(12);
    const [selectedClientType, setSelectedClientType] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [startDate, setStartDate] = useState(""); // Default to null
    const [endDate, setEndDate] = useState(""); // Default to null

    const [userDetails, setUserDetails] = useState({
        UserId: "", ReferenceID: "", Manager: "", TSM: "", Firstname: "", Lastname: "", Email: "", Role: "", Department: "", Company: "",
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [referenceid, setReferenceID] = useState("");
    const [manager, setManager] = useState("");
    const [tsm, setTsm] = useState("");

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
                        Manager: data.Manager || "",
                        TSM: data.TSM || "",
                        Firstname: data.Firstname || "",
                        Lastname: data.Lastname || "",
                        Email: data.Email || "",
                        Role: data.Role || "",
                        Department: data.Department || "",
                        Company: data.Company || "",
                    });
                    setReferenceID(data.ReferenceID || "");
                    setManager(data.Manager || "");
                    setTsm(data.TSM || "");
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
        ? posts
            .filter((post) => {
                const matchesSearchTerm =
                    post?.companyname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    post?.typeclient?.toLowerCase().includes(searchTerm.toLowerCase());

                const postDate = post?.date_created ? new Date(post.date_created) : null;

                const isWithinDateRange =
                    (!startDate || (postDate && postDate >= new Date(startDate))) &&
                    (!endDate || (postDate && postDate <= new Date(endDate + "T23:59:59")));

                const matchesClientType = selectedClientType
                    ? selectedClientType === "null"
                        ? !post?.typeclient || post?.typeclient === null || post?.typeclient === ""
                        : post?.typeclient === selectedClientType
                    : true;

                const matchesStatus = selectedStatus
                    ? post?.status?.toLowerCase() === selectedStatus.toLowerCase()
                    : true;

                const referenceID = userDetails.ReferenceID;

                const matchesRole =
                    userDetails.Role === "Super Admin" || userDetails.Role === "Special Access"
                        ? true
                        : userDetails.Role === "Territory Sales Associate" || userDetails.Role === "Territory Sales Manager"
                            ? post?.referenceid === referenceID
                            : false;

                const isActiveOrUsed = post?.status === "Inactive";

                return (
                    matchesSearchTerm &&
                    isWithinDateRange &&
                    matchesClientType &&
                    matchesStatus &&
                    matchesRole &&
                    isActiveOrUsed
                );
            })
            .sort((a, b) => {
                const companyNameA = a.companyname?.toLowerCase() || "";
                const companyNameB = b.companyname?.toLowerCase() || "";

                const numFirstA = companyNameA.match(/^\d+/) ? parseInt(companyNameA.match(/^\d+/)[0], 10) : Infinity;
                const numFirstB = companyNameB.match(/^\d+/) ? parseInt(companyNameB.match(/^\d+/)[0], 10) : Infinity;

                if (numFirstA !== numFirstB) {
                    return numFirstA - numFirstB;
                }

                return companyNameA.localeCompare(companyNameB);
            })
        : [];

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredAccounts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredAccounts.length / postsPerPage);

    // Handle editing a post
    const handleEdit = (post: any) => {
        setEditUser(post);
        setShowForm(true);
    };

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => (
                        <>
                            <div className="container mx-auto p-4 text-gray-900">
                                <div className="grid grid-cols-1 md:grid-cols-1">
                                    {/* Backdrop overlay */}
                                    {(showForm || showImportForm) && (
                                        <div
                                            className="fixed inset-0 bg-black bg-opacity-50 z-30"
                                            onClick={() => {
                                                setShowForm(false);
                                                setEditUser(null);
                                                setShowImportForm(false);
                                            }}
                                        ></div>
                                    )}

                                    <div
                                        className={`fixed top-0 right-0 h-full w-full shadow-lg z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto ${(showForm || showImportForm) ? "translate-x-0" : "translate-x-full"
                                            }`}
                                    >
                                        {showForm && (
                                            <>
                                                <Form
                                                    onCancel={() => {
                                                        setShowForm(false);
                                                        setEditUser(null);
                                                    }}
                                                    refreshPosts={fetchAccount}
                                                    userDetails={{
                                                        id: editUser ? editUser.id : userDetails.UserId,
                                                        referenceid: editUser ? editUser.referenceid : userDetails.ReferenceID,
                                                        manager: editUser ? editUser.manager : userDetails.Manager,
                                                        tsm: editUser ? editUser.tsm : userDetails.TSM,
                                                    }}
                                                    editUser={editUser}
                                                />
                                            </>
                                        )}
                                    </div>

                                    <div className="mb-4 p-4 bg-white shadow-md rounded-lg text-gray-900">
                                        <h2 className="text-lg font-bold mb-2">List of Accounts - Inactive</h2>
                                        <p className="text-xs text-gray-600 mb-4">
                                            The <strong>Company Accounts Overview</strong> section displays a comprehensive list of all accounts related to various companies. It allows users to filter accounts based on various criteria like client type, date range, and more, ensuring efficient navigation and analysis of company data. The table below showcases the detailed information about each account.
                                        </p>
                                        <SearchFilters
                                            searchTerm={searchTerm}
                                            setSearchTerm={setSearchTerm}
                                            postsPerPage={postsPerPage}
                                            setPostsPerPage={setPostsPerPage}
                                            selectedClientType={selectedClientType}
                                            setSelectedClientType={setSelectedClientType}
                                            selectedStatus={selectedStatus}
                                            setSelectedStatus={setSelectedStatus}
                                            startDate={startDate}
                                            setStartDate={setStartDate}
                                            endDate={endDate}
                                            setEndDate={setEndDate}
                                        />
                                        <Container
                                            posts={currentPosts}
                                            handleEdit={handleEdit}
                                            referenceid={referenceid}
                                            fetchAccount={fetchAccount}
                                            Role={userDetails.Role}
                                        />
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            setCurrentPage={setCurrentPage}
                                        />

                                        <div className="text-xs mt-2">
                                            Showing {indexOfFirstPost + 1} to{" "}
                                            {Math.min(indexOfLastPost, filteredAccounts.length)} of{" "}
                                            {filteredAccounts.length} entries
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <ToastContainer className="text-xs" autoClose={1000} />
                        </>
                    )}
                </UserFetcher>
            </ParentLayout>
        </SessionChecker>
    );
};

export default InactiveAccounts;