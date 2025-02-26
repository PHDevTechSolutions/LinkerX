import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { format, parseISO, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay, isWithinInterval } from "date-fns";
import { CiSquareChevLeft, CiSquareChevRight, CiEdit, CiCalendar, CiMapPin, CiTrash} from "react-icons/ci";
import { BsThreeDotsVertical, BsPlus, BsDash } from "react-icons/bs";
import { MdOutlineCalendarViewMonth, MdOutlineCalendarViewWeek, MdOutlineCalendarViewDay } from "react-icons/md";

const socketURL = "http://localhost:3001";

interface UsersCardProps {
    posts: any[];
    handleEdit: (post: any) => void;
    referenceid?: string;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts, handleEdit, referenceid }) => {
    const socketRef = useRef(io(socketURL));
    const [updatedUser, setUpdatedUser] = useState<any[]>([]); 
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<"default" | "day" | "week" | "month">("default");
    const [groupedByDate, setGroupedByDate] = useState<Record<string, any[]>>({});
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [collapsed, setCollapsed] = useState<boolean>(true);
    const [pinnedUsers, setPinnedUsers] = useState<Set<string>>(new Set());

    useEffect(() => {
        const storedPinned = localStorage.getItem("pinnedUsers");
        if (storedPinned) {
            try {
                setPinnedUsers(new Set(JSON.parse(storedPinned)));
            } catch (error) {
                console.error("Error parsing pinnedUsers from localStorage:", error);
            }
        }
    }, []);

    const handlePin = (userId: string) => {
        setPinnedUsers((prev) => {
            const newPinned = new Set(prev);
            if (newPinned.has(userId)) {
                newPinned.delete(userId);
            } else {
                newPinned.add(userId);
            }
            localStorage.setItem("pinnedUsers", JSON.stringify([...newPinned]));
            return newPinned;
        });
    };

    useEffect(() => {
        setUpdatedUser(posts);
    }, [posts]);

    useEffect(() => {
        const grouped = updatedUser.reduce((acc, user) => {
            const dateKey = format(parseISO(user.date_created), "yyyy-MM-dd");
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(user);
            return acc;
        }, {} as Record<string, any[]>);
        setGroupedByDate(grouped);
    }, [updatedUser]);

    const getFilteredDates = () => {
        if (viewMode === "day") {
            return [currentDate];
        } else if (viewMode === "week") {
            return Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(currentDate), i));
        } else if (viewMode === "month") {
            return Array.from({ length: 31 }, (_, i) => addDays(startOfMonth(currentDate), i)).filter(
                (date) => date <= endOfMonth(currentDate)
            );
        } else {
            // Default view: Show the last 4 days
            return Array.from({ length: 4 }, (_, i) => addDays(currentDate, -i)).reverse();
        }
    };

    const handleNext = () => {
        setCurrentDate((prevDate) =>
            viewMode === "day" ? addDays(prevDate, 1) : viewMode === "week" ? addDays(prevDate, 7) : viewMode === "month" ? addDays(prevDate, 30) : addDays(prevDate, 4)
        );
    };

    const handlePrevious = () => {
        setCurrentDate((prevDate) =>
            viewMode === "day" ? addDays(prevDate, -1) : viewMode === "week" ? addDays(prevDate, -7) : viewMode === "month" ? addDays(prevDate, -30) : addDays(prevDate, -4)
        );
    };

    const formattedDates = getFilteredDates();

    return (
        <div className="mb-4">
            {/* Pagination & View Mode Buttons */}
            <div className="flex justify-start items-center mb-3">
                <div className="group inline-flex">
                    <button onClick={handlePrevious} className="text-xs flex items-center"><CiSquareChevLeft size={30} /></button>
                    <button onClick={handleNext} className="text-xs flex items-center mr-2"><CiSquareChevRight size={30} /></button>
                    <button onClick={() => setViewMode("day")} className={`text-xs flex items-center mr-2 ${viewMode === "day" ? "text-blue-500" : ""}`}><MdOutlineCalendarViewDay size={20} /></button>
                    <button onClick={() => setViewMode("week")} className={`text-xs flex items-center mr-2 ${viewMode === "week" ? "text-blue-500" : ""}`}><MdOutlineCalendarViewWeek size={20} /></button>
                    <button onClick={() => setViewMode("month")} className={`text-xs flex items-center mr-2 ${viewMode === "month" ? "text-blue-500" : ""}`}><MdOutlineCalendarViewMonth size={20} /></button>
                </div>
                <h3 className="text-xs font-semibold mr-4">{format(formattedDates[0], "dd MMM yyyy")} - {format(formattedDates[formattedDates.length - 1], "dd MMM yyyy")}</h3>
            </div>

            {/* User Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0">
                {formattedDates.map((day) => {
                    const formattedDay = format(day, "yyyy-MM-dd");
                    const usersForDate = updatedUser.filter(user => format(parseISO(user.date_created), "yyyy-MM-dd") === formattedDay);
                    // Separate pinned users from unpinned
                    const pinned = usersForDate.filter(user => pinnedUsers.has(user.id));
                    const unpinned = usersForDate.filter(user => !pinnedUsers.has(user.id));

                    return (
                        <div key={formattedDay} className="border rounded p-2 bg-white mb-4">
                            <h4 className="text-center font-semibold text-xs mb-2 text-gray-700">
                                {format(day, "dd")} | {format(day, "EE")}
                            </h4>
                            <div>
                            {[...pinned, ...unpinned].map(user => (
                                    <div key={user.id} className={`border rounded-lg shadow-md p-4 mb-2 ${pinnedUsers.has(user.id) ? 'bg-yellow-100' : 'bg-gray-50'}`}>
                                        {/* Card Header - Company Name with 3-dot menu */}
                                        <div className="card-header mb-2 border-b-2 pb-2 flex justify-between items-center">
                                            <h3 className="text-xs font-semibold text-gray-800 uppercase">{user.companyname}</h3>
                                            <div className="relative">
                                                <button
                                                    onClick={() => setCollapsed(collapsed === user.id ? null : user.id)}
                                                    className="text-gray-500 hover:text-gray-700">
                                                    {collapsed === user.id ? <BsDash size={16} /> : <BsPlus size={16} />}
                                                </button>
                                                <button
                                                    className="text-gray-500 hover:text-gray-700"
                                                    onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}>
                                                    <BsThreeDotsVertical size={16} />
                                                </button>
                                                {/* Dropdown Menu */}
                                                <div className={`absolute right-0 mt-2 w-32 bg-white shadow-md p-2 rounded-md text-xs ${openMenu === user.id ? 'block' : 'hidden'}`}>
                                                    <ul>
                                                        <li className="p-2 cursor-pointer hover:bg-gray-100 flex items-center gap-1" onClick={() => handleEdit(user)}><CiEdit /> Edit Details</li>
                                                        <li className="p-2 cursor-pointer hover:bg-gray-100 flex items-center gap-1"><CiCalendar />Callback</li>
                                                        <li className="p-2 cursor-pointer hover:bg-gray-100 flex items-center gap-1" onClick={() => handlePin(user.id)}>
                                                                <CiMapPin /> {pinnedUsers.has(user.id) ? "Unpin" : "Pin"}
                                                            </li>
                                                        <li className="p-2 cursor-pointer hover:bg-gray-100 flex items-center gap-1"><CiTrash />Delete</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        {collapsed !== user.id && (
                                            <div className="text-xs">
                                                <p><strong>Source:</strong> {user.source}</p>
                                                <p><strong>Product Category:</strong> {user.projectcategory}</p>
                                                <p><strong>Quotation Number:</strong> {user.quotationnumber}</p>
                                                <p><strong>SO Amount:</strong> {user.soamount}</p>
                                            </div>
                                        )}

                                        {/* Card Footer */}
                                        <div className="card-footer text-xs text-left mt-2 border-t-2 pt-2">
                                            <p><strong>Date Created:</strong> {format(parseISO(user.date_created), "MMM dd, yyyy - h:mm:ss a")}</p>
                                        </div>
                                        {pinnedUsers.has(user.id) && (
                                            <div className="card-footer text-xs text-left mt-2 border-t pt-2 font-semibold text-green-600 flex items-center gap-1">
                                                <span>&#10003;</span> Pinned
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {groupedByDate[formattedDay]?.length === 0 && <div className="text-center py-2 text-xs text-gray-500">No accounts available</div>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UsersCard;
