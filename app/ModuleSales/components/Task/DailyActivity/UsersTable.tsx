import React, { useEffect, useState, useRef } from "react";
import { format, parseISO, addDays, startOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { CiSquareChevLeft, CiSquareChevRight, CiViewBoard, CiViewColumn, CiViewTable, CiEdit, CiMapPin, CiTrash, CiMenuKebab, CiBookmarkPlus, CiBookmarkMinus, CiRepeat } from "react-icons/ci";
import { FcAssistant, FcCollaboration, FcBullish, FcPaid, FcAddressBook, FcFullTrash, FcAlarmClock, FcPodiumWithAudience, FcConferenceCall, FcReading } from "react-icons/fc";
import { FaMapLocationDot } from "react-icons/fa6";
import { MdLocationCity } from "react-icons/md";
import { RiUserLocationLine } from "react-icons/ri";
import moment from "moment";


interface UsersCardProps {
    posts: any[];
    handleEdit: (post: any) => void;
    handleDelete: (postId: string) => void;
    handleStatusUpdate: (postId: string, newStatus: string) => void;
    referenceid?: string;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts, handleEdit, handleStatusUpdate, handleDelete, referenceid }) => {
    const [updatedUser, setUpdatedUser] = useState<any[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<"default" | "day" | "week" | "month">("default");
    const [groupedByDate, setGroupedByDate] = useState<Record<string, any[]>>({});
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [collapsedCards, setCollapsedCards] = useState<Record<string, boolean>>({});
    const [pinnedUsers, setPinnedUsers] = useState<Set<string>>(new Set());
    const [menuVisible, setMenuVisible] = useState<{ [key: string]: boolean }>({});
    const [statusMenuVisible, setStatusMenuVisible] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openMenu && !document.getElementById(`menu-${openMenu}`)?.contains(event.target as Node)) {
                setOpenMenu(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [openMenu]);


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
            const newPinned = new Set([...prev]);
            newPinned.has(userId) ? newPinned.delete(userId) : newPinned.add(userId);
            localStorage.setItem("pinnedUsers", JSON.stringify(Array.from(newPinned)));
            return newPinned;
        });
    };

    const toggleCollapse = (userId: string) => {
        setCollapsedCards((prev) => ({
            ...prev,
            [userId]: !prev[userId], // Toggle specific card
        }));
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
            const daysInMonth = endOfMonth(currentDate).getDate();
            return Array.from({ length: daysInMonth }, (_, i) => addDays(startOfMonth(currentDate), i));
        } else {
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

    const STATUS_COLORS: Record<string, string> = {
        Cold: "bg-blue-700 text-gray-700",
        Loss: "bg-gray-500 text-dark",
        Cancelled: "bg-red-800 text-dark",
    };

    const toggleMenu = (postId: string) => {
        setMenuVisible((prev) => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const toggleStatusMenu = (postId: string) => {
        setStatusMenuVisible((prev) => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const updateStatus = (postId: string, newStatus: string) => {
        handleStatusUpdate(postId, newStatus);
        setStatusMenuVisible({});
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
      
        // Use UTC getters instead of local ones to prevent timezone shifting.
        let hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        // Convert hours to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // if hour is 0, display as 12
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
      
        // Use toLocaleDateString with timeZone 'UTC' to format the date portion
        const formattedDateStr = date.toLocaleDateString('en-US', {
          timeZone: 'UTC',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      
        // Return combined date and time string
        return `${formattedDateStr} ${hours}:${minutesStr} ${ampm}`;
      };
      
      
    return (
        <div className="mb-4">
            {/* Pagination & View Mode Buttons */}
            <div className="flex justify-start items-center mb-3">
                <div className="group inline-flex">
                    <button onClick={handlePrevious} className="text-xs flex items-center"><CiSquareChevLeft size={20} /></button>
                    <button onClick={handleNext} className="text-xs flex items-center mr-2"><CiSquareChevRight size={20} /></button>
                    <button title="Day" onClick={() => setViewMode(viewMode === "day" ? "default" : "day")} className={`text-xs flex items-center mr-2 ${viewMode === "day" ? "text-blue-500" : ""}`}>
                        <CiViewBoard size={20} />
                    </button>
                    <button title="Week" onClick={() => setViewMode(viewMode === "week" ? "default" : "week")} className={`text-xs flex items-center mr-2 ${viewMode === "week" ? "text-blue-500" : ""}`}>
                        <CiViewColumn size={20} />
                    </button>
                    <button title="Month" onClick={() => setViewMode(viewMode === "month" ? "default" : "month")} className={`text-xs flex items-center mr-2 ${viewMode === "month" ? "text-blue-500" : ""}`}>
                        <CiViewTable size={20} />
                    </button>
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
                                    <div
                                        key={user.id}
                                        className={`rounded-lg shadow-md p-4 mb-2 transition-all duration-200 transform hover:scale-105 hover:shadow-lg
                                      ${pinnedUsers.has(user.id) ? "bg-yellow-100" : user.typeclient === "CSR Inquiries" ? "" : ""}
                                      ${user.activitystatus === "Cold" ? "bg-blue-200" :
                                                user.activitystatus === "Warm" ? "bg-yellow-200" :
                                                    user.activitystatus === "Hot" ? "bg-red-200" :
                                                        user.activitystatus === "Done" ? "bg-green-200" :
                                                            user.activitystatus === "Loss" ? "bg-gray-200" :
                                                                user.activitystatus === "Cancelled" ? "bg-red-300" : "bg-gray-50"}
                                    `}
                                    >

                                        {/* Card Header - Company Names */}
                                        {!["Client Visit", "On Site", "On Field", "Assisting other Agents Client", "Updating Reports", "Coordination of SO to Warehouse", "Coordination of SO to Orders", "Email and Viber Checking", "1st Break", "Client Meeting", "Coffee Break", "Group Meeting", "Last Break", "Lunch Break", "TSM Coaching"].includes(user.activitystatus) && (
                                            <div className="card-header mb-2 pb-2 flex justify-between items-center relative">
                                                {/* CSR Inquiries Label - Centered at the Top */}
                                                {user.typeclient === "CSR Inquiries" && (
                                                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white px-2 text-red-700 font-bold text-[8px] rounded-full border border-red-700">
                                                        CSR Inquiries
                                                    </span>
                                                )}
                                                <h3
                                                    className="text-[10px] font-semibold text-gray-800 uppercase break-words flex-1"
                                                    style={{
                                                        wordBreak: "break-word", // Breaks long words properly
                                                        overflowWrap: "break-word", // Ensures text wraps when necessary
                                                    }}
                                                >
                                                    {user.companyname}
                                                </h3>
                                                <div className="relative flex items-center mt-3">
                                                    <button onClick={() => toggleCollapse(user.id)} className="text-gray-500 hover:text-gray-700">
                                                        {collapsedCards[user.id] ? <CiBookmarkMinus size={20} /> : <CiBookmarkPlus size={20} />}
                                                    </button>
                                                    <button className="text-gray-500 hover:text-gray-700" onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}>
                                                        <CiMenuKebab size={20} />
                                                    </button>
                                                    {/* Dropdown Menu */}
                                                    <div id={`menu-${user.id}`} className={`absolute right-0 mt-2 w-32 bg-white shadow-md p-2 rounded-md text-xs ${openMenu === user.id ? 'block' : 'hidden'} z-50`}>
                                                        <ul>
                                                            <li className="p-2 cursor-pointer hover:bg-gray-100 flex items-center gap-1" onClick={() => handleEdit(user)}><CiEdit /> Edit Details</li>
                                                            <li className="p-2 cursor-pointer hover:bg-gray-100 flex items-center gap-1" onClick={() => toggleStatusMenu(user.id)}><CiRepeat />Change Status</li>

                                                            {/* Status Change Menu */}
                                                            {statusMenuVisible[user.id] && (
                                                                <div className="absolute left-[-10rem] bottom-full mb-2 bg-white shadow-lg rounded-lg border w-40 z-50 mr-2 text-xs">
                                                                    {Object.keys(STATUS_COLORS).map((activitystatus) => (
                                                                        <button key={activitystatus} onClick={() => updateStatus(user.id, activitystatus)} className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-100">
                                                                            <span className={`w-3 h-3 rounded-full border border-black ${STATUS_COLORS[activitystatus].split(" ")[0]}`}></span>
                                                                            {activitystatus}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            <li className="p-2 cursor-pointer hover:bg-gray-100 flex items-center gap-1" onClick={() => handlePin(user.id)}>
                                                                <CiMapPin /> {pinnedUsers.has(user.id) ? "Unpin" : "Pin"}
                                                            </li>
                                                            <li className="p-2 cursor-pointer hover:bg-gray-100 flex items-center gap-1" onClick={() => handleDelete(user.id)}><CiTrash />Delete</li>
                                                        </ul>
                                                    </div>

                                                </div>
                                            </div>
                                        )}

                                        {/* Card Body */}
                                        {collapsedCards[user.id] && (
                                            <div className="text-[10px] capitalize">
                                                <p><strong>Type:</strong> {user.typeclient}</p>
                                                {user.typeclient === "CSR Inquiries" ? (
                                                    <>
                                                        <p><strong>Wrapup:</strong> {user.wrapup}</p>
                                                        <p><strong>Inquiries:</strong> {user.inquiries}</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p><strong>Source:</strong> {user.source}</p>
                                                        <p><strong>Product Category:</strong> {user.projectcategory}</p>
                                                        <p><strong>Quotation Number:</strong> {user.quotationnumber}</p>
                                                        <p><strong>SO Amount:</strong> {user.soamount}</p>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {/* Only show certain fields based on activitystatus */}
                                        {["Assisting other Agents Client", "Updating Reports", "Coordination of SO to Warehouse", "Coordination of SO to Orders", "Email and Viber Checking"].includes(user.activitystatus) && (
                                            <div className="mt-2 text-xs">
                                                {/* Background and Icon Changes based on Activity Status */}
                                                <div className={`p-2 rounded-lg text-white flex items-center gap-2
                                                ${user.activitystatus === "Assisting other Agents Client" ? "bg-blue-500" :
                                                        user.activitystatus === "Updating Reports" ? "bg-yellow-500" :
                                                            user.activitystatus === "Coordination of SO to Warehouse" ? "bg-green-500" :
                                                                user.activitystatus === "Coordination of SO to Orders" ? "bg-orange-500" :
                                                                    user.activitystatus === "Email and Viber Checking" ? "bg-violet-500" :
                                                                        user.activitystatus === "1st Break" ? "bg-red-500" :
                                                                            ""}`}>

                                                    {/* Icon based on activitystatus */}
                                                    {user.activitystatus === "Assisting other Agents Client" && (<FcAssistant size={20} />)}
                                                    {user.activitystatus === "Updating Reports" && (<FcBullish size={20} />)}
                                                    {user.activitystatus === "Coordination of SO to Warehouse" && (<FcCollaboration size={20} />)}
                                                    {user.activitystatus === "Coordination of SO to Orders" && (<FcPaid size={20} />)}
                                                    {user.activitystatus === "Email and Viber Checking" && (<FcAddressBook size={20} />)}
                                                    {user.activitystatus === "1st Break" && (<FcAlarmClock size={20} />)}

                                                    <div className="flex items-center justify-between w-full">
                                                        <p>{user.activitystatus}</p>
                                                        <FcFullTrash size={16} className="ml-2 cursor-pointer" onClick={() => handleDelete(user.id)} />
                                                    </div>
                                                </div>
                                                <p className="mt-2"><strong>Activity Remarks:</strong> {user.activityremarks}</p>
                                                <p className="text-[10px]"><strong>Duration:</strong> {user.startdate} - {user.enddate}</p>
                                            </div>
                                        )}

                                        {/* Only show certain fields based on activitystatus */}
                                        {["1st Break", "Client Meeting", "Coffee Break", "Group Meeting", "Last Break", "Lunch Break", "TSM Coaching"].includes(user.activitystatus) && (
                                            <div className="mt-2 text-xs">
                                                {/* Background and Icon Changes based on Activity Status */}
                                                <div className={`p-2 rounded-lg text-white flex items-center gap-2
                                                ${user.activitystatus === "1st Break" ? "bg-red-500" :
                                                        user.activitystatus === "Client Meeting" ? "bg-blue-300" :
                                                            user.activitystatus === "Coffee Break" ? "bg-gray-700" :
                                                                user.activitystatus === "Group Meeting" ? "bg-gray-400" :
                                                                    user.activitystatus === "Last Break" ? "bg-red-500" :
                                                                        user.activitystatus === "Lunch Break" ? "bg-red-400" :
                                                                            user.activitystatus === "TSM Coaching" ? "bg-gray-800" :
                                                                                ""}`}>

                                                    {user.activitystatus === "1st Break" && (<FcAlarmClock size={20} />)}
                                                    {user.activitystatus === "Client Meeting" && (<FcPodiumWithAudience size={20} />)}
                                                    {user.activitystatus === "Coffee Break" && (<FcAlarmClock size={20} />)}
                                                    {user.activitystatus === "Group Meeting" && (<FcConferenceCall size={20} />)}
                                                    {user.activitystatus === "Last Break" && (<FcAlarmClock size={20} />)}
                                                    {user.activitystatus === "Lunch Break" && (<FcAlarmClock size={20} />)}
                                                    {user.activitystatus === "TSM Coaching" && (<FcReading size={20} />)}

                                                    <div className="flex items-center justify-between w-full">
                                                        <p>{user.activitystatus}</p>
                                                        <FcFullTrash size={16} className="ml-2 cursor-pointer" onClick={() => handleDelete(user.id)} />
                                                    </div>
                                                </div>
                                                <p className="text-[10px]"><strong>Duration:</strong> {user.startdate} - {user.enddate}</p>
                                            </div>
                                        )}

                                        {/* Only show certain fields based on activitystatus */}
                                        {["Client Visit", "On Site", "On Field"].includes(user.activitystatus) && (
                                            <div className="mt-2 text-xs">
                                                {/* Background and Icon Changes based on Activity Status */}
                                                <div className={`p-2 rounded-lg text-white flex items-center gap-2
                                                ${user.activitystatus === "Client Visit" ? "bg-gray-700" :
                                                        user.activitystatus === "On Site" ? "bg-violet-700" :
                                                            user.activitystatus === "On Field" ? "bg-yellow-700" :
                                                                ""}`}>

                                                    {user.activitystatus === "Client Visit" && (<FaMapLocationDot size={20} />)}
                                                    {user.activitystatus === "On Site" && (<MdLocationCity size={20} />)}
                                                    {user.activitystatus === "On Field" && (<RiUserLocationLine size={20} />)}

                                                    <div className="flex items-center justify-between w-full">
                                                        <p>{user.activitystatus}</p>
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-[10px]"><strong>Location:</strong>: {user.activityremarks}</p>
                                                <p className="text-[10px]"><strong>Duration:</strong> {user.startdate} - {user.enddate}</p>

                                            </div>
                                        )}

                                        {/* Status Badge */}
                                        {!["Client Visit", "On Site", "On Field", "Assisting other Agents Client", "Updating Reports", "Coordination of SO to Warehouse", "Coordination of SO to Orders", "Email and Viber Checking", "1st Break", "Client Meeting", "Coffee Break", "Group Meeting", "Last Break", "Lunch Break", "TSM Coaching"].includes(user.activitystatus) && (
                                            <div className="card-footer text-xs flex justify-between items-center mt-2 pt-2">
                                               
                                                <p className="text-[10px]"><strong>Date Created:</strong> {formatDate(user.date_created)}</p>
                                             

                                                {/* Status Badge with Glow Effect */}
                                                <span
                                                    className={`relative px-2 py-1 rounded-full text-white text-[8px] 
                                                        ${user.activitystatus === "Cold" ? "bg-blue-700" :
                                                            user.activitystatus === "Warm" ? "bg-yellow-700" :
                                                                user.activitystatus === "Hot" ? "bg-red-700" :
                                                                    user.activitystatus === "Done" ? "bg-green-700" :
                                                                        user.activitystatus === "Loss" ? "bg-gray-500" :
                                                                            user.activitystatus === "Cancelled" ? "bg-red-800" :
                                                                                "bg-gray-500"
                                                        }`}
                                                >
                                                    {/* Glow Effect */}
                                                    {!["Client Visit", "On Site", "On Field", "Assisting other Agents Client", "Updating Reports", "Coordination of SO to Warehouse", "Coordination of SO to Orders", "Email and Viber Checking", "1st Break", "Client Meeting", "Coffee Break", "Group Meeting", "Last Break", "Lunch Break", "TSM Coaching"].includes(user.activitystatus) && (
                                                        <div
                                                            className="absolute inset-0 rounded-full border-2 border-yellow-500 animate-[pulse_2s_infinite] shadow-lg shadow-blue-500/50"
                                                        ></div>
                                                    )}
                                                    {/* Activity Status Text */}
                                                    <span className="relative z-10">{user.activitystatus}</span>
                                                </span>


                                            </div>
                                        )}

                                        {pinnedUsers.has(user.id) && (
                                            <div className="card-footer text-[10px] text-left mt-2 pt-2 font-semibold text-green-600 flex items-center gap-1">
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

export default React.memo(UsersCard);