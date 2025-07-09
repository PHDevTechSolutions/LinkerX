"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";
// Components
import AddPostForm from "../../../../ModuleGlobal/components/Taskflow/Progress/Form";
import ImportForm from "../../../../ModuleGlobal/components/Taskflow/Progress/ImportForm";
import SearchFilters from "../../../../ModuleGlobal/components/Taskflow/Progress/Filters";
import UsersTable from "../../../../ModuleGlobal/components/Taskflow/Progress/Main";
import Pagination from "../../../../ModuleGlobal/components/Taskflow/Progress/Pagination";
// Toast Notifications
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// Icons
import { CiImport } from "react-icons/ci";

const ListofUser: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [showImportForm, setShowImportForm] = useState(false);
    const [editUser, setEditUser] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(12);
    const [selectedClientType, setSelectedClientType] = useState("");
    const [startDate, setStartDate] = useState(""); // Default to null
    const [endDate, setEndDate] = useState(""); // Default to null

    const [userDetails, setUserDetails] = useState({
        UserId: "", Firstname: "", Lastname: "", Email: "", Role: "", Department: "", Company: "",
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [referenceid, setreferenceid] = useState("");
    const [tsm, settsm] = useState("");
    const [manager, setmanager] = useState("");
    const [targetquota, settargetquota] = useState("");
    const [managerOptions, setManagerOptions] = useState<{ value: string; label: string }[]>([]);
    const [selectedManager, setSelectedManager] = useState<{ value: string; label: string } | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [TSMOptions, setTSMOptions] = useState<{ value: string; label: string }[]>([]);
    const [selectedTSM, setSelectedTSM] = useState<{ value: string; label: string } | null>(null);
    const [TSAOptions, setTSAOptions] = useState<{ value: string; label: string }[]>([]);
    const [selectedReferenceID, setSelectedReferenceID] = useState<{ value: string; label: string } | null>(null);
    const [filterTSA, setFilterTSA] = useState<string>("");
    const [tsaList, setTsaList] = useState<any[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    
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

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const response = await fetch("/api/manager?Role=Manager");
                if (!response.ok) {
                    throw new Error("Failed to fetch managers");
                }
                const data = await response.json();

                // Use ReferenceID as value
                const options = data.map((user: any) => ({
                    value: user.ReferenceID, // ReferenceID ang isesend
                    label: `${user.Firstname} ${user.Lastname}`, // Pero ang nakikita sa UI ay Name
                }));

                setManagerOptions(options);
            } catch (error) {
                console.error("Error fetching managers:", error);
            }
        };

        fetchManagers();
    }, []);

    useEffect(() => {
        const fetchTSM = async () => {
            try {
                const response = await fetch("/api/fetchtsm?Role=Territory Sales Manager");
                if (!response.ok) {
                    throw new Error("Failed to fetch managers");
                }
                const data = await response.json();

                // Use ReferenceID as value
                const options = data.map((user: any) => ({
                    value: user.ReferenceID, // ReferenceID ang isesend
                    label: `${user.Firstname} ${user.Lastname}`, // Pero ang nakikita sa UI ay Name
                }));

                setTSMOptions(options);
            } catch (error) {
                console.error("Error fetching managers:", error);
            }
        };

        fetchTSM();
    }, []);

    useEffect(() => {
        const fetchTSA = async () => {
            try {
                const response = await fetch("/api/fetchtsa?Role=Territory Sales Associate");
                if (!response.ok) {
                    throw new Error("Failed to fetch agents");
                }
                const data = await response.json();

                // Use ReferenceID as value
                const options = data.map((user: any) => ({
                    value: user.ReferenceID, // ReferenceID ang isesend
                    label: `${user.Firstname} ${user.Lastname}`, // Pero ang nakikita sa UI ay Name
                }));

                setTSAOptions(options);
            } catch (error) {
                console.error("Error fetching agents:", error);
            }
        };

        fetchTSA();
    }, []);

    // Fetch all users from the API
    const fetchAccount = async () => {
        try {
            const response = await fetch("/api/ModuleSales/UserManagement/ProgressLogs/FetchAccount");
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

    useEffect(() => {
        fetch("/api/fetchtsa?Role=Territory Sales Associate")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setTsaList(data);
                } else {
                    console.error("Invalid TSA list format:", data);
                    setTsaList([]);
                }
            })
            .catch((err) => console.error("Error fetching TSA list:", err));
    }, []);

    // Filter users by search term (firstname, lastname)
    const filteredAccounts = Array.isArray(posts)
        ? posts.filter((post) => {
            // ✅ Check if the company name or status matches the search term
            const matchesSearchTerm =
                post?.companyname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post?.referenceid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post?.activitystatus?.toLowerCase().includes(searchTerm.toLowerCase());

            // ✅ Parse the date_created field
            const postDate = post.date_created ? new Date(post.date_created) : null;

            // ✅ Check if the post's date is within the selected date range
            const isWithinDateRange =
                (!startDate || (postDate && postDate >= new Date(startDate))) &&
                (!endDate || (postDate && postDate <= new Date(endDate)));

            // ✅ Check if the post matches the selected client type
            const matchesClientType = selectedClientType
                ? post?.typeclient === selectedClientType
                : true;

            // ✅ Check if the post matches the selected status
            const matchesStatus = selectedStatus ? post?.activitystatus === selectedStatus : true;

            // ✅ Check if the post matches the selected TSA
            const matchesTSA = filterTSA ? post?.referenceid === filterTSA : true;

            // ✅ Return the filtered result
            return (
                matchesSearchTerm &&
                isWithinDateRange &&
                matchesClientType &&
                matchesStatus &&
                matchesTSA
            );
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
                        <div className="container mx-auto p-4 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                                {showForm ? (
                                    <AddPostForm
                                        onCancel={() => {
                                            setShowForm(false);
                                            setEditUser(null);
                                        }}
                                        refreshPosts={fetchAccount}  // Pass the refreshPosts callback
                                        userDetails={{ id: editUser ? editUser.id : userDetails.UserId }}  // Ensure id is passed correctly
                                        editUser={editUser}
                                    />
                                ) : showImportForm ? (
                                    <ImportForm
                                        isEditing={isEditing}
                                        manager={manager}
                                        setmanager={setmanager}
                                        selectedManager={selectedManager}
                                        setSelectedManager={setSelectedManager}
                                        managerOptions={managerOptions}
                                        tsm={tsm}
                                        settsm={settsm}
                                        selectedTSM={selectedTSM}
                                        setSelectedTSM={setSelectedTSM}
                                        TSMOptions={TSMOptions}
                                        referenceid={referenceid}
                                        setreferenceid={setreferenceid}
                                        selectedReferenceID={selectedReferenceID}
                                        setSelectedReferenceID={setSelectedReferenceID}
                                        TSAOptions={TSAOptions}
                                        targetquota={targetquota}
                                        settargetquota={settargetquota}
                                        setShowImportForm={setShowImportForm}
                                    />
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex gap-2">
                                                <button className="flex items-center gap-1 border bg-white text-black text-xs px-4 py-2 shadow-sm rounded hover:bg-green-800 hover:text-white transition" onClick={() => setShowImportForm(true)}>
                                                    <CiImport size={16} /> Import Account
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                                            <h2 className="text-lg font-bold mb-2">Progress Logs</h2>
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
                                                filterTSA={filterTSA}
                                                setFilterTSA={setFilterTSA}
                                                tsaList={tsaList}
                                            />

                                            <UsersTable
                                                posts={currentPosts}
                                                handleEdit={handleEdit}
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

export default ListofUser;
