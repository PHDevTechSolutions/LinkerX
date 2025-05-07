import React, { useEffect, useState } from "react";
import { format, parseISO, addDays, startOfWeek, endOfMonth, startOfMonth, differenceInSeconds, isValid } from "date-fns";
import { CiSquareChevLeft, CiSquareChevRight } from "react-icons/ci";
import { MdOutlineCalendarViewMonth, MdOutlineCalendarViewWeek, MdOutlineCalendarViewDay } from "react-icons/md";
import { FcClock } from "react-icons/fc";

interface UsersCardProps {
    posts: any[];
    handleDelete: (postId: string) => void;
    referenceid?: string;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts }) => {
    const [updatedUser, setUpdatedUser] = useState<any[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<"default" | "day" | "week" | "month">("default");
    const [now, setNow] = useState(new Date()); // 🔥 Real-time clock

    useEffect(() => {
        setUpdatedUser(posts);
    }, [posts]);

    useEffect(() => {
        // 🔥 Update time every second
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const getFilteredDates = () => {
        if (viewMode === "day") return [currentDate];
        if (viewMode === "week") return Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(currentDate), i));
        if (viewMode === "month") return Array.from({ length: endOfMonth(currentDate).getDate() }, (_, i) => addDays(startOfMonth(currentDate), i));
        return Array.from({ length: 4 }, (_, i) => addDays(currentDate, -i)).reverse();
    };

    const handleNext = () => {
        setCurrentDate((prevDate) =>
            viewMode === "day" ? addDays(prevDate, 1) :
                viewMode === "week" ? addDays(prevDate, 7) :
                    viewMode === "month" ? addDays(prevDate, 30) :
                        addDays(prevDate, 4)
        );
    };

    const handlePrevious = () => {
        setCurrentDate((prevDate) =>
            viewMode === "day" ? addDays(prevDate, -1) :
                viewMode === "week" ? addDays(prevDate, -7) :
                    viewMode === "month" ? addDays(prevDate, -30) :
                        addDays(prevDate, -4)
        );
    };

    const formattedDates = getFilteredDates();

    return (
        <div className="mb-4">
            {/* Pagination & View Mode Buttons */}
            <div className="flex justify-start items-center mb-3">
                <div className="group inline-flex">
                    <button onClick={handlePrevious} className="text-xs flex items-center">
                        <CiSquareChevLeft size={30} />
                    </button>
                    <button onClick={handleNext} className="text-xs flex items-center mr-2">
                        <CiSquareChevRight size={30} />
                    </button>
                    <button title="Day"
                        onClick={() => setViewMode(viewMode === "day" ? "default" : "day")}
                        className={`text-xs flex items-center mr-2 ${viewMode === "day" ? "text-blue-500" : ""}`}
                    >
                        <MdOutlineCalendarViewDay size={20} />
                    </button>
                    <button title="Weekly"
                        onClick={() => setViewMode(viewMode === "week" ? "default" : "week")}
                        className={`text-xs flex items-center mr-2 ${viewMode === "week" ? "text-blue-500" : ""}`}
                    >
                        <MdOutlineCalendarViewWeek size={20} />
                    </button>
                    <button title="Monthly"
                        onClick={() => setViewMode(viewMode === "month" ? "default" : "month")}
                        className={`text-xs flex items-center mr-2 ${viewMode === "month" ? "text-blue-500" : ""}`}
                    >
                        <MdOutlineCalendarViewMonth size={20} />
                    </button>
                </div>

                <h3 className="text-xs font-semibold ml-4">
                    {format(formattedDates[0], "dd MMM yyyy")} - {format(formattedDates[formattedDates.length - 1], "dd MMM yyyy")}
                </h3>
            </div>

            {/* User Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formattedDates.map((day) => {
                    const formattedDay = format(day, "yyyy-MM-dd");

                    // Now filtering based on `callback`
                    const usersForDate = updatedUser.filter(user =>
                        user.callback && format(parseISO(user.callback), "yyyy-MM-dd") === formattedDay
                    );

                    return (
                        <div key={formattedDay} className="border rounded p-2 bg-white shadow-md">
                            
                            <h4 className="text-center font-semibold text-xs mb-2 text-gray-700">
                                <div className="flex">
                                    <span className="text-4xl mr-2 font-light">{format(day, "dd")}</span>
                                    <div className="flex flex-col text-left">
                                        <span className="text-sm">{format(day, "EEEE")}</span>
                                        <span className="text-[10px] text-gray-500">{format(day, "yyyy")}</span>
                                    </div>
                                </div>
                            </h4>

                            <div>
                                {usersForDate.length > 0 ? (
                                    usersForDate.map((user) => {
                                        const callbackDate = user.callback ? parseISO(user.callback) : null;
                                        const startDate = parseISO(user.date_created);

                                        const isValidCallback = callbackDate && isValid(callbackDate);
                                        const timeRemaining = isValidCallback ? differenceInSeconds(callbackDate, now) : 0;
                                        const totalDuration = isValidCallback ? differenceInSeconds(callbackDate, startDate) : 0;
                                        const progress = totalDuration > 0 ? ((totalDuration - timeRemaining) / totalDuration) * 100 : 0;

                                        const isCallbackReached = timeRemaining <= 0;

                                        return (
                                            <div
                                                key={user.id}
                                                className={`relative rounded-lg shadow p-4 mb-2 border transition-all ${isCallbackReached ? "bg-green-500 text-white" : "bg-white text-gray-800"
                                                    }`}
                                            >
                                                {/* Card Header - Company Name & Clock */}
                                                <div className="flex justify-between items-center">
                                                    <h3 className={`text-xs font-semibold uppercase ${isCallbackReached ? "text-white" : "text-gray-800"
                                                        }`}>
                                                        {user.companyname}
                                                    </h3>

                                                    <div className="relative group">
                                                        <FcClock className={`ml-2 cursor-pointer ${isCallbackReached ? "hidden" : ""}`} />
                                                    </div>
                                                </div>

                                                {/* Card Content - Callback & Timer */}
                                                <div className="mt-2 text-xs">
                                                    {isValidCallback && !isCallbackReached && (
                                                        <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                                                            <div
                                                                className="bg-green-500 h-1 rounded-full transition-all"
                                                                style={{ width: `${progress}%` }}
                                                            ></div>
                                                        </div>
                                                    )}

                                                    {isCallbackReached ? (
                                                        <p className="font-semibold mt-1">Callback time reached!</p>
                                                    ) : (
                                                        <p className="text-red-600 font-semibold mt-1">
                                                            Time left: {Math.floor(timeRemaining / 3600)}h{" "}
                                                            {Math.floor((timeRemaining % 3600) / 60)}m{" "}
                                                            {timeRemaining % 60}s
                                                        </p>
                                                    )}

                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center text-[8px] py-2 text-xs text-gray-500">No callback</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UsersCard;
