import React, { useEffect, useState } from "react";
import { CiSquareChevLeft, CiSquareChevRight } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";

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
    CityAddress: string;
    CustomerSegment: string;
    Channel: string;
    Source: string;
    WrapUp: string;
    CustomerType: string;
    TicketEndorsed: string;
    TicketReceived: string;
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
    const [menuState, setMenuState] = useState<{ [key: string]: string | null }>({});
    const [statusMenuVisible, setStatusMenuVisible] = useState<{ [key: string]: boolean }>({});
    const [remarksMenuVisible, setRemarksMenuVisible] = useState<{ [key: string]: boolean }>({});
    const [todayDate, setTodayDate] = useState<string>("");
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    const getFormattedDate = (date: Date) => {
        const dayOfWeek = daysOfWeek[date.getDay()];
        const month = date.toLocaleString("default", { month: "short" });
        return `${month} ${date.getDate()}-${dayOfWeek.slice(0, 3)}`;
    };

    useEffect(() => {
        // Group posts by day first, then by username
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

    const toggleMenu = (postId: string, menuType: string) => {
        setMenuState((prevState) => ({
            ...prevState,
            [postId]: prevState[postId] === menuType ? null : menuType,
        }));
    };

    const toggleStatusMenu = (postId: string) => {
        setStatusMenuVisible({ [postId]: !statusMenuVisible[postId] });
        setRemarksMenuVisible({});
    };

    const toggleRemarksMenu = (postId: string) => {
        setRemarksMenuVisible({ [postId]: !remarksMenuVisible[postId] });
        setStatusMenuVisible({});
    };

    const updateStatus = (postId: string, newStatus: string) => {
        handleStatusUpdate(postId, newStatus);
        setStatusMenuVisible({});
    };

    const updateRemarks = (postId: string, newRemarks: string) => {
        handleRemarksUpdate(postId, newRemarks);
        setRemarksMenuVisible({});
    };

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

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
                <button onClick={handlePrevDate} className="rounded">
                    <CiSquareChevLeft size={30} />
                </button>
                <h3 className="text-md font-bold">{currentFormattedDate}</h3>
                <button onClick={handleNextDate} className="rounded">
                    <CiSquareChevRight size={30} />
                </button>
            </div>

            <table className="w-full border-collapse border border-gray-300 text-xs">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Ticket No</th>
                        <th className="border p-2">Company</th>
                        <th className="border p-2">Customer</th>
                        <th className="border p-2">Contact</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Remarks</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(groupedPosts).map((day) =>
                        day === currentFormattedDate ? (
                            <React.Fragment key={day}>
                                <tr className="bg-gray-300">
                                    <td colSpan={7} className="text-left p-2 font-bold">{day}</td>
                                </tr>
                                {Object.entries(groupedPosts[day]).map(([userName, userPosts]) => (
                                    <React.Fragment key={userName}>
                                        <tr className="bg-gray-200">
                                            <td colSpan={7} className="text-left p-2 font-bold uppercase">{userName}</td>
                                        </tr>
                                        {userPosts.map((post) => (
                                            <tr key={post._id} className="hover:bg-gray-50 capitalize">
                                                <td className="border p-2">{post.TicketReferenceNumber}</td>
                                                <td className="border p-2">{post.CompanyName}</td>
                                                <td className="border p-2">{post.CustomerName}</td>
                                                <td className="border p-2">
                                                    {post.ContactNumber} / {post.Email}
                                                </td>
                                                <td className={`border p-2 ${STATUS_COLORS[post.Status]}`}>{post.Status}</td>
                                                <td className={`border p-2 ${REMARKS_COLORS[post.Remarks]}`}>{post.Remarks}</td>
                                                <td className="border p-2 relative">
                                                    <button
                                                        onClick={() => toggleMenu(post._id, "menu")}
                                                        className="text-gray-500 hover:text-gray-800"
                                                    >
                                                        <BsThreeDotsVertical size={12} />
                                                    </button>
                                                    {menuState[post._id] === "menu" && (
                                                        <div className="absolute right-4 top-12 bg-white shadow-lg rounded-lg border w-32 z-10 text-xs">
                                                            <button
                                                                onClick={() => handleEdit(post)}
                                                                className="w-full px-4 py-2 hover:bg-gray-100"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => toggleStatusMenu(post._id)}
                                                                className="w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                            >
                                                                Change Status
                                                            </button>
                                                            <button
                                                                onClick={() => toggleRemarksMenu(post._id)}
                                                                className="w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                            >
                                                                Change Remarks
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(post._id)}
                                                                className="w-full px-4 py-2 text-red-500 hover:bg-gray-100"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                    {/* Status Change Menu */}
                                                    {statusMenuVisible[post._id] && (
                                                        <div className="absolute right-16 top-20 bg-white shadow-lg rounded-lg border w-50 z-20 text-xs">
                                                            {Object.keys(STATUS_COLORS).map((status) => (
                                                                <button
                                                                    key={status}
                                                                    onClick={() => updateStatus(post._id, status)}
                                                                    className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-100"
                                                                >
                                                                    <span
                                                                        className={`w-3 h-3 rounded-full border border-black ${STATUS_COLORS[status].split(" ")[0]}`}
                                                                    ></span>
                                                                    {status}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Remarks Change Menu */}
                                                    {remarksMenuVisible[post._id] && (
                                                        <div className="absolute right-16 top-20 bg-white shadow-lg rounded-lg border w-100 z-20 text-xs">
                                                            {Object.keys(REMARKS_COLORS).map((remark) => (
                                                                <button
                                                                    key={remark}
                                                                    onClick={() => updateRemarks(post._id, remark)}
                                                                    className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-100"
                                                                >
                                                                    <span
                                                                        className={`w-3 h-3 rounded-full border border-black ${REMARKS_COLORS[remark]}`}
                                                                    ></span>
                                                                    {remark}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </React.Fragment>
                        ) : null
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ActivityTable;
