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
    "No Stocks / Insufficient Stocks": "border-gray-500",
    "Item Not Carried": "border-black",
    "Quotation For Approval": "border-orange-400",
    "Customer Requested Cancellation": "border-red-500",
    "Accreditation / Partnership": "border-blue-500",
    "For Spf": "border-purple-500",
    "No Response From Client": "border-yellow-500",
    Assisted: "border-green-500",
    "Disapproved Quotation": "border-red-600",
    "For Site Visit": "border-indigo-500",
    "Non Standard Item": "border-teal-500",
    "PO Received": "border-green-600",
    "Not Converted to Sales": "border-gray-700",
    "For Occular Inspection": "border-blue-600",
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

    const [todayDate, setTodayDate] = useState<string>("");
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    const getFormattedDate = (date: Date) => {
        const dayOfWeek = daysOfWeek[date.getDay()];
        const month = date.toLocaleString("default", { month: "short" });
        return `${month} ${date.getDate()}-${dayOfWeek.slice(0, 3)}`;
    };

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
                <table className="bg-white border border-gray-200 text-xs">
                    <thead>
                        <tr className="bg-gray-200 text-left whitespace-nowrap">
                            <th className="border p-2">Ticket No</th>
                            <th className="border p-2">Ticket Received</th>
                            <th className="border p-2">Ticket Endorsed</th>
                            <th className="border p-2">Company</th>
                            <th className="border p-2">Customer</th>
                            <th className="border p-2">Contact Number</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Gender</th>
                            <th className="border p-2">Client Segment</th>
                            <th className="border p-2">City Address</th>
                            <th className="border p-2">Traffic</th>
                            <th className="border p-2">Channel</th>
                            <th className="border p-2">Wrap-Up</th>
                            <th className="border p-2">Source</th>
                            <th className="border p-2">Customer Type</th>
                            <th className="border p-2">Customer Status</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Department</th>
                            <th className="border p-2">Sales Manager</th>
                            <th className="border p-2">Sales Agent</th>
                            <th className="border p-2">Remarks</th>
                            <th className="border p-2">Inquiry / Concern</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(groupedPosts).map((day) =>
                            day === currentFormattedDate ? (
                                <React.Fragment key={day}>
                                    {Object.entries(groupedPosts[day]).map(([userName, userPosts]) => (
                                        <React.Fragment key={userName}>
                                            <tr className="bg-gray-200">
                                                <td colSpan={23} className="text-left p-2 font-bold uppercase">
                                                    {userName}
                                                </td>
                                            </tr>
                                            {userPosts.map((post) => (
                                                <React.Fragment key={post._id}>
                                                    <tr className="border text-left whitespace-nowrap">
                                                        <td className="border p-2">{post.TicketReferenceNumber}</td>
                                                        <td className="border p-2">{new Date(post.TicketReceived).toLocaleString()}</td>
                                                        <td className="border p-2">{new Date(post.TicketEndorsed).toLocaleString()}</td>
                                                        <td className="border p-2">{post.CompanyName}</td>
                                                        <td className="border p-2">{post.CustomerName}</td>
                                                        <td className="border p-2">{post.ContactNumber}</td>
                                                        <td className="border p-2">{post.Email}</td>
                                                        <td className="border p-2">{post.Gender}</td>
                                                        <td className="border p-2">{post.CustomerSegment}</td>
                                                        <td className="border p-2">{post.CityAddress}</td>
                                                        <td className="border p-2">{post.Traffic}</td>
                                                        <td className="border p-2">{post.Channel}</td>
                                                        <td className="border p-2">{post.WrapUp}</td>
                                                        <td className="border p-2">{post.Source}</td>
                                                        <td className="border p-2">{post.CustomerType}</td>
                                                        <td className="border p-2">{post.CustomerStatus}</td>
                                                        <td className={`border p-2 ${STATUS_COLORS[post.Status]}`}>{post.Status}</td>
                                                        <td className="border p-2">{post.Department}</td>
                                                        <td className="border p-2">{post.SalesManager}</td>
                                                        <td className="border p-2">{post.SalesAgent}</td>
                                                        <td className={`border p-2 ${REMARKS_COLORS[post.Remarks]}`}>{post.Remarks}</td>
                                                        <td className="border p-2">
                                                            {post.Inquiries?.length > 20
                                                                ? `${post.Inquiries.substring(0, 20)}...`
                                                                : post.Inquiries}
                                                        </td>
                                                        <td className="border p-2">
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
                                                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[500]">
                                                                <div className="bg-white w-80 rounded-lg shadow-lg p-4 z-[500]">
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
        </div>
    );
};

export default ActivityTable;
