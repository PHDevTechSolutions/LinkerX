"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";

// Components
import Form from "../../../components/Reports/CSRSummary/Form";
import Filters from "../../../components/Reports/NewClientSummary/Filters";
import Table from "../../../components/Reports/NewClientSummary/Table";
import FuturisticSpinner from "../../../components/Spinner/FuturisticSpinner";

// Toast Notifications
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListofUser: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [editUser, setEditUser] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [referenceid, setReferenceID] = useState("");
    const [manager, setManager] = useState("");
    const [tsm, setTsm] = useState("");

    const [userDetails, setUserDetails] = useState({
        UserId: "",
        ReferenceID: "",
        Manager: "",
        TSM: "",
        Firstname: "",
        Lastname: "",
        Email: "",
        Role: "",
        Department: "",
        Company: "",
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
                        UserId: data._id,
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
                } catch (err) {
                    console.error("Error fetching user data:", err);
                    setError("Failed to load user data. Please try again later.");
                } finally {
                    setShowSpinner(false);
                }
            } else {
                setError("User ID is missing.");
                setShowSpinner(false);
            }
        };

        fetchUserData();
    }, []);

    // Fetch all users from the API
    const fetchAccount = async () => {
        setPostsLoading(true);
        try {
            const response = await fetch("/api/ModuleSales/Reports/AccountManagement/FetchSales");
            const data = await response.json();
            console.log("Fetched data:", data); // Debugging line
            setPosts(data.data);
        } catch (error) {
            toast.error("Error fetching users.");
            console.error("Error Fetching", error);
        } finally {
            setPostsLoading(false);
        }
    };

    useEffect(() => {
        fetchAccount();
    }, []);

    if (postsLoading || showSpinner) {
        return (
            <SessionChecker>
                <ParentLayout>
                    <FuturisticSpinner setShowSpinner={setShowSpinner} />
                </ParentLayout>
            </SessionChecker>
        );
    }

    // Filter users by search term (company name), date range, referenceID, and client type
    const filteredAccounts = Array.isArray(posts)
        ? posts
            .filter((post) => {
                const matchesSearchTerm = post?.companyname
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());

                const postDate = post.date_created ? new Date(post.date_created) : null;

                const isWithinDateRange =
                    (!startDate || (postDate && postDate >= new Date(startDate))) &&
                    (!endDate || (postDate && postDate <= new Date(endDate)));

                const matchesReferenceID =
                    post?.referenceid === userDetails.ReferenceID ||
                    post?.ReferenceID === userDetails.ReferenceID;

                const source = post?.source?.toLowerCase();
                const typeCall = post?.typecall?.toLowerCase();

                const isFromCSRInquiries =
                    ["csr inquiry", "outbound - follow-up", "outbound - touchbase"].includes(source) ||
                    typeCall === "touchbase";

                return matchesSearchTerm &&
                    isWithinDateRange &&
                    matchesReferenceID &&
                    isFromCSRInquiries;
            })
            .sort(
                (a, b) =>
                    new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
            )
        : [];

    const handleEdit = (post: any) => {
        setEditUser(post);
        setShowForm(true);
    };

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => (
                        <div className="container mx-auto p-4 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-1">
                                {/* Backdrop overlay */}
                                {showForm && (
                                    <div
                                        className="fixed inset-0 bg-black bg-opacity-50 z-30"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditUser(null);
                                        }}
                                    ></div>
                                )}
                                <div
                                    className={`fixed top-0 right-0 h-full w-full shadow-lg z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto ${showForm ? "translate-x-0" : "translate-x-full"
                                        }`}
                                >
                                    {showForm ? (
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
                                    ) : null}
                                </div>

                                <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                                    <h2 className="text-lg font-bold mb-2">New Client Summary</h2>
                                    <p className="text-xs text-gray-600 mb-4">
                                        This section provides an organized overview of{" "}
                                        <strong>client accounts</strong> handled by the Sales team. It enables users
                                        to efficiently monitor account status, track communications, and manage key
                                        activities and deliverables. The table below offers a detailed summary to
                                        support effective relationship management and ensure client needs are
                                        consistently met.
                                    </p>
                                    <Filters
                                        searchTerm={searchTerm}
                                        setSearchTerm={setSearchTerm}
                                        startDate={startDate}
                                        setStartDate={setStartDate}
                                        endDate={endDate}
                                        setEndDate={setEndDate}
                                    />
                                    <Table posts={filteredAccounts} handleEdit={handleEdit} />
                                </div>

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
