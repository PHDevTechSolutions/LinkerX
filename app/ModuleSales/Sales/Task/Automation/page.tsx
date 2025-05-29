"use client";
import React, { useState, useEffect, useRef } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";

// Components
import AddManualForm from "../../../components/Task/DailyActivity/AddManualForm";
import PersonalActivity from "../../../components/Automation/PersonalActivity";
import SearchFilters from "../../../components/Task/DailyActivity/SearchFilters";
import UsersTable from "../../../components/Task/DailyActivity/UsersTable";

// Toast Notifications
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Icons
import { CiSquarePlus, CiCircleRemove, CiTrash } from "react-icons/ci";
import { PiHandTapThin } from "react-icons/pi";

// Function to get formatted Manila timestamp
const getFormattedTimestamp = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    };

    // Get Manila time correctly formatted
    const manilaTimeStr = new Intl.DateTimeFormat("en-US", options).format(now);
    const [month, day, year, hour, minute, second] = manilaTimeStr.match(/\d+/g)!;

    // Return Manila date in `YYYY-MM-DDTHH:MM:SS` format
    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
};

interface Company {
    companyname: string;
    referenceid: string;
    tsm: string;
    manager: string;
    typeclient: string;
    contactnumber: string;
    contactperson: string;
    emailaddress: string;
    address: string;
    area: string;
    remarks: string;
    typeactivity: string;
    startdate: string;
    enddate: string;
    status: string;
    id?: number;
    [key: string]: any;
}

interface UserDetails {
    ReferenceID: string;
}

const ListofUser: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [editUser, setEditUser] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [post, setPost] = useState<Company[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClientType, setSelectedClientType] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    const [userDetails, setUserDetails] = useState({
        UserId: "", ReferenceID: "", Manager: "", TSM: "", Firstname: "", Lastname: "", Email: "", Role: "", Department: "", Company: "", TargetQuota: "",
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showPersonalForm, setShowPersonalForm] = useState(false);
    const [activitystatus, setactivitystatus] = useState("");
    const [activityremarks, setactivityremarks] = useState("");
    const [startdate, setstartdate] = useState("");
    const [enddate, setenddate] = useState("");
    const [referenceid, setreferenceid] = useState(userDetails.ReferenceID);
    const [tsm, settsm] = useState(userDetails.TSM);
    const [manager, setmanager] = useState(userDetails.Manager);
    const [timeDuration, setTimeDuration] = useState("");

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
                        TargetQuota: data.TargetQuota || "",
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
            const response = await fetch("/api/ModuleSales/Task/DailyActivity/FetchTask");
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

    const filteredAccounts = Array.isArray(posts)
        ? posts
            .filter((post) => {
                const matchesSearchTerm =
                    (post?.companyname?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (post?.activitystatus?.toLowerCase().includes(searchTerm.toLowerCase()));

                const postDate = post?.date_created ? new Date(post.date_created) : null;

                const isWithinDateRange =
                    (!startDate || (postDate && postDate >= new Date(startDate))) &&
                    (!endDate || (postDate && postDate <= new Date(endDate)));

                const matchesClientType = selectedClientType
                    ? post?.typeclient === selectedClientType
                    : true;

                const matchesStatus = selectedStatus
                    ? post?.activitystatus === selectedStatus
                    : true;

                // ReferenceID check based on role
                const matchesReferenceID =
                    userDetails.Role === "Special Access" || userDetails.Role === "Super Admin"
                        ? true // See all
                        : post?.referenceid === userDetails.ReferenceID || post?.ReferenceID === userDetails.ReferenceID;

                // Valid role check
                const matchesRole =
                    userDetails.Role === "Super Admin" ||
                    userDetails.Role === "Special Access" ||
                    userDetails.Role === "Territory Sales Associate" ||
                    userDetails.Role === "Territory Sales Manager";

                return (
                    matchesSearchTerm &&
                    isWithinDateRange &&
                    matchesClientType &&
                    matchesStatus &&
                    matchesReferenceID &&
                    matchesRole
                );
            })
            .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
        : [];

    const currentPosts = filteredAccounts.slice();
    const totalPages = Math.ceil(filteredAccounts.length);

    // Set start date when the component mounts
    useEffect(() => {
        setstartdate(getFormattedTimestamp());
    }, []);

    // Handle button click to set start date
    const handleButtonClick = () => {
        setstartdate(getFormattedTimestamp());
        setShowPersonalForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activitystatus || !activityremarks) {
        toast.error("Please fill in all fields before submitting.");
        return;
    }

    setLoading(true);
    try {
        const response = await fetch("/api/ModuleSales/Task/DailyActivity/AddActivity", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                activitystatus,
                activityremarks,
                startdate,
                enddate,
                referenceid,
                tsm,
                manager,
            }),
        });

        if (response.ok) {
            toast.success("Activity submitted successfully!");
            setShowPersonalForm(false); // Close the form
            setactivitystatus("");
            setactivityremarks("");
            fetchAccount();  // <-- Refresh data here after submit
        } else {
            const errorData = await response.json();
            toast.error(errorData.error || "Failed to submit activity.");
        }
    } catch (err) {
        console.error("Submission Error:", err);
        toast.error("Something went wrong. Please try again.");
    } finally {
        setLoading(false);
    }
};


    useEffect(() => {
        if (userDetails) {
            // Update state only if the value exists in userDetails
            if (userDetails.ReferenceID) {
                setreferenceid(userDetails.ReferenceID);
            }
            if (userDetails.TSM) {
                settsm(userDetails.TSM);
            }
            if (userDetails.Manager) {
                setmanager(userDetails.Manager);
            }
        }
    }, [userDetails]); // Only trigger when userDetails changes

    const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTime = e.target.value;
        setTimeDuration(selectedTime);
        calculateEndDate(selectedTime);
    };

    const calculateEndDate = (duration: string) => {
        if (!startdate) return;

        // Convert `startdate` string into a Date object (Manila time)
        const start = new Date(startdate);

        // Ensure the start date is correctly in Manila timezone
        const manilaDate = new Date(
            start.getFullYear(),
            start.getMonth(),
            start.getDate(),
            start.getHours(),
            start.getMinutes(),
            start.getSeconds()
        );

        // Adjust time based on selected duration
        switch (duration) {
            case "1 Minute":
                manilaDate.setMinutes(manilaDate.getMinutes() + 1);
                break;
            case "5 Minutes":
                manilaDate.setMinutes(manilaDate.getMinutes() + 5);
                break;
            case "10 Minutes":
                manilaDate.setMinutes(manilaDate.getMinutes() + 10);
                break;
            case "15 Minutes":
                manilaDate.setMinutes(manilaDate.getMinutes() + 15);
                break;
            case "20 Minutes":
                manilaDate.setMinutes(manilaDate.getMinutes() + 20);
                break;
            case "30 Minutes":
                manilaDate.setMinutes(manilaDate.getMinutes() + 30);
                break;
            case "1 Hour":
                manilaDate.setHours(manilaDate.getHours() + 1);
                break;
            case "2 Hours":
                manilaDate.setHours(manilaDate.getHours() + 2);
                break;
            case "3 Hours":
                manilaDate.setHours(manilaDate.getHours() + 3);
                break;
            default:
                return;
        }

        // Ensure correct formatting for datetime-local input
        const formattedEndDate = `${manilaDate.getFullYear()}-${String(manilaDate.getMonth() + 1).padStart(2, '0')}-${String(manilaDate.getDate()).padStart(2, '0')}T${String(manilaDate.getHours()).padStart(2, '0')}:${String(manilaDate.getMinutes()).padStart(2, '0')}`;

        setenddate(formattedEndDate);
    };

    // Handle editing a post
    const handleEdit = (post: any) => {
        setEditUser(post); // Set editUser to populate form fields
        setSelectedCompany({
            companyname: post.companyname || "",
            typeclient: post.typeclient || "",
            contactperson: post.contactperson || "",
            contactnumber: post.contactnumber || "",
            emailaddress: post.emailaddress || "",
            address: post.address || "",
            area: post.area || "",
            referenceid: post.referenceid || "",
            tsm: post.tsm || "",
            manager: post.manager || "",
            remarks: post.remarks || "",
            status: post.status || "",
            typeactivity: post.typeactivity || "", // ✅ Added missing field
            startdate: post.startdate || "",       // ✅ Added missing field
            enddate: post.enddate || "",           // ✅ Added missing field
        });
        setShowForm(true); // Show the AddPostForm with populated data
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const response = await fetch("/api/ModuleSales/Task/DailyActivity/UpdateStatus", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, activitystatus: newStatus }),
            });

            if (response.ok) {
                toast.success("Status updated successfully.");
                fetchAccount(); // Auto-refresh table after update
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || "Failed to update status.");
            }
        } catch (error) {
            toast.error("Failed to update status.");
            console.error("Error updating status:", error);
        }
    };

    const confirmDelete = (postId: string) => {
        setPostToDelete(postId);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!postToDelete) return;
        try {
            const response = await fetch(`/api/ModuleSales/Task/DailyActivity/DeleteActivity`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: postToDelete }),
            });

            if (response.ok) {
                setPosts(posts.filter((post) => post.id !== postToDelete));
                toast.success("Post deleted successfully.");
            } else {
                toast.error("Failed to delete post.");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete post.");
        } finally {
            setShowDeleteModal(false);
            setPostToDelete(null);
        }
    };

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => (
                        <div className="container mx-auto p-4 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-1">
                                {showForm ? (
                                    <AddManualForm
                                        onCancel={() => {
                                            setShowForm(false);
                                            setEditUser(null);
                                            setSelectedCompany(null);
                                        }}
                                        refreshPosts={fetchAccount} // Pass the refreshPosts callback
                                        userDetails={{
                                            id: editUser ? editUser.id : userDetails.UserId,
                                            referenceid: editUser ? editUser.referenceid : userDetails.ReferenceID,
                                            manager: editUser ? editUser.manager : userDetails.Manager,
                                            tsm: editUser ? editUser.tsm : userDetails.TSM,
                                            targetquota: editUser ? editUser.targetquota : userDetails.TargetQuota,
                                        }}
                                        editUser={editUser} // ✅ Properly pass editUser for editing
                                    />
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center mb-4">
                                            {userDetails.Role !== "Special Access" && (
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        className="flex items-center gap-1 border bg-white text-black text-xs px-4 py-2 shadow-sm rounded hover:bg-blue-400 hover:text-white transition"
                                                        onClick={handleButtonClick}>
                                                        <PiHandTapThin size={15} /> Tap</button>
                                                    <button className="flex items-center gap-1 border bg-white text-black text-xs px-4 py-2 shadow-sm rounded hover:bg-blue-400 hover:text-white transition" onClick={() => setShowForm(true)} >
                                                        <CiSquarePlus size={15} /> Add</button>
                                                </div>
                                            )}

                                            {showPersonalForm && (
                                                <PersonalActivity
                                                    referenceid={referenceid}
                                                    manager={manager}
                                                    tsm={tsm}
                                                    startdate={startdate}
                                                    enddate={enddate}
                                                    setactivitystatus={setactivitystatus}
                                                    setactivityremarks={setactivityremarks}
                                                    setTimeDuration={setTimeDuration}
                                                    calculateEndDate={calculateEndDate}
                                                    activitystatus={activitystatus}
                                                    activityremarks={activityremarks}
                                                    timeDuration={timeDuration}
                                                    handleSubmit={handleSubmit}
                                                    setShowPersonalForm={setShowPersonalForm}
                                                />
                                            )}

                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                                            {/* Task */}
                                            <div className="col-span-1 lg:col-span-4 bg-white shadow-md rounded-lg p-4">
                                                <h2 className="text-lg font-bold mb-2">Manual Creation Task</h2>
                                                <p className="text-xs text-gray-600 mb-4">
                                                    This section displays your <strong>tasks</strong> in a <strong>card layout</strong>. Each task is represented as a card, offering a visually appealing and more flexible design compared to traditional tables. You can filter tasks based on various criteria like <strong>client type</strong>, <strong>date range</strong>, and other parameters using the search filters.
                                                </p>
                                                <SearchFilters
                                                    searchTerm={searchTerm}
                                                    setSearchTerm={setSearchTerm}
                                                    selectedClientType={selectedClientType}
                                                    setSelectedClientType={setSelectedClientType}
                                                    selectedStatus={selectedStatus}
                                                    setSelectedStatus={setSelectedStatus}
                                                    startDate={startDate}
                                                    setStartDate={setStartDate}
                                                    endDate={endDate}
                                                    setEndDate={setEndDate}
                                                />

                                                {/* Users Table */}
                                                <UsersTable
                                                    posts={currentPosts}
                                                    handleEdit={(user) => handleEdit(user)}
                                                    handleStatusUpdate={handleStatusUpdate}
                                                    handleDelete={confirmDelete}
                                                    Role={userDetails.Role}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {showDeleteModal && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
                                        <div className="bg-white p-4 rounded shadow-lg">
                                            <h2 className="text-xs font-bold mb-4">Confirm Deletion</h2>
                                            <p className="text-xs">Are you sure you want to delete this post?</p>
                                            <div className="mt-4 flex justify-end">
                                                <button className="bg-red-500 text-white text-xs px-4 py-2 rounded mr-2 flex items-center gap-1" onClick={handleDelete}><CiTrash size={20} />Delete</button>
                                                <button className="bg-gray-300 text-xs px-4 py-2 rounded flex items-center gap-1" onClick={() => setShowDeleteModal(false)}><CiCircleRemove size={20} /> Cancel</button>
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

export default ListofUser;
