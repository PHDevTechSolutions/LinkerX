"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";

// Components
import AddPostForm from "../../../components/ClientActivityBoard/ListofCompanies/AddUserForm";
import SearchFilters from "../../../components/ClientActivityBoard/ListofCompanies/SearchFilters";
import UsersTable from "../../../components/ClientActivityBoard/ListofCompanies/UsersTable";
import Pagination from "../../../components/ClientActivityBoard/ListofCompanies/Pagination";

// Toast Notifications
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ExcelJS from "exceljs";


// Icons
import { CiExport  } from "react-icons/ci";

const ListofUser: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [showImportForm, setShowImportForm] = useState(false);
    const [editUser, setEditUser] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    const [selectedClientType, setSelectedClientType] = useState("");
    const [startDate, setStartDate] = useState(""); // Default to null
    const [endDate, setEndDate] = useState(""); // Default to null

    const [userDetails, setUserDetails] = useState({
        UserId: "", ReferenceID: "", Firstname: "", Lastname: "", Email: "", Role: "", Department: "", Company: "",
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
            const response = await fetch("/api/ModuleSales/UserManagement/CompanyAccounts/FetchAccount");
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
    ? posts.filter((post) => {
        // Check if the company name matches the search term
        const matchesSearchTerm = post?.companyname?.toLowerCase().includes(searchTerm.toLowerCase());

        // Parse the date_created field
        const postDate = post.date_created ? new Date(post.date_created) : null;

        // Check if the post's date is within the selected date range
        const isWithinDateRange = (
            (!startDate || (postDate && postDate >= new Date(startDate))) &&
            (!endDate || (postDate && postDate <= new Date(endDate)))
        );

        // Check if the post matches the selected client type
        const matchesClientType = selectedClientType
            ? post?.typeclient === selectedClientType
            : true;

        // Get the reference ID from userDetails
        const referenceID = userDetails.ReferenceID; // Manager's ReferenceID from MongoDB

        // Check role-based filtering
        const matchesRole = userDetails.Role === "Super Admin"
            ? true // Super Admin sees all
            : userDetails.Role === "Manager"
            ? post?.manager === referenceID // Manager sees only assigned companies
            : userDetails.Role === "Territory Sales Manager"
            ? post?.tsm === referenceID // Territory Sales Manager sees assigned companies
            : false; // Default false if no match

        // Return the filtered result
        return matchesSearchTerm && isWithinDateRange && matchesClientType && matchesRole;
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

    const exportToExcel = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Company Accounts");
      
        // Set column headers
        worksheet.columns = [
          { header: 'companyname', key: 'companyname', width: 20 },
          { header: 'contactperson', key: 'contactperson', width: 20 },
          { header: 'contactnumber', key: 'contactnumber', width: 20 },
          { header: 'emailaddress', key: 'emailaddress', width: 20 },
          { header: 'typeclient', key: 'typeclient', width: 20 },
          { header: 'address', key: 'address', width: 20 },
          { header: 'area', key: 'area', width: 20 },
        ];
      
        // Loop through all filtered posts to ensure the full set of data is exported
        filteredAccounts.forEach((post) => {
          worksheet.addRow({
            companyname: post.companyname,
            contactperson: post.contactperson,
            contactnumber: post.contactnumber,
            emailaddress: post.emailaddress,
            typeclient: post.typeclient,
            address: post.address,
            area: post.area
          });
        });
      
        // Save to file
        workbook.xlsx.writeBuffer().then((buffer) => {
          const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "CompanyAccounts.xlsx";
          link.click();
        });
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
                                    userDetails={{ id: editUser ? editUser.id : userDetails.UserId }}  // Ensure id is passed correctly
                                    editUser={editUser}
                                />
                            ) : (
                                <>
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex gap-2">
                                            <button onClick={exportToExcel} className="flex items-center gap-1 border bg-white text-black text-xs px-4 py-2 shadow-sm rounded hover:bg-orange-500 hover:text-white transition">
                                                <CiExport size={16} /> Export
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                                        <h2 className="text-lg font-bold mb-2">Company Accounts Subject for Deletion</h2>
                                        <SearchFilters
                                            searchTerm={searchTerm}
                                            setSearchTerm={setSearchTerm}
                                            postsPerPage={postsPerPage}
                                            setPostsPerPage={setPostsPerPage}
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
                    )}
                </UserFetcher>
            </ParentLayout>
        </SessionChecker>
    );
};

export default ListofUser;
