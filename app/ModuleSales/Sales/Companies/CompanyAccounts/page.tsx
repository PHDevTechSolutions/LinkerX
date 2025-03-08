"use client";
import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";

// Components
import AddPostForm from "../../../components/Companies/CompanyAccounts/AddUserForm";
import SearchFilters from "../../../components/UserManagement/CompanyAccounts/SearchFilters";
import UsersTable from "../../../components/Companies/CompanyAccounts/UsersTable";
import Pagination from "../../../components/UserManagement/CompanyAccounts/Pagination";

// Toast Notifications
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ExcelJS from "exceljs";


// Icons
import { CiSquarePlus, CiImport, CiExport } from "react-icons/ci";

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
        UserId: "", ReferenceID: "", Manager: "", TSM: "", Firstname: "", Lastname: "", Email: "", Role: "", Department: "", Company: "",
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [referenceid, setReferenceID] = useState("");
    const [manager, setManager] = useState("");
    const [tsm, setTsm] = useState("");
    const [status, setstatus] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [jsonData, setJsonData] = useState<any[]>([]);

    // Upload Bulk Company Accounts on Postgres Database 
    // Handle file selection and read data
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = event.target?.result as ArrayBuffer;
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(data);
            const worksheet = workbook.worksheets[0];

            const parsedData: any[] = [];
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return; // Skip header row

                parsedData.push({
                    referenceid,
                    tsm,
                    manager,
                    status,
                    companyname: row.getCell(1).value || "",
                    contactperson: row.getCell(2).value || "",
                    contactnumber: row.getCell(3).value || "",
                    emailaddress: row.getCell(4).value || "",
                    typeclient: row.getCell(5).value || "",
                    address: row.getCell(6).value || "",
                    area: row.getCell(7).value || "",
                });
            });

            console.log("Parsed Excel Data:", parsedData);
            setJsonData(parsedData);
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    // Handle file upload
    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file || jsonData.length === 0) {
            toast.error("Please upload a valid file.");
            return;
        }

        try {
            const response = await fetch("/api/ModuleSales/UserManagement/CompanyAccounts/ImportAccounts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    referenceid,
                    tsm,
                    manager,
                    status,
                    data: jsonData,
                }),
            });

            const result = await response.json();
            if (result.success) {
                toast.success(`${result.insertedCount} records imported successfully!`);
                setFile(null);
                setJsonData([]);
            } else {
                toast.error(result.message || "Import failed.");
            }
        } catch (error) {
            toast.error("Error uploading file.");
        }
    };

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

            // Check if the role matches based on the user's role
            const matchesRole = userDetails.Role === "Super Admin"
                ? true // Super Admin sees all
                : userDetails.Role === "Territory Sales Associate"
                    ? post?.referenceid === referenceID // Manager sees only assigned companies
                    : false; // Default false if no match

            // Check if the post's status is Active
            const isActive = post?.status === 'Active';

            // Return the filtered result, including the Active status check
            return matchesSearchTerm && isWithinDateRange && matchesClientType && matchesRole && isActive;
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
                        <div className="container mx-auto p-4">
                            {showForm ? (
                                <AddPostForm
                                    onCancel={() => {
                                        setShowForm(false);
                                        setEditUser(null);
                                    }}
                                    refreshPosts={fetchAccount} // Pass the refreshPosts callback
                                    userDetails={{
                                        id: editUser ? editUser.id : userDetails.UserId,
                                        referenceid: editUser ? editUser.referenceid : userDetails.ReferenceID,
                                        manager: editUser ? editUser.manager : userDetails.Manager,
                                        tsm: editUser ? editUser.tsm : userDetails.TSM,
                                    }}
                                    editUser={editUser}
                                />

                            ) : showImportForm ? (
                                <div className="bg-white p-4 shadow-md rounded-md">
                                    <h2 className="text-lg font-bold mb-2">Import Accounts</h2>
                                    <form onSubmit={handleFileUpload}>
                                        <div className="flex flex-wrap -mx-4">
                                            <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                                                <label className="block text-xs font-bold mb-2" htmlFor="referenceid">Territory Sales Associate</label>
                                                <input type="text" id="referenceid" value={referenceid} className="w-full px-3 py-2 border rounded text-xs capitalize" readOnly />
                                                <input type="hidden" id="manager" value={manager} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                                                <input type="hidden" id="tsm" value={tsm} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                                            </div>
                                            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                                                <label className="block text-xs font-bold mb-2" htmlFor="referenceid">Status</label>
                                                <select value={status} onChange={(e) => setstatus(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize">
                                                    <option value="">Select Status</option>
                                                    <option value="Active">Active</option>
                                                    <option value="Used">Used</option>
                                                    <option value="Inactive">Inactive</option>
                                                </select>
                                            </div>
                                            <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                                                <label className="block text-xs font-bold mb-2" htmlFor="referenceid">Excel File</label>
                                                <input type="file" className="w-full px-3 py-2 border rounded text-xs" onChange={handleFileChange} />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button type="submit" className="bg-blue-600 text-xs text-white px-4 py-2 rounded">Upload</button>
                                            <button type="button" className="bg-gray-500 text-xs text-white px-4 py-2 rounded" onClick={() => setShowImportForm(false)}>Cancel</button>
                                        </div>
                                    </form>

                                    {/* Display Table if Data is Loaded */}
                                    {jsonData.length > 0 && (
                                        <div className="mt-4">
                                            <h3 className="text-sm font-bold mb-2">Preview Data ({jsonData.length} records)</h3>
                                            <div className="overflow-auto max-h-64 border rounded-md">
                                                <table className="w-full border-collapse">
                                                    <thead>
                                                        <tr className="bg-gray-200 text-xs">
                                                            <th className="border px-2 py-1">Company Name</th>
                                                            <th className="border px-2 py-1">Contact Person</th>
                                                            <th className="border px-2 py-1">Contact Number</th>
                                                            <th className="border px-2 py-1">Email Address</th>
                                                            <th className="border px-2 py-1">Type of Client</th>
                                                            <th className="border px-2 py-1">Address</th>
                                                            <th className="border px-2 py-1">Area</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {jsonData.map((item, index) => (
                                                            <tr key={index} className="text-xs text-center border">
                                                                <td className="border px-2 py-1">{item.companyname}</td>
                                                                <td className="border px-2 py-1">{item.contactperson}</td>
                                                                <td className="border px-2 py-1">{item.contactnumber}</td>
                                                                <td className="border px-2 py-1">{item.emailaddress}</td>
                                                                <td className="border px-2 py-1">{item.typeclient}</td>
                                                                <td className="border px-2 py-1">{item.address}</td>
                                                                <td className="border px-2 py-1">{item.area}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-center mb-4">
                                        <button className="flex items-center gap-1 border bg-white text-black text-xs px-4 py-2 shadow-sm rounded hover:bg-blue-900 hover:text-white transition" onClick={() => setShowForm(true)} >
                                            <CiSquarePlus size={16} /> Add Companies
                                        </button>
                                        <div className="flex gap-2">
                                            <button className="flex items-center gap-1 border bg-white text-black text-xs px-4 py-2 shadow-sm rounded hover:bg-green-800 hover:text-white transition" onClick={() => setShowImportForm(true)}>
                                                <CiImport size={16} /> Import Account
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                                        <h2 className="text-lg font-bold mb-2">Company Accounts</h2>
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
                                            referenceid={referenceid}
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
