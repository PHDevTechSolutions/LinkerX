import React, { useEffect, useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import ReactDOM from "react-dom";


const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const STATUS_COLORS: Record<string, string> = {
    Closed: "bg-gray-100 text-gray-700",
    Endorsed: "bg-blue-300 text-dark",
    "Converted Into Sales": "bg-orange-300 text-dark",
};

const REMARKS_COLORS: Record<string, string> = {
    "No Stocks / Insufficient Stocks": "bg-slate-200",
    "Item Not Carried": "bg-zinc-200",
    "Quotation For Approval": "bg-orange-200",
    "Customer Requested Cancellation": "bg-amber-200",
    "Accreditation / Partnership": "bg-lime-200",
    "For Spf": "bg-green-200",
    "No Response From Client": "bg-emerald-200",
    Assisted: "bg-teal-500",
    "Disapproved Quotation": "bg-cyan-600",
    "For Site Visit": "bg-indigo-200",
    "Non Standard Item": "bg-blue-200",
    "PO Received": "bg-rose-200",
    "Not Converted to Sales": "bg-fuchsia-200",
    "For Occular Inspection": "bg-stone-600",
    "Sold": "bg-sky-200",
};

interface Post {
    userId: string;
    _id: string;
    TicketReferenceNumber: string;
    userName: string;
    CompanyName: string;
    CustomerName: string;
    ContactNumber: string;
    Email: string;
    Gender: string;
    CityAddress: string;
    CustomerSegment: string;
    Channel: string;
    Source: string;
    WrapUp: string;
    CustomerType: string;
    CustomerStatus: string;
    TicketEndorsed: string;
    TicketReceived: string;
    Department: string;
    SalesManager: string;
    SalesAgent: string;
    Inquiries: string;
    Traffic: string;
    Status: string;
    Remarks: string;
    createdAt: string;
    updatedAt: string;
    SONumber: string;
    Amount: string;
    QtySold: string;
    SODate: string;
    PONumber: string;
    PaymentTerms: string;
    POSource: string;
    PaymentDate: string;
    DeliveryDate: string;
    POStatus: string;
}

interface ActivityTableProps {
    posts: Post[];
    handleEdit: (post: Post) => void;
    handleDelete: (postId: string) => void;
    handleStatusUpdate: (postId: string, newStatus: string) => void;
    handleRemarksUpdate: (postId: string, newRemarks: string) => void;
}

const ActivityTable: React.FC<ActivityTableProps> = ({
    posts,
    handleEdit,
    handleDelete,
    handleStatusUpdate,
    handleRemarksUpdate,
}) => {
    const [groupedPosts, setGroupedPosts] = useState<{ [key: string]: { [key: string]: Post[] } }>({});
    const [statusMenuVisible, setStatusMenuVisible] = useState<{ [key: string]: boolean }>({});
    const [remarksMenuVisible, setRemarksMenuVisible] = useState<{ [key: string]: boolean }>({});
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedRemark, setSelectedRemark] = useState("");
    const [activeTab, setActiveTab] = useState<"calendar" | "table">("calendar");
    const [itemsPerPage, setItemsPerPage] = useState(20); // Default 20 per page
    const [currentPage, setCurrentPage] = useState(1);

    const [todayDate, setTodayDate] = useState<string>("");
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [userFilter, setUserFilter] = useState(""); // Add this line


    const getFormattedDate = (date: Date) => {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayIndex = date.getDay();
        const dayOfWeek = daysOfWeek[dayIndex] ?? "Unknown"; // fallback just in case
        const month = date.toLocaleString("default", { month: "short" });
        return `${month} ${date.getDate()}-${dayOfWeek.slice(0, 3)}`;
    };


    const sortedPosts = Object.keys(groupedPosts)
        .flatMap((day) =>
            Object.entries(groupedPosts[day]).flatMap(([userName, userPosts]) =>
                userPosts
            )
        )
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const filteredPosts = userFilter
        ? sortedPosts.filter((post) => post.userName === userFilter)
        : sortedPosts;

    // Pagination Logic
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(sortedPosts.length / itemsPerPage);

    useEffect(() => {
        const grouped = posts.reduce((acc: { [key: string]: { [key: string]: Post[] } }, post) => {
            const postDate = new Date(post.createdAt);
            const postFormattedDate = getFormattedDate(postDate);

            if (!acc[postFormattedDate]) {
                acc[postFormattedDate] = {};
            }

            if (!acc[postFormattedDate][post.userName]) {
                acc[postFormattedDate][post.userName] = [];
            }
            acc[postFormattedDate][post.userName].push(post);

            return acc;
        }, {});

        setGroupedPosts(grouped);
        setTodayDate(getFormattedDate(currentDate));
    }, [posts, currentDate]);

    const handleNextDate = () => {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 1);
        setCurrentDate(nextDate);
    };

    const handlePrevDate = () => {
        const prevDate = new Date(currentDate);
        prevDate.setDate(currentDate.getDate() - 1);
        setCurrentDate(prevDate);
    };

    const currentFormattedDate = getFormattedDate(currentDate);

    const handleDropdownAction = (action: string, post: Post) => {
        switch (action) {
            case "edit":
                handleEdit(post);
                break;
            case "status":
                setStatusMenuVisible((prev) => ({ ...prev, [post._id]: true }));
                break;
            case "remarks":
                setRemarksMenuVisible((prev) => ({ ...prev, [post._id]: true }));
                break;
            case "delete":
                handleDelete(post._id);
                break;
            default:
                break;
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <div className="flex mb-4 border-b">
                <button
                    onClick={() => setActiveTab("calendar")}
                    className={`px-4 py-2 text-xs font-semibold ${activeTab === "calendar" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
                        }`}
                >
                    📅 Calendar View
                </button>
                <button
                    onClick={() => setActiveTab("table")}
                    className={`px-4 py-2 text-xs font-semibold ${activeTab === "table" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
                        }`}
                >
                    📄 Table View
                </button>
            </div>

            {activeTab === "calendar" ? (
                <>
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={handlePrevDate} className="p-2 border rounded">
                            <AiOutlineLeft size={15} />
                        </button>
                        <h3 className="text-md font-bold">{currentFormattedDate}</h3>
                        <button onClick={handleNextDate} className="p-2 border rounded">
                            <AiOutlineRight size={15} />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-100">
                                <tr className="text-xs text-left whitespace-nowrap border-l-4 border-emerald-400">
                                    <th className="px-6 py-4 font-semibold text-gray-700">Ticket No</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Ticket Received</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Ticket Endorsed</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Company</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Customer</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Contact Number</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Email</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Gender</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Client Segment</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">City Address</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Traffic</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Channel</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Wrap-Up</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Source</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">SO Number</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">SO Amount</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">QTY Sold</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">PO Number</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">SO Date</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Payment Terms</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">PO Source</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">PO Status</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Payment Date</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Delivery Date</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Customer Type</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Customer Status</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Department</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Sales Manager</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Sales Agent</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Remarks</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Inquiry / Concern</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {Object.keys(groupedPosts).map((day) =>
                                    day === currentFormattedDate ? (
                                        <React.Fragment key={day}>
                                            {Object.entries(groupedPosts[day]).map(([userName, userPosts]) => (
                                                <React.Fragment key={userName}>
                                                    <tr className="border-b whitespace-nowrap">
                                                        <td colSpan={23} className="text-left px-6 py-4 text-xs font-bold uppercase">
                                                            {userName}
                                                        </td>
                                                    </tr>
                                                    {userPosts.map((post) => (
                                                        <React.Fragment key={post._id}>
                                                            <tr className="border-b whitespace-nowrap">
                                                                <td className="px-6 py-4 text-xs">{post.TicketReferenceNumber}</td>
                                                                <td className="px-6 py-4 text-xs">{new Date(post.TicketReceived).toLocaleString()}</td>
                                                                <td className="px-6 py-4 text-xs">{new Date(post.TicketEndorsed).toLocaleString()}</td>
                                                                <td className="px-6 py-4 text-xs">{post.CompanyName}</td>
                                                                <td className="px-6 py-4 text-xs">{post.CustomerName}</td>
                                                                <td className="px-6 py-4 text-xs">{post.ContactNumber}</td>
                                                                <td className="px-6 py-4 text-xs">{post.Email}</td>
                                                                <td className="px-6 py-4 text-xs">{post.Gender}</td>
                                                                <td className="px-6 py-4 text-xs">{post.CustomerSegment}</td>
                                                                <td className="px-6 py-4 text-xs">{post.CityAddress}</td>
                                                                <td className="px-6 py-4 text-xs">{post.Traffic}</td>
                                                                <td className="px-6 py-4 text-xs">{post.Channel}</td>
                                                                <td className="px-6 py-4 text-xs">{post.WrapUp}</td>
                                                                <td className="px-6 py-4 text-xs">{post.Source}</td>
                                                                <td className="px-6 py-4 text-xs">{post.SONumber}</td>
                                                                <td className="px-6 py-4 text-xs">{post.Amount}</td>
                                                                <td className="px-6 py-4 text-xs">{post.QtySold}</td>
                                                                <td className="px-6 py-4 text-xs">{post.PONumber}</td>
                                                                <td className="px-6 py-4 text-xs">{post.SODate}</td>
                                                                <td className="px-6 py-4 text-xs">{post.PaymentTerms}</td>
                                                                <td className="px-6 py-4 text-xs">{post.POSource}</td>
                                                                <td className="px-6 py-4 text-xs">{post.POStatus}</td>
                                                                <td className="px-6 py-4 text-xs">{post.PaymentDate}</td>
                                                                <td className="px-6 py-4 text-xs">{post.DeliveryDate}</td>
                                                                <td className="px-6 py-4 text-xs">{post.CustomerType}</td>
                                                                <td className="px-6 py-4 text-xs">{post.CustomerStatus}</td>
                                                                <td className={`px-6 py-4 text-xs ${STATUS_COLORS[post.Status]}`}>{post.Status}</td>
                                                                <td className="px-6 py-4 text-xs">{post.Department}</td>
                                                                <td className="px-6 py-4 text-xs">{post.SalesManager}</td>
                                                                <td className="px-6 py-4 text-xs">{post.SalesAgent}</td>
                                                                <td className={`px-6 py-4 text-xs ${REMARKS_COLORS[post.Remarks]}`}>{post.Remarks}</td>
                                                                <td className="px-6 py-4 text-xs capitalize">
                                                                    {post.Inquiries?.length > 20
                                                                        ? `${post.Inquiries.substring(0, 20)}...`
                                                                        : post.Inquiries}
                                                                </td>
                                                                <td className="px-6 py-4 text-xs">
                                                                    <select
                                                                        onChange={(e) => handleDropdownAction(e.target.value, post)}
                                                                        className="text-xs px-2 py-1 border rounded text-gray-700 bg-white hover:bg-gray-100"
                                                                        defaultValue=""
                                                                    >
                                                                        <option value="" disabled>
                                                                            Select Action
                                                                        </option>
                                                                        <option value="edit">✏️ Edit</option>
                                                                        <option value="status">📊 Change Status</option>
                                                                        <option value="remarks">📝 Change Remarks</option>
                                                                        <option value="delete">❌ Delete</option>
                                                                    </select>
                                                                </td>
                                                            </tr>

                                                            {/* Modal for Status */}
                                                            {statusMenuVisible[post._id] &&
                                                                ReactDOM.createPortal(
                                                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]">
                                                                        <div className="bg-white w-80 rounded-lg shadow-lg p-4 z-[1000]">
                                                                            <h3 className="text-sm font-semibold mb-4">📊 Change Status</h3>
                                                                            <select
                                                                                onChange={(e) => setSelectedStatus(e.target.value)}
                                                                                className="w-full text-xs px-3 py-2 border rounded text-gray-700 bg-white hover:bg-gray-100"
                                                                            >
                                                                                <option value="" disabled>
                                                                                    Select Status
                                                                                </option>
                                                                                {Object.keys(STATUS_COLORS).map((status) => (
                                                                                    <option key={status} value={status}>
                                                                                        {status}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                            <div className="flex justify-end mt-4">
                                                                                <button
                                                                                    onClick={() => setStatusMenuVisible((prev) => ({ ...prev, [post._id]: false }))}
                                                                                    className="text-xs px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded mr-2"
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleStatusUpdate(post._id, selectedStatus)}
                                                                                    className="text-xs px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                                                                                >
                                                                                    Save
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>,
                                                                    document.body
                                                                )}

                                                            {remarksMenuVisible[post._id] &&
                                                                ReactDOM.createPortal(
                                                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]">
                                                                        <div className="bg-white w-80 rounded-lg shadow-lg p-4 z-[1000]">
                                                                            <h3 className="text-sm font-semibold mb-4">📝 Change Remarks</h3>
                                                                            <select
                                                                                onChange={(e) => setSelectedRemark(e.target.value)}
                                                                                className="w-full text-xs px-3 py-2 border rounded text-gray-700 bg-white hover:bg-gray-100"
                                                                            >
                                                                                <option value="" disabled>
                                                                                    Select Remark
                                                                                </option>
                                                                                {Object.keys(REMARKS_COLORS).map((remark) => (
                                                                                    <option key={remark} value={remark}>
                                                                                        {remark}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                            <div className="flex justify-end mt-4">
                                                                                <button
                                                                                    onClick={() => setRemarksMenuVisible((prev) => ({ ...prev, [post._id]: false }))}
                                                                                    className="text-xs px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded mr-2"
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleRemarksUpdate(post._id, selectedRemark)}
                                                                                    className="text-xs px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                                                                                >
                                                                                    Save
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>,
                                                                    document.body
                                                                )}

                                                        </React.Fragment>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                        </React.Fragment>
                                    ) : null
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <>
                    {/* Table View with Pagination */}
                    <div className="p-4 bg-white rounded-lg shadow">
                        {/* Length Menu */}
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex gap-2 items-center">
                                <label className="text-xs text-gray-700">
                                    Filter by CSR Agent:
                                    <select
                                        value={userFilter}
                                        onChange={(e) => setUserFilter(e.target.value)}
                                        className="ml-2 px-2 py-1 border rounded text-xs capitalize"
                                    >
                                        <option value="">All</option>
                                        {[...new Set(posts.map((post) => post.userName))].map((user) => (
                                            <option key={user} value={user}>
                                                {user}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <label className="text-xs text-gray-700">
                                Show
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                    className="ml-2 px-2 py-1 border rounded text-xs"
                                >
                                    {[10, 20, 50, 100, 500, 1000].map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                                entries
                            </label>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto">
                                <thead className="bg-gray-100">
                                    <tr className="text-xs text-left whitespace-nowrap border-l-4 border-emerald-400">
                                        <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Date Created</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Date Last Touch / Updated</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">CSR Agent</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Ticket No</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Ticket Received</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Ticket Endorsed</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Company</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Customer</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Contact Number</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Email</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Gender</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Client Segment</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">City Address</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Traffic</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Channel</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Wrap-Up</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Source</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">SO Number</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">SO Amount</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">QTY Sold</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">PO Number</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">SO Date</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Payment Terms</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">PO Source</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">PO Status</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Payment Date</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Delivery Date</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Customer Type</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Customer Status</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Department</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Sales Manager</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Sales Agent</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Remarks</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Inquiry / Concern</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginatedPosts.map((post) => (
                                        <tr key={post._id} className="border-b whitespace-nowrap">
                                            <td className="px-6 py-4 text-xs flex gap-1">
                                                <button onClick={() => handleEdit(post)} className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600 transition">Edit</button>
                                                <button onClick={() => handleDelete(post._id)} className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600 transition">Delete</button>
                                            </td>
                                            <td className="px-6 py-4 text-xs">{new Date(post.createdAt).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-xs">
                                                {isNaN(new Date(post.updatedAt).getTime())
                                                    ? " - "
                                                    : new Date(post.updatedAt).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-xs capitalize">{post.userName}</td>
                                            <td className="px-6 py-4 text-xs">{post.TicketReferenceNumber}</td>
                                            <td className="px-6 py-4 text-xs">{new Date(post.TicketReceived).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-xs">{new Date(post.TicketEndorsed).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-xs">{post.CompanyName}</td>
                                            <td className="px-6 py-4 text-xs">{post.CustomerName}</td>
                                            <td className="px-6 py-4 text-xs">{post.ContactNumber}</td>
                                            <td className="px-6 py-4 text-xs">{post.Email}</td>
                                            <td className="px-6 py-4 text-xs">{post.Gender}</td>
                                            <td className="px-6 py-4 text-xs">{post.CustomerSegment}</td>
                                            <td className="px-6 py-4 text-xs">{post.CityAddress}</td>
                                            <td className="px-6 py-4 text-xs">{post.Traffic}</td>
                                            <td className="px-6 py-4 text-xs">{post.Channel}</td>
                                            <td className="px-6 py-4 text-xs">{post.WrapUp}</td>
                                            <td className="px-6 py-4 text-xs">{post.Source}</td>
                                            <td className="px-6 py-4 text-xs">{post.SONumber}</td>
                                            <td className="px-6 py-4 text-xs">{post.Amount}</td>
                                            <td className="px-6 py-4 text-xs">{post.QtySold}</td>
                                            <td className="px-6 py-4 text-xs">{post.PONumber}</td>
                                            <td className="px-6 py-4 text-xs">{post.SODate}</td>
                                            <td className="px-6 py-4 text-xs">{post.PaymentTerms}</td>
                                            <td className="px-6 py-4 text-xs">{post.POSource}</td>
                                            <td className="px-6 py-4 text-xs">{post.POStatus}</td>
                                            <td className="px-6 py-4 text-xs">{post.PaymentDate}</td>
                                            <td className="px-6 py-4 text-xs">{post.DeliveryDate}</td>
                                            <td className="px-6 py-4 text-xs">{post.CustomerType}</td>
                                            <td className="px-6 py-4 text-xs">{post.CustomerStatus}</td>
                                            <td className={`px-6 py-4 text-xs ${STATUS_COLORS[post.Status]}`}>{post.Status}</td>
                                            <td className="px-6 py-4 text-xs">{post.Department}</td>
                                            <td className="px-6 py-4 text-xs">{post.SalesManager}</td>
                                            <td className="px-6 py-4 text-xs">{post.SalesAgent}</td>
                                            <td className={`px-6 py-4 text-xs ${REMARKS_COLORS[post.Remarks]}`}>{post.Remarks}</td>
                                            <td className="px-6 py-4 text-xs">
                                                {post.Inquiries?.length > 20
                                                    ? `${post.Inquiries.substring(0, 20)}...`
                                                    : post.Inquiries}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex justify-between items-center mt-4 text-xs text-gray-700">
                            <p>
                                Showing {startIndex + 1} to{" "}
                                {Math.min(startIndex + itemsPerPage, sortedPosts.length)} of{" "}
                                {sortedPosts.length} entries
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-2 py-1 border rounded ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700"
                                        }`}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-2 py-1 border rounded ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700"
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </>

            )}
        </div>
    );
};

export default ActivityTable;
