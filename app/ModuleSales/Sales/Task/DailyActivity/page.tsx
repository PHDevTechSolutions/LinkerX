"use client";
import React, { useState, useEffect, useRef } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/User/UserFetcher";

// Components
import AddPostForm from "../../../components/Task/DailyActivity/AddUserForm";
import SearchFilters from "../../../components/Task/DailyActivity/SearchFilters";
import UsersTable from "../../../components/Task/DailyActivity/UsersTable";

// Toast Notifications
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Icons
import { CiSquarePlus, CiCircleRemove, CiSaveUp1, CiTrash, CiRepeat } from "react-icons/ci";
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
}

interface UserDetails {
    ReferenceID: string;
}

const ListofUser: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [editUser, setEditUser] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);

    const [post, setPost] = useState<Company[]>([]);
    const [randomCompanies, setRandomCompanies] = useState<Company[]>([]);
    const [typeClient, setTypeClient] = useState<string>(""); // Selected typeclient
    const [showModal, setShowModal] = useState<boolean>(false); // Modal visibility
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null); // Selected company data
    const [typeActivity, setTypeActivity] = useState("");
    const [generatedMessage, setGeneratedMessage] = useState("");

    const [startDuration, setStartDuration] = useState<string>("");
    const [endDuration, setEndDuration] = useState<string>("");

    const [duration, setDuration] = useState<string>("");
    const [timeValue, setTimeValue] = useState<string>("");

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState("");
    const [selectedClientType, setSelectedClientType] = useState("");
    const [startDate, setStartDate] = useState(""); // Default to null
    const [endDate, setEndDate] = useState(""); // Default to null
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);

    const [userDetails, setUserDetails] = useState({
        UserId: "", ReferenceID: "", Manager: "", TSM: "", Firstname: "", Lastname: "", Email: "", Role: "", Department: "", Company: "", TargetQuota: "",
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showPersonalForm, setShowPersonalForm] = useState(false);

    const [activitystatus, setactivitystatus] = useState(""); // Default to null
    const [activityremarks, setactivityremarks] = useState(""); // Default to null
    const [startdate, setstartdate] = useState(""); // Default to null
    const [enddate, setenddate] = useState(""); // Default to null
    const [referenceid, setreferenceid] = useState(userDetails.ReferenceID);
    const [tsm, settsm] = useState(userDetails.TSM);
    const [manager, setmanager] = useState(userDetails.Manager);
    const [timeDuration, setTimeDuration] = useState("");

    const [showTimerModal, setShowTimerModal] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);

    const taskRef = useRef<HTMLDivElement | null>(null); // Reference for My Task div

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

    // Filter users by search term (firstname, lastname)
    const filteredAccounts = Array.isArray(posts)
        ? posts
            .filter((post) => {
                // Check if company name or activity status matches the search term
                const matchesSearchTerm =
                    (post?.companyname?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (post?.activitystatus?.toLowerCase().includes(searchTerm.toLowerCase()));

                // Parse the date_created field safely
                const postDate = post?.date_created ? new Date(post.date_created) : null;

                // Check if the post's date is within the selected date range
                const isWithinDateRange =
                    (!startDate || (postDate && postDate >= new Date(startDate))) &&
                    (!endDate || (postDate && postDate <= new Date(endDate)));

                // Check if the post matches the selected client type
                const matchesClientType = selectedClientType
                    ? post?.typeclient === selectedClientType
                    : true;

                // Check if the post matches the current user's ReferenceID (PostgreSQL or MongoDB)
                const matchesReferenceID =
                    post?.referenceid === userDetails.ReferenceID || // PostgreSQL referenceid
                    post?.ReferenceID === userDetails.ReferenceID;   // MongoDB ReferenceID

                // Check the user's role for filtering
                const matchesRole =
                    userDetails.Role === "Super Admin" ||
                    userDetails.Role === "Territory Sales Associate";

                // Return the final filtering condition
                return (
                    matchesSearchTerm &&
                    isWithinDateRange &&
                    matchesClientType &&
                    matchesReferenceID && // Ensures the user sees only their data
                    matchesRole
                );
            })
            .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime()) // Sort by date_created (newest first)
        : [];

    const currentPosts = filteredAccounts.slice();
    const totalPages = Math.ceil(filteredAccounts.length);

    // Handle editing a post
    const handleEdit = (post: any) => {
        setEditUser(post);
        setShowForm(true);
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

    // Set start date when the component mounts
    useEffect(() => {
        setstartdate(getFormattedTimestamp());
    }, []);

    // Function to calculate end date based on selected duration
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

    // Handle button click to set start date
    const handleButtonClick = () => {
        setstartdate(getFormattedTimestamp());
        setShowPersonalForm(true);
    };

    // Handle time selection change
    const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTime = e.target.value;
        setTimeDuration(selectedTime);
        calculateEndDate(selectedTime);
    };

    // Close form and reset fields
    const closeForm = () => {
        setShowPersonalForm(false);
        setstartdate("");
        setenddate("");
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

                // Convert time duration to seconds
                const durationMap: Record<string, number> = {
                    "1 Minute": 1 * 60,
                    "5 Minutes": 5 * 60,
                    "10 Minutes": 10 * 60,
                    "15 Minutes": 15 * 60,
                    "20 Minutes": 20 * 60,
                    "30 Minutes": 30 * 60,
                    "1 Hour": 60 * 60,
                    "2 Hours": 2 * 60 * 60,
                    "3 Hours": 3 * 60 * 60,
                };

                const durationInSeconds = durationMap[timeDuration] || 0;
                if (durationInSeconds > 0) {
                    startCountdown(durationInSeconds);
                }

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

    let timer: NodeJS.Timeout | null = null;

    const startCountdown = (durationInSeconds: number) => {
        if (timer) clearInterval(timer); // Clear existing timer before starting a new one

        setCountdown(durationInSeconds);
        setShowTimerModal(true);
        setTimerRunning(true);

        timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer!);
                    setShowTimerModal(false);
                    setTimerRunning(false);

                    // Refresh the entire page after timer ends
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);

                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Cleanup timer when component unmounts
    useEffect(() => {
        return () => {
            if (timer) clearInterval(timer);
        };
    }, []);

    // Shuffle array and get random 5 companies
    const getRandomCompanies = (companies: Company[]) => {
        const shuffled = [...companies].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 5);
    };

    // Fetch companies from API with ReferenceID as query param
    const fetchCompanies = async () => {
        try {
            const response = await fetch(
                `/api/ModuleSales/UserManagement/CompanyAccounts/FetchAccount?referenceid=${userDetails.ReferenceID}`
            );
            const data = await response.json();
            console.log("Fetched data:", data); // Debugging line

            if (data.success && Array.isArray(data.data)) {
                setPost(data.data);
                // Initial random 5 companies
                setRandomCompanies(getRandomCompanies(data.data));
            } else {
                toast.error("No companies found.");
                setPost([]);
                setRandomCompanies([]);
            }
        } catch (error) {
            toast.error("Error fetching companies.");
            console.error("Error fetching", error);
        }
    };

    function calculateDate(selectedDuration: string, selectedTime: string) {
        // Get current date in Manila timezone
        const now = new Date(
            new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })
        );
        let newDate = new Date(now);
    
        // Set date based on selected duration
        switch (selectedDuration) {
            case "Today":
                newDate = now;
                break;
            case "Tomorrow":
                newDate.setDate(now.getDate() + 1);
                break;
            case "After a Week":
                newDate.setDate(now.getDate() + 7);
                break;
            case "After a Month":
                newDate.setMonth(now.getMonth() + 1);
                break;
            default:
                newDate = now;
        }
    
        // Format date to 'yyyy-mm-ddThh:mm' in Manila timezone
        const dateTimeString = formatDateToLocal(newDate);
        setStartDuration(dateTimeString);
        setEndDuration(addTimeToDate(newDate, selectedTime));
    }
    
    // Function to add time (minutes/hours) to the selected date
    function addTimeToDate(date: Date, selectedTime: string) {
        const newDate = new Date(date);
        const [value, unit] = selectedTime.split(" ");
        const timeValue = parseInt(value);
    
        if (unit === "Minutes") {
            newDate.setMinutes(date.getMinutes() + timeValue);
        } else if (unit === "Hour" || unit === "Hours") {
            newDate.setHours(date.getHours() + timeValue);
        }
    
        return formatDateToLocal(newDate);
    }
    
    // Format date to 'yyyy-mm-ddThh:mm' in Manila timezone
    function formatDateToLocal(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
    
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    
    // Handle duration change
    function handleDurationChange(e: any) {
        const selectedDuration = e.target.value;
        setDuration(selectedDuration);
        calculateDate(selectedDuration, timeValue);
    }

    // Handle time change
    function handleTimeDateChange(e: any) {
        const selectedTime = e.target.value;
        setTimeValue(selectedTime);
        calculateDate(duration, selectedTime);
    }

    const handleGenerate = () => {
        const filtered = typeClient
            ? post.filter((company) => company.typeclient === typeClient)
            : post;

        // Randomize and set new company list based on filtered results
        setRandomCompanies(getRandomCompanies(filtered));
    };

    // Handle Accept button to show modal
    const handleAccept = (company: Company) => {
        setSelectedCompany(company);
        setShowModal(true);
    };

    useEffect(() => {
        fetchCompanies();
    }, [userDetails.ReferenceID]);

    // Message generator function
    const generateMessage = (activity: string): string[] => {
        switch (activity) {
            case "Follow Up":
                return [
                    "Following up on the previous inquiry. Kindly provide an update.",
                    "Just checking in regarding the progress of the previous discussions.",
                    "A quick follow-up to discuss the pending tasks. Please advise.",
                    "Reaching out again to ensure all concerns are addressed.",
                    "Seeking confirmation on the next steps for the ongoing project.",
                    "Touching base to see if there's anything else we can assist with.",
                ];
            case "Email and Viber Checking":
                return [
                    "Checking for any updates in emails and Viber messages.",
                    "Ensuring that all Viber and email communications are acknowledged.",
                    "Reviewing recent messages and emails for important information.",
                    "Scanning for any missed messages in email or Viber.",
                    "Following up on unread or unaddressed communications.",
                    "Verifying if all important responses have been sent.",
                ];
            case "Walk in Client":
                return [
                    "Attending to a walk-in client and providing necessary assistance.",
                    "Gathering client requirements from walk-in customers.",
                    "Assisting a walk-in client with the service inquiry.",
                    "Ensuring that all concerns of the walk-in client are noted.",
                    "Providing information and guidance to the walk-in client.",
                    "Addressing inquiries of walk-in clients effectively.",
                ];
            default:
                return [""];
        }
    };

    // Generate initial message based on selection
    const handleActivityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedActivity: string = e.target.value;
        setTypeActivity(selectedActivity);

        // Generate and set a random message
        const messages: string[] = generateMessage(selectedActivity);
        setGeneratedMessage(messages[Math.floor(Math.random() * messages.length)]);
    };

    // Generate new message when clicking "Generate Other"
    const handleGenerateOther = () => {
        if (typeActivity) {
            const messages: string[] = generateMessage(typeActivity);
            setGeneratedMessage(messages[Math.floor(Math.random() * messages.length)]);
        }
    };

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => (
                        <div className="container mx-auto p-4 text-gray-900">
                            {showForm ? (
                                <AddPostForm
                                    onCancel={() => {
                                        setShowForm(false);
                                        setEditUser(null);
                                    }}
                                    refreshPosts={fetchAccount}  // Pass the refreshPosts callback
                                    userDetails={{
                                        id: editUser ? editUser.id : userDetails.UserId,
                                        referenceid: editUser ? editUser.referenceid : userDetails.ReferenceID,
                                        manager: editUser ? editUser.manager : userDetails.Manager,
                                        tsm: editUser ? editUser.tsm : userDetails.TSM,
                                        targetquota: editUser ? editUser.targetquota : userDetails.TargetQuota,
                                    }}   // Ensure id is passed correctly
                                    editUser={editUser}
                                />
                            ) : (
                                <>
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                className="flex items-center gap-1 border bg-white text-black text-xs px-4 py-2 shadow-sm rounded hover:bg-blue-900 hover:text-white transition"
                                                onClick={() => setShowForm(true)}
                                            >
                                                <CiSquarePlus size={20} /> Create Task
                                            </button>
                                            <button
                                                className="flex items-center gap-1 border bg-white text-black text-xs px-4 py-2 shadow-sm rounded hover:bg-blue-900 hover:text-white transition"
                                                onClick={handleButtonClick}
                                            >
                                                <PiHandTapThin size={20} /> Tap
                                            </button>
                                        </div>

                                        {showPersonalForm && (
                                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                                <div className="bg-white p-8 rounded shadow-lg w-96 max-w-lg">
                                                    <h2 className="text-sm font-bold mb-4">Personal Activity</h2>
                                                    <p className="text-xs text-gray-600 mb-4">
                                                        This form helps track your <strong>personal activities</strong> by selecting an activity type, adding remarks, and specifying the time spent. It assists in managing tasks, time allocation, and productivity analysis.
                                                    </p>

                                                    <form onSubmit={handleSubmit}>
                                                        <input type="hidden" id="referenceid" value={referenceid} onChange={(e) => setreferenceid(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                                                        <input type="hidden" id="tsm" value={tsm} onChange={(e) => settsm(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                                                        <input type="hidden" id="manager" value={manager} onChange={(e) => setmanager(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" />
                                                        <input type="hidden" value={startdate} readOnly className="w-full px-3 py-2 border rounded text-xs bg-gray-100 cursor-not-allowed" />
                                                        <input type="hidden" value={enddate} readOnly className="w-full px-3 py-2 border rounded text-xs" />

                                                        {/* Select Option */}
                                                        <select value={activitystatus} onChange={(e) => setactivitystatus(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize mb-4">
                                                            <option value="">-- Select an Option --</option>
                                                            <option value="Assisting other Agents Client">Assisting other Agents Client</option>
                                                            <option value="Coordination of SO to Warehouse">Coordination of SO to Warehouse</option>
                                                            <option value="Coordination of SO to Orders">Coordination of SO to Orders</option>
                                                            <option value="Updating Reports">Updating Reports</option>
                                                            <option value="Email and Viber Checking">Email and Viber Checking</option>
                                                            <optgroup label="──────────────────"></optgroup>
                                                            <option value="1st Break">1st Break</option>
                                                            <option value="Client Meeting">Client Meeting</option>
                                                            <option value="Coffee Break">Coffee Break </option>
                                                            <option value="Group Meeting">Group Meeting</option>
                                                            <option value="Last Break">Last Break</option>
                                                            <option value="Lunch Break">Lunch Break</option>
                                                            <option value="TSM Coaching">TSM Coaching</option>
                                                        </select>

                                                        {/* Remarks Input */}
                                                        <textarea value={activityremarks} onChange={(e) => setactivityremarks(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize resize-none mb-4" rows={4} placeholder="Enter remarks here..."></textarea>

                                                        <select value={timeDuration} onChange={handleTimeChange} className="w-full px-3 py-2 border rounded text-xs capitalize mb-2">
                                                            <option value="">Choose Time</option>
                                                            <option value="1 Minute">1 Minute</option>
                                                            <option value="5 Minutes">5 Minutes</option>
                                                            <option value="10 Minutes">10 Minutes</option>
                                                            <option value="15 Minutes">15 Minutes</option>
                                                            <option value="20 Minutes">20 Minutes</option>
                                                            <option value="30 Minutes">30 Minutes</option>
                                                            <option value="1 Hour">1 Hour</option>
                                                            <option value="2 Hours">2 Hours</option>
                                                            <option value="3 Hours">3 Hours</option>
                                                        </select>
                                                        <p className="text-xs text-gray-600 mb-4">
                                                            Select the <strong>activity duration</strong> to log the time spent on the task, ranging from minutes to hours.
                                                        </p>

                                                        {/* Buttons */}
                                                        <div className="mt-6 flex justify-end">
                                                            <button type="button" className="bg-gray-400 text-xs text-white px-5 py-2 rounded mr-2 flex items-center gap-1" onClick={closeForm} disabled={loading}><CiCircleRemove size={20} />Cancel</button>
                                                            <button type="submit" className="bg-blue-900 text-white text-xs px-5 py-2 rounded flex items-center gap-1" disabled={loading}><CiSaveUp1 size={20} />{loading ? "Submitting..." : "Submit"}</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        )}

                                        {showTimerModal && (
                                            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-end pointer-events-auto">
                                                {/* Invisible overlay to block clicks */}
                                                <div className="absolute inset-0"></div>

                                                {/* Modal Box */}
                                                <div className="relative bg-white p-6 rounded-lg shadow-lg w-64 text-center border border-gray-300 m-4">
                                                    <h2 className="text-sm font-bold mb-2">Activity in Progress</h2>
                                                    <p className="text-xl font-bold text-red-600">
                                                        {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, "0")}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-2">Please wait until the timer ends.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-4 gap-4 mb-4">
                                        {/* Task */}
                                        <div className="col-span-3 p-4 bg-white shadow-md rounded-lg">
                                            <h2 className="text-lg font-bold mb-2">My Task</h2>
                                            <p className="text-xs text-gray-600 mb-4">
                                                This section displays your <strong>tasks</strong> in a <strong>card layout</strong>. Each task is represented as a card, offering a visually appealing and more flexible design compared to traditional tables. You can filter tasks based on various criteria like <strong>client type</strong>, <strong>date range</strong>, and other parameters using the search filters.
                                            </p>

                                            {/* Search Filters */}
                                            <SearchFilters
                                                searchTerm={searchTerm}
                                                setSearchTerm={setSearchTerm}
                                                selectedClientType={selectedClientType}
                                                setSelectedClientType={setSelectedClientType}
                                                startDate={startDate}
                                                setStartDate={setStartDate}
                                                endDate={endDate}
                                                setEndDate={setEndDate}
                                            />

                                            {/* Users Table */}
                                            <UsersTable
                                                posts={currentPosts}
                                                handleEdit={handleEdit}
                                                handleStatusUpdate={handleStatusUpdate}
                                                handleDelete={confirmDelete}
                                            />
                                        </div>

                                        {/* Automated Task */}
                                        <div className="col-span-1 p-4 bg-white shadow-md rounded-lg">
                                            <h3 className="text-sm font-semibold mb-2">Automated Task</h3>
                                            <p className="text-xs text-gray-600 mb-4">
                                                Below are some company names fetched from the system. You can customize
                                                this section as needed.
                                            </p>

                                            {/* TypeClient Filter Dropdown */}
                                            <div className="mb-4 flex gap-2">
                                                <select
                                                    value={typeClient}
                                                    onChange={(e) => setTypeClient(e.target.value)}
                                                    className="w-full p-2 border rounded text-[10px] bg-gray-100"
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Top 50">Top 50</option>
                                                    <option value="Next 30">Next 30</option>
                                                    <option value="Below 20">Below 20</option>
                                                </select>
                                                <button
                                                    onClick={handleGenerate}
                                                    className="px-3 py-2 text-[10px] bg-gray-100 text-dark rounded hover:bg-blue-600"
                                                >
                                                    <CiRepeat size={16} />
                                                </button>
                                            </div>

                                            {/* Display 5 random company names */}
                                            <div className="space-y-2">
                                                {randomCompanies.map((company, index) => (
                                                    <div
                                                        key={index}
                                                        className="p-2 bg-gray-100 rounded flex justify-between items-center text-[10px] capitalize font-medium text-gray-800"
                                                    >
                                                        <span>{company.companyname}
                                                            <br /><span className="text-gray-500">{company.typeclient}</span>
                                                        </span>
                                                        <button
                                                            onClick={() => handleAccept(company)}
                                                            className="px-3 py-1 text-[10px] bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                                        >
                                                            Accept
                                                        </button>
                                                    </div>
                                                ))}

                                                {/* Show message if no company matches the filter */}
                                                {randomCompanies.length === 0 && (
                                                    <div className="text-xs text-gray-500 text-center p-2">
                                                        No matching companies found.
                                                    </div>
                                                )}
                                            </div>

                                            {/* Modal Section */}
                                            {showModal && selectedCompany && (
                                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 capitalize">
                                                        <h3 className="text-sm font-semibold mb-4">Automated Task's</h3>
                                                        <p className="text-xs text-gray-600 mb-4">
                                                            This section displays randomized company names daily to streamline task management.
                                                        </p>

                                                        {/* Company Name */}
                                                        <div className="mb-4">
                                                            <label className="text-xs font-medium text-gray-600">Company Name</label>
                                                            <input type="text" value={selectedCompany.companyname} className="w-full p-2 text-xs border rounded capitalize" disabled />
                                                            {/* Hidden Fields */}
                                                            <input type="hidden" value={selectedCompany.contactnumber} className="w-full p-2 text-xs border rounded" />
                                                            <input type="hidden" value={selectedCompany.contactperson} className="w-full p-2 text-xs border capitalize rounded" />
                                                            <input type="hidden" value={selectedCompany.typeclient} className="w-full p-2 text-xs border rounded" />
                                                            <input type="hidden" value={selectedCompany.emailaddress} className="w-full p-2 text-xs border rounded" />
                                                            <input type="hidden" value={selectedCompany.address} className="w-full p-2 text-xs border rounded" />
                                                            <input type="hidden" value={selectedCompany.area} className="w-full p-2 text-xs border rounded" />
                                                            <input type="hidden" value={selectedCompany.referenceid} className="w-full p-2 text-xs border rounded" />
                                                            <input type="hidden" value={selectedCompany.tsm} className="w-full p-2 text-xs border rounded" />
                                                            <input type="hidden" value={selectedCompany.manager} className="w-full p-2 text-xs border rounded" />
                                                        </div>

                                                        {/* Select Type of Activity */}
                                                        <div className="mb-4">
                                                            <label className="text-xs font-medium text-gray-600">Type of Activity</label>
                                                            <select value={selectedCompany.typeactivity} onChange={handleActivityChange} className="w-full p-2 text-xs border rounded">
                                                                <option value="">Select activity type</option>
                                                                <option value="Follow Up">Follow Up</option>
                                                                <option value="Email and Viber Checking">Email and Viber Checking</option>
                                                                <option value="Walk in Client">Walk in Client</option>
                                                            </select>
                                                        </div>

                                                        {/* Select Duration */}
                                                        <div className="mb-4">
                                                            <label className="text-xs font-medium text-gray-600">Duration</label>
                                                            {/* Duration Select */}
                                                            <select value={duration} onChange={handleDurationChange} className="w-full p-2 text-xs border rounded mb-2">
                                                                <option value="">Select duration</option>
                                                                <option value="Today">Today</option>
                                                                <option value="Tomorrow">Tomorrow</option>
                                                                <option value="After a Week">After a Week</option>
                                                                <option value="After a Month">After a Month</option>
                                                            </select>
                                                            {/* Time Select */}
                                                            <select value={timeValue} onChange={handleTimeDateChange} className="w-full p-2 text-xs border rounded mb-2">
                                                                <option value="">Select Time</option>
                                                                <option value="2 Minutes">2 Minutes</option>
                                                                <option value="5 Minutes">5 Minutes</option>
                                                                <option value="10 Minutes">10 Minutes</option>
                                                                <option value="30 Minutes">30 Minutes</option>
                                                                <option value="1 Hour">1 Hour</option>
                                                                <option value="2 Hours">2 Hours</option>
                                                            </select>

                                                            {/* Start Date */}
                                                            <input type="hidden" value={startDuration} disabled/>
                                                            {/* End Date */}
                                                            <input type="hidden" value={endDuration} disabled />
                                                        </div>

                                                        {/* Textarea with Generated Message */}
                                                        <div className="mb-0">
                                                            <label className="text-xs font-medium text-gray-600">Generated Message</label>
                                                            <textarea
                                                                className="w-full p-2 text-xs border rounded bg-gray-100"
                                                                rows={4}
                                                                value={generatedMessage}
                                                                readOnly
                                                            />
                                                        </div>

                                                        {/* Generate Other Button */}
                                                        <button
                                                            onClick={handleGenerateOther}
                                                            disabled={!typeActivity}
                                                            className={`px-3 py-1 mb-2 text-xs bg-gray-100 text-gray-900 rounded hover:bg-gray-200 transition flex flex-1 gap-1 ${!typeActivity && "opacity-50 cursor-not-allowed"
                                                                }`}
                                                        >
                                                            <CiRepeat size={16} /> Generate
                                                        </button>

                                                        {/* Modal Buttons */}
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => setShowModal(false)}
                                                                className="px-4 py-1 text-xs bg-gray-300 text-black rounded hover:bg-gray-400"
                                                            >
                                                                Close
                                                            </button>
                                                            <button
                                                                onClick={() => setShowModal(false)}
                                                                className="px-4 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                                                            >
                                                                Confirm
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                        </div>
                                    </div>

                                </>
                            )}

                            {showDeleteModal && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
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
                    )}
                </UserFetcher>
            </ParentLayout>
        </SessionChecker>
    );
};

export default ListofUser;
