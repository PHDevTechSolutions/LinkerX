import React, { useEffect, useState } from "react";
import {
  format,
  parseISO,
  addDays,
  startOfWeek,
  endOfMonth,
  startOfMonth,
  differenceInSeconds,
  isValid,
  isToday,
  formatDistanceToNow,
} from "date-fns";
import {
  CiSquareChevLeft,
  CiSquareChevRight,
} from "react-icons/ci";
import {
  MdOutlineCalendarViewMonth,
  MdOutlineCalendarViewWeek,
  MdOutlineCalendarViewDay,
} from "react-icons/md";
import { FcClock } from "react-icons/fc";

// Import Tooltip as named import (react-tooltip v5+)
import { Tooltip } from "react-tooltip";

interface UsersCardProps {
  posts: any[];
  handleDelete?: (postId: string) => void;
  referenceid?: string;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts }) => {
  const [updatedUser, setUpdatedUser] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"default" | "day" | "week" | "month">("default");
  const [now, setNow] = useState(new Date());
  const [filterInitial, setFilterInitial] = useState<string>("All");

  useEffect(() => {
    setUpdatedUser(posts);
  }, [posts]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getFilteredDates = () => {
    if (viewMode === "day") return [currentDate];
    if (viewMode === "week") return Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(currentDate), i));
    if (viewMode === "month") {
      const daysInMonth = endOfMonth(currentDate).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => addDays(startOfMonth(currentDate), i));
    }
    return Array.from({ length: 4 }, (_, i) => addDays(currentDate, -3 + i));
  };

  const handleDateChange = (direction: "next" | "previous") => {
    const offset = viewMode === "day" ? 1 : viewMode === "week" ? 7 : viewMode === "month" ? 30 : 4;
    setCurrentDate(prev => addDays(prev, direction === "next" ? offset : -offset));
  };

  const formattedDates = getFilteredDates();

  const filteredUsers = filterInitial === "All"
    ? updatedUser
    : updatedUser.filter(user => user.companyname?.[0]?.toUpperCase() === filterInitial);

  const initials = Array.from(new Set(updatedUser.map(u => u.companyname?.[0]?.toUpperCase()).filter(Boolean))).sort();

  if (!posts.length) {
    return (
      <div className="p-6">
        <p className="text-center text-gray-500">Loading callbacks...</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => handleDateChange("previous")} aria-label="Previous period">
            <CiSquareChevLeft size={30} />
          </button>
          <button onClick={() => handleDateChange("next")} aria-label="Next period">
            <CiSquareChevRight size={30} />
          </button>

          {/* View Mode Buttons */}
          <button
            title="Day view"
            onClick={() => setViewMode(viewMode === "day" ? "default" : "day")}
            className={`p-1 rounded ${viewMode === "day" ? "text-blue-600 bg-blue-100" : "hover:bg-gray-100"}`}
            aria-pressed={viewMode === "day"}
          >
            <MdOutlineCalendarViewDay size={22} />
          </button>
          <button
            title="Week view"
            onClick={() => setViewMode(viewMode === "week" ? "default" : "week")}
            className={`p-1 rounded ${viewMode === "week" ? "text-blue-600 bg-blue-100" : "hover:bg-gray-100"}`}
            aria-pressed={viewMode === "week"}
          >
            <MdOutlineCalendarViewWeek size={22} />
          </button>
          <button
            title="Month view"
            onClick={() => setViewMode(viewMode === "month" ? "default" : "month")}
            className={`p-1 rounded ${viewMode === "month" ? "text-blue-600 bg-blue-100" : "hover:bg-gray-100"}`}
            aria-pressed={viewMode === "month"}
          >
            <MdOutlineCalendarViewMonth size={22} />
          </button>

          {/* Filter dropdown */}
          <select
            className="ml-4 p-1 border rounded text-xs"
            value={filterInitial}
            onChange={e => setFilterInitial(e.target.value)}
            aria-label="Filter by company initial"
          >
            <option value="All">All</option>
            {initials.map(init => (
              <option key={init} value={init}>{init}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm font-medium text-gray-700 whitespace-nowrap">
            {format(formattedDates[0], "dd MMM yyyy")} - {format(formattedDates[formattedDates.length - 1], "dd MMM yyyy")}
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {formattedDates.map(date => {
          const dateKey = format(date, "yyyy-MM-dd");
          const usersForDate = filteredUsers.filter(user => {
            const parsed = parseISO(user.callback || "");
            return isValid(parsed) && format(parsed, "yyyy-MM-dd") === dateKey;
          });

          return (
            <div
              key={dateKey}
              className={`border rounded-lg p-3 bg-white shadow ${isToday(date) ? "border-blue-500 ring-2 ring-blue-300" : ""}`}
            >
              {/* Date Header */}
              <div className="mb-2 text-center text-sm font-semibold text-gray-700 flex justify-center items-center gap-2">
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-light mr-2">{format(date, "dd")}</span>
                  <div className="flex flex-col text-left">
                    <span className="text-sm">{format(date, "EEEE")}</span>
                    <span className="text-[10px] text-gray-500">{format(date, "yyyy")}</span>
                  </div>
                </div>
                <span className="text-xs font-medium bg-blue-100 text-blue-600 rounded px-2 py-0.5">
                  {usersForDate.length} callback{usersForDate.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* User Cards */}
              {usersForDate.length > 0 ? (
                usersForDate.map(user => {
                  const callbackDate = parseISO(user.callback || "");
                  const startDate = parseISO(user.date_created || "");
                  const isValidCallback = isValid(callbackDate);
                  const timeRemaining = isValidCallback ? differenceInSeconds(callbackDate, now) : 0;
                  const totalDuration = isValidCallback ? differenceInSeconds(callbackDate, startDate) : 0;
                  const progress = totalDuration > 0 ? ((totalDuration - timeRemaining) / totalDuration) * 100 : 0;
                  const isDone = timeRemaining <= 0;

                  let bgColor = "bg-white text-gray-800";
                  if (isDone) bgColor = "bg-green-500 text-white";
                  else if (timeRemaining < 600) bgColor = "bg-yellow-200 text-yellow-800";
                  else if (timeRemaining >= 600) bgColor = "bg-red-100 text-red-800";

                  return (
                    <div
                      key={user.id}
                      className={`relative mb-2 p-3 rounded border shadow-sm text-xs transition-all break-words cursor-pointer ${bgColor}`}
                      data-tooltip-id={`tooltip-${user.id}`}
                      data-tooltip-content={`Callback for ${user.companyname}. ${isDone ? "Callback time reached." : `Time left: ${formatDistanceToNow(callbackDate, { addSuffix: true })}`}`}
                      aria-label={`Callback for ${user.companyname}. ${isDone ? "Callback time reached." : `Time left: ${formatDistanceToNow(callbackDate, { addSuffix: true })}`}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`font-semibold uppercase ${isDone ? "text-white" : ""}`}>
                          {user.companyname}
                        </span>
                        {!isDone && <FcClock size={16} />}
                      </div>

                      {isValidCallback && !isDone && (
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                          <div
                            className="bg-green-500 h-1 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}

                      <p className={`mt-2 font-semibold ${isDone ? "" : "text-red-600"}`}>
                        {isDone
                          ? "Callback time reached!"
                          : `Time left: ${formatDistanceToNow(callbackDate, { addSuffix: true })}`}
                      </p>

                      {/* Tooltip Content */}
                      <Tooltip id={`tooltip-${user.id}`} place="top" delayShow={300} clickable>
                        <div className="text-xs text-left max-w-xs">
                          <div><strong>Company:</strong> {user.companyname}</div>
                          <div><strong>Callback:</strong> {format(callbackDate, "PPpp")}</div>
                          <div><strong>Created:</strong> {format(parseISO(user.date_created || ""), "PPpp")}</div>
                          <div><strong>Contact:</strong> {user.contact || "N/A"}</div>
                          <div><strong>Notes:</strong> {user.notes || "None"}</div>
                        </div>
                      </Tooltip>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-[10px] text-gray-500">No callback</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UsersCard;
