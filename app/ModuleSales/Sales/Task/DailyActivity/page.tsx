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
    const [randomCompanies, setRandomCompanies] = useState<Company[]>([]);
    const [typeClient, setTypeClient] = useState<string>(""); // Selected typeclient
    const [showModal, setShowModal] = useState<boolean>(false); // Modal visibility
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null); // Selected company data
    const [typeActivity, setTypeActivity] = useState("");
    const [generatedMessage, setGeneratedMessage] = useState("");
    const [activeTab, setActiveTab] = useState("Automated Task");
    const [remainingBalance, setRemainingBalance] = useState<number>(0);
    const [todayCompanies, setTodayCompanies] = useState<any[]>([]);

    const [startDuration, setStartDuration] = useState<string>("");
    const [endDuration, setEndDuration] = useState<string>("");

    const [duration, setDuration] = useState<string>("");
    const [timeValue, setTimeValue] = useState<string>("");

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState("");
    const [selectedClientType, setSelectedClientType] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
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
                
                const matchesStatus = selectedStatus
                    ? post?.activitystatus === selectedStatus
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
                    matchesStatus &&
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
        return shuffled.slice(0, 2);
    };

    // Fetch companies from API with ReferenceID as query param
    const fetchCompanies = async () => {
        try {
            const response = await fetch(
                `/api/ModuleSales/Companies/CompanyAccounts/FetchAccount?referenceid=${userDetails.ReferenceID}`
            );
            const data = await response.json();

            if (data.success && Array.isArray(data.data)) {
                // Apply type to company parameter
                const activeCompanies = data.data.filter((company: Company) => company.status === "Active" || company.status === "Used");
                setPost(activeCompanies);
            } else {
                
                setPost([]);
            }
        } catch (error) {
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

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        const savedCompanies = localStorage.getItem("todayCompanies");
        const savedBalance = localStorage.getItem("remainingBalance");

        if (savedCompanies && savedBalance) {
            const parsedCompanies = JSON.parse(savedCompanies);
            const parsedBalance = parseInt(savedBalance);

            // Check if companies are for today's date
            const isSameDay = parsedCompanies.every(
                (company: any) => company.date_assigned === new Date().toISOString().slice(0, 10)
            );

            if (isSameDay) {
                // Load from storage if valid for today
                setTodayCompanies(parsedCompanies);
                setRemainingBalance(parsedBalance);
            } else {
                // Reset if it's a new day
                getFilteredCompanies(post);
            }
        } else {
            getFilteredCompanies(post);
        }
    }, [post]);

    const getFilteredCompanies = async (post: any[]) => {
        let remaining = remainingBalance || 35;

        // Get current week number in the month
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const currentWeek = Math.ceil((today.getDate() + firstDayOfMonth.getDay()) / 7); // Get current week

        // Get one New Account - Client Development per week
        const newAccountCompanies = post
            .filter(
                (company) =>
                    company.status === "Active" &&
                    company.typeclient === "New Account - Client Development"
            )
            .slice(0, 1); // Only 1 company per week

        remaining -= newAccountCompanies.length;

        // Get remaining companies to fill 35 slots
        const activeCompanies = [
            ...post.filter((company) => company.status === "Active" && company.typeclient === "Top 50").slice(0, remaining),
            ...post.filter((company) => company.status === "Active" && company.typeclient === "Next 30").slice(0, remaining),
            ...post.filter((company) => company.status === "Active" && company.typeclient === "Balance 20").slice(0, remaining),
        ]
            .slice(0, remaining) // Fill remaining slots
            .map((company) => ({
                ...company,
                date_assigned: new Date().toISOString().slice(0, 10), // Add today's date
            }));

        remaining -= activeCompanies.length;

        // If remaining slots, get from Used companies
        let usedCompanies: any[] = [];
        if (remaining > 0) {
            usedCompanies = [
                ...post.filter((company) => company.status === "Used" && company.typeclient === "Top 50").slice(0, remaining),
                ...post.filter((company) => company.status === "Used" && company.typeclient === "Next 30").slice(0, remaining),
                ...post.filter((company) => company.status === "Used" && company.typeclient === "Balance 20").slice(0, remaining),
            ]
                .slice(0, remaining)
                .map((company) => ({
                    ...company,
                    date_assigned: new Date().toISOString().slice(0, 10), // Add today's date
                }));
        }

        // Combine Active, New Account, and Used companies
        const finalCompanies = [
            ...newAccountCompanies, // Include New Account - Client Development (once per week)
            ...activeCompanies,
            ...usedCompanies,
        ].slice(0, 35);

        // Update remaining balance
        const newBalance = Math.max(0, 35 - finalCompanies.length);
        setRemainingBalance(newBalance);
        setTodayCompanies(finalCompanies);

        // ✅ Save assigned companies to the backend
        await saveToDatabase(finalCompanies, newBalance);
    };

    const saveToDatabase = async (companies: any[], balance: number) => {
        try {
            const response = await fetch("/api/ModuleSales/Task/DailyActivity/SaveAssignedCompanies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    companies,
                    remainingBalance: balance,
                }),
            });

            if (!response.ok) {
                console.error("❌ Failed to save assigned companies.");
            } else {
                console.log("✅ Assigned companies saved successfully.");
            }
        } catch (error) {
            console.error("❌ Error saving assigned companies:", error);
        }
    };

    // Handle Accept button to show modal
    const handleAccept = (company: any) => {
        setSelectedCompany(company);
        setShowModal(true);
    };

    const handleProceed = async () => {
        if (selectedCompany) {
            try {
                // Call API to update company status
                const response = await fetch(
                    "/api/ModuleSales/Task/DailyActivity/UpdateCompanyStatus",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            id: selectedCompany.id,
                            status: "Used",
                        }),
                    }
                );
    
                if (response.ok) {
                    const result = await response.json();
                    console.log("✅ Company status updated successfully:", result.data);
    
                    // Remove the used company from the list
                    const updatedCompanies = todayCompanies.filter(
                        (company) => company.id !== selectedCompany.id
                    );
    
                    // Reduce remaining balance after using one company
                    const newBalance = Math.max(0, remainingBalance - 1);
                    setTodayCompanies(updatedCompanies);
                    setRemainingBalance(newBalance);
    
                    // Save updated data to the database after status update
                    await saveToDatabase(updatedCompanies, newBalance);
    
                    // Set updated status of the company
                    setSelectedCompany({
                        ...selectedCompany,
                        status: "Used",
                    });
    
                    // Show form after update
                    setShowForm(true);
                } else {
                    console.error("❌ Failed to update status.");
                }
            } catch (error) {
                console.error("❌ Error updating company status:", error);
            } finally {
                // Close modal after API call
                setShowModal(false);
            }
        }
    };
    
    // Handle Cancel to Close Modal
    const handleCancel = () => {
        setShowModal(false);
        setSelectedCompany(null);
    };

    useEffect(() => {
        // Fetch new companies if no companies left or remaining balance is greater than 0
        if (todayCompanies.length === 0 && remainingBalance > 0) {
            getFilteredCompanies(post);
        }
    }, [post]);

    return (
        <SessionChecker>
            <ParentLayout>
                <UserFetcher>
                    {(user) => (
                        <div className="container mx-auto p-4 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-1">
                            {showForm && selectedCompany ? (
                                <AddPostForm
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
                                    companyData={{
                                        companyname: selectedCompany?.companyname || "",
                                        typeclient: selectedCompany?.typeclient || "",
                                        contactperson: selectedCompany?.contactperson || "",
                                        contactnumber: selectedCompany?.contactnumber || "",
                                        emailaddress: selectedCompany?.emailaddress || "",
                                        address: selectedCompany?.address || "",
                                        area: selectedCompany?.area || "",
                                    }}
                                />
                            ) : (
                                <>
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                className="flex items-center gap-1 border bg-white text-black text-xs px-4 py-2 shadow-sm rounded hover:bg-blue-900 hover:text-white transition"
                                                onClick={handleButtonClick}
                                            >
                                                <PiHandTapThin size={20} /> Tap
                                            </button>
                                        </div>

                                        {showPersonalForm && (
                                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
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
                                            <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-end justify-end pointer-events-auto">
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
                                            />
                                        </div>

                                        {/* Automated Task */}
                                        <div className="col-span-1 p-4 bg-white shadow-md rounded-lg">
                                            <div className="flex mb-4 border-b">
                                                <button
                                                    onClick={() => handleTabChange("Automated Task")}
                                                    className={`text-xs px-4 py-2 border-b-2 w-full ${activeTab === "Automated Task" ? "border-blue-500 font-semibold" : "text-gray-600"
                                                        }`}
                                                >
                                                    Automated Task
                                                </button>
                                                <button
                                                    onClick={() => handleTabChange("List Accounts")}
                                                    className={`text-xs px-4 py-2 border-b-2 w-full ${activeTab === "List Accounts" ? "border-blue-500 font-semibold" : "text-gray-600"
                                                        }`}
                                                >
                                                    List Accounts
                                                </button>
                                            </div>

                                            {activeTab === "Automated Task" ? (
                                                <>
                                                    <h3 className="text-sm font-semibold mb-2">Automated Task</h3>
                                                    <p className="text-xs text-gray-600 mb-4">
                                                        Below are some company names fetched from the system.
                                                    </p>

                                                    {/* Display 5 random company names */}
                                                    <div className="space-y-2">
                                                        {todayCompanies.length > 0 ? (
                                                            todayCompanies.map((company, index) => (
                                                                <div
                                                                    key={index}
                                                                    className={`p-2 bg-gray-100 rounded flex justify-between items-center text-[10px] transition-all duration-200 ease-in-out transform hover:scale-[1.02] uppercase font-medium text-gray-800 ${company.typeclient === "New Account - Client Development" ? "bg-yellow-200" : ""
                                                                        }`}
                                                                >
                                                                    <span>
                                                                        {company.companyname}
                                                                        <br />
                                                                        <span className="text-gray-500">{company.typeclient}</span>
                                                                    </span>
                                                                    <button
                                                                        onClick={() => handleAccept(company)}
                                                                        className="px-3 py-1 text-[10px] bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                                                    >
                                                                        Accept
                                                                    </button>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="text-xs text-gray-500 text-center p-2">
                                                                {remainingBalance === 0
                                                                    ? "✅ All 35 companies have been used today. Come back tomorrow!"
                                                                    : "No available companies today."}
                                                            </div>
                                                        )}

                                                        {/* Modal for Proceed/Cancel */}
                                                        {showModal && (
                                                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
                                                                <div className="bg-white rounded-lg p-5 w-72 text-center shadow-lg">
                                                                    <p className="text-xs font-semibold mb-4">
                                                                        Are you sure you want to proceed?
                                                                    </p>
                                                                    <div className="flex justify-between text-xs">
                                                                        <button
                                                                            onClick={handleCancel}
                                                                            className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                        <button
                                                                            onClick={handleProceed}
                                                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                                                        >
                                                                            Proceed
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                </>
                                            ) : (
                                                <>
                                                    {/* List Accounts Tab Content */}
                                                    <h3 className="text-sm font-semibold mb-2">List Accounts</h3>
                                                    <p className="text-xs text-gray-600 mb-4">
                                                        View and manage your list of company accounts.
                                                    </p>
                                                    <div className="p-0 rounded text-[10px] text-gray-700 uppercase">
                                                        <ul className="space-y-2 h-90 overflow-y-auto max-h-[500px] w-full pr-2">
                                                            {[
                                                                // Order Top 50 first
                                                                ...post
                                                                    .filter((company) => company.status === "Active" && company.typeclient === "Top 50")
                                                                    .map((company, index) => ({
                                                                        ...company,
                                                                        order: index + 1,
                                                                    })),
                                                                // Next 30
                                                                ...post
                                                                    .filter((company) => company.status === "Active" && company.typeclient === "Next 30")
                                                                    .map((company, index, array) => ({
                                                                        ...company,
                                                                        order: post.filter((c) => c.status === "Active" && c.typeclient === "Top 50").length + index + 1,
                                                                    })),
                                                                // Below 20
                                                                ...post
                                                                    .filter((company) => company.status === "Active" && company.typeclient === "Balance 20")
                                                                    .map((company, index, array) => ({
                                                                        ...company,
                                                                        order:
                                                                            post.filter((c) => c.status === "Active" && (c.typeclient === "Top 50" || c.typeclient === "Next 30")).length +
                                                                            index +
                                                                            1,
                                                                    })),
                                                                // New Account - Client Development
                                                                ...post
                                                                    .filter((company) => company.status === "Active" && company.typeclient === "New Account - Client Development")
                                                                    .map((company, index, array) => ({
                                                                        ...company,
                                                                        order:
                                                                            post.filter(
                                                                                (c) =>
                                                                                    c.status === "Active" &&
                                                                                    (c.typeclient === "Top 50" || c.typeclient === "Next 30" || c.typeclient === "Balance 20")
                                                                            ).length +
                                                                            index +
                                                                            1,
                                                                    })),
                                                                // Append Used status at the end
                                                                ...post
                                                                    .filter((company) => company.status === "Used")
                                                                    .map((company, index, usedArray) => ({
                                                                        ...company,
                                                                        order:
                                                                            post.filter((c) => c.status === "Active").length +
                                                                            index +
                                                                            1,
                                                                    })),
                                                            ]
                                                                .sort((a, b) => a.order - b.order)
                                                                .map((company) => (
                                                                    <li
                                                                        key={company.order}
                                                                        className={`p-2 bg-gray-100 rounded-sm shadow flex justify-between items-center border-l-4 transition-all duration-200 ease-in-out transform hover:scale-[1.02]
                                                                            ${company.status === "Active" ? "border-green-700" : company.status === "Used" ? "border-blue-500" : "border-gray-300"}
                                                                        `}>

                                                                        {/* Numbering with Company Info */}
                                                                        <span>
                                                                            {company.order}. {company.companyname}
                                                                            <br />
                                                                            <span
                                                                                className={`${company.status === "Active"
                                                                                    ? "text-green-700"
                                                                                    : "text-red-600"
                                                                                    }`}
                                                                            >
                                                                                {company.typeclient}
                                                                            </span>
                                                                        </span>
                                                                    </li>

                                                                ))}

                                                            {/* Show message if no company matches the filter */}
                                                            {post.filter(
                                                                (company) => company.status === "Active" || company.status === "Used"
                                                            ).length === 0 && (
                                                                    <li className="p-2 bg-white rounded shadow text-center text-gray-500">
                                                                        No matching companies found.
                                                                    </li>
                                                                )}
                                                        </ul>
                                                    </div>
                                                </>
                                            )}

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
