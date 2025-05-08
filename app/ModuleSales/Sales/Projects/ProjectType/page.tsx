"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";

// Components
import AddPostForm from "../../../components/UserManagement/CompanyAccounts/AddUserForm";
import SearchFilters from "../../../components/Projects/ProjectType/SearchFilters";
import UsersTable from "../../../components/Projects/ProjectType/UsersTable";
import Pagination from "../../../components/Projects/ProjectType/Pagination";

// Toast Notifications
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ListofUser: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [showImportForm, setShowImportForm] = useState(false);
    const [editUser, setEditUser] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClientType, setSelectedClientType] = useState("");
    const [startDate, setStartDate] = useState(""); // Default to null
    const [endDate, setEndDate] = useState(""); // Default to null

    const [userDetails, setUserDetails] = useState({
        UserId: "", Firstname: "", Lastname: "", Email: "", Role: "", Department: "", Company: "", TargetQuota: "", ReferenceID: "",
    });
  
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [showAccessModal, setShowAccessModal] = useState(false);


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
                        Firstname: data.Firstname || "",
                        Lastname: data.Lastname || "",
                        Email: data.Email || "",
                        Role: data.Role || "",
                        Department: data.Department || "",
                        Company: data.Company || "",
                        TargetQuota: data.TargetQuota || "",
                        ReferenceID: data.ReferenceID || "",
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
            const response = await fetch("/api/ModuleSales/Projects/Project/FetchProject");
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

                // Check if the post's reference ID matches the current user's ReferenceID
                const matchesReferenceID =
                    post?.referenceid === userDetails.ReferenceID ||
                    post?.ReferenceID === userDetails.ReferenceID;

                // Return the filtered result
                return matchesSearchTerm && isWithinDateRange && matchesReferenceID;
            })
            .sort(
                (a, b) =>
                    new Date(b.date_created).getTime() -
                    new Date(a.date_created).getTime()
            )
        : [];

    // Handle editing a post
    const handleEdit = (post: any) => {
        setEditUser(post);
        setShowForm(true);
    };

    //const isAllowedUser = userDetails?.Role === "Super Admin" ||
        //(userDetails?.Role === "Territory Sales Associate" && userDetails?.ReferenceID === "JG-NCR-920587");

    //const isRestrictedUser = !isAllowedUser;

    // Automatically show modal if the user is restricted
    //useEffect(() => {
        //setShowAccessModal(isRestrictedUser);
    //}, [isRestrictedUser]);

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => (
                        <div className="container mx-auto p-4 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-1">
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

                                ) : (
                                    <>
                                        <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                                            <h2 className="text-lg font-bold mb-2">Project Type / Business </h2>
                                            <p className="text-xs text-gray-600 mb-4">
                                                The <strong>Project Type / Business</strong> section categorizes company accounts based on the nature of their projects or business focus. Whether sourced through the Sales department, company website, or outreach efforts, each entry is classified to reflect the type of service or industry involved. This structured view helps streamline the management and tracking of business opportunities, ensuring a clearer understanding of client needs and project goals.
                                            </p>
                                            <SearchFilters
                                                searchTerm={searchTerm}
                                                setSearchTerm={setSearchTerm}
                                                startDate={startDate}
                                                setStartDate={setStartDate}
                                                endDate={endDate}
                                                setEndDate={setEndDate}
                                            />
                                            <UsersTable
                                                posts={filteredAccounts}
                                                handleEdit={handleEdit}
                                                TargetQuota={userDetails.TargetQuota}
                                                fetchAccount={fetchAccount}
                                            />
                                        </div>
                                    </>
                                )}

                                {showAccessModal && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 h-screen w-full">
                                        <div className="bg-white p-6 rounded shadow-lg w-96 max-h-full overflow-y-auto">
                                            <h2 className="text-lg font-bold text-red-600 mb-4">🚧 Under Maintenance</h2>
                                            <p className="text-sm text-gray-700 mb-4">
                                                This section is temporarily unavailable for your access level. Please contact your system administrator or try again later.
                                            </p>
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

export default ListofUser;
