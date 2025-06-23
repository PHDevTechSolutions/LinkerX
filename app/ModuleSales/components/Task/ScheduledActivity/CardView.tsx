import React, { useMemo, useState } from "react";

interface Post {
  id: string;
  companyname: string;
  contactperson: string;
  contactnumber: string;
  typeclient: string;
  activitystatus: string;
  activityremarks: string;
  ticketreferencenumber: string;
  date_created: string; // YYYY-MM-DD or ISO string
  date_updated: string | null;
  activitynumber: string;
}

interface CardCalendarViewProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const statusColors: Record<string, string> = {
  "On Progress": "bg-yellow-200 text-black",
  Assisted: "bg-blue-400 text-white",
  Paid: "bg-green-500 text-white",
  Delivered: "bg-cyan-400 text-white",
  Collected: "bg-indigo-500 text-white",
  "Quote-Done": "bg-slate-500 text-white",
  "SO-Done": "bg-purple-500 text-white",
  Cancelled: "bg-red-500 text-white",
  Loss: "bg-red-800 text-white",
  "Client Visit": "bg-orange-500 text-white",
  "Site Visit": "bg-yellow-500 text-black",
  "On Field": "bg-teal-500 text-white",
  "Assisting other Agents Client": "bg-blue-300 text-white",
  "Coordination of SO to Warehouse": "bg-green-300 text-white",
  "Coordination of SO to Orders": "bg-green-400 text-white",
  "Updating Reports": "bg-indigo-300 text-white",
  "Email and Viber Checking": "bg-purple-300 text-white",
  "1st Break": "bg-yellow-300 text-black",
  "Client Meeting": "bg-orange-300 text-white",
  "Coffee Break": "bg-amber-300 text-black",
  "Group Meeting": "bg-cyan-300 text-black",
  "Last Break": "bg-yellow-400 text-black",
  "Lunch Break": "bg-red-300 text-black",
  "TSM Coaching": "bg-pink-300 text-white",
};

const getMonthDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  return { firstDay, lastDay, daysInMonth: lastDay.getDate() };
};

const parseDateCreated = (dateStr: string): Date => {
  return new Date(dateStr + "T00:00:00");
};

const isSameDate = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const formatDateKey = (date: Date) => date.toISOString().slice(0, 10);

const getCalendarGridDates = (year: number, month: number): Date[] => {
  const { firstDay } = getMonthDays(year, month);
  const firstDayWeekday = firstDay.getDay();

  const calendarStart = new Date(year, month, 1);
  calendarStart.setDate(1 - firstDayWeekday);

  const totalCells = 42;

  return Array.from({ length: totalCells }).map((_, idx) => {
    const d = new Date(calendarStart);
    d.setDate(calendarStart.getDate() + idx);
    return d;
  });
};

const CardCalendarView: React.FC<CardCalendarViewProps> = ({
  posts,
  handleEdit,
}) => {
  const today = new Date();

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  // New state: selected status to highlight
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const fieldOnlyStatus = [
    "Client Visit",
    "Site Visit",
    "On Field",
    "Assisting other Agents Client",
    "Coordination of SO to Warehouse",
    "Coordination of SO to Orders",
    "Updating Reports",
    "Email and Viber Checking",
    "1st Break",
    "Client Meeting",
    "Coffee Break",
    "Group Meeting",
    "Last Break",
    "Lunch Break",
    "TSM Coaching",
  ];

  const filteredPosts = useMemo(
    () => posts.filter((post) => !fieldOnlyStatus.includes(post.activitystatus)),
    [posts]
  );

  const postsByDate = useMemo(() => {
    const map: Record<string, Post[]> = {};
    filteredPosts.forEach((post) => {
      const dateCreatedOnly = post.date_created.slice(0, 10);
      const dateObj = parseDateCreated(dateCreatedOnly);
      const dateKey = formatDateKey(dateObj);
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(post);
    });
    return map;
  }, [filteredPosts]);

  const calendarGridDates = useMemo(
    () => getCalendarGridDates(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  // Count activities per status for current month
  const activityStatusCount = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredPosts.forEach((post) => {
      const date = new Date(post.date_created);
      if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
        counts[post.activitystatus] = (counts[post.activitystatus] || 0) + 1;
      }
    });
    return counts;
  }, [filteredPosts, currentYear, currentMonth]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Handler for clicking legend status
  const handleLegendClick = (status: string) => {
    setSelectedStatus((prev) => (prev === status ? null : status));
  };

  return (
    <div>
      {/* Month navigation */}
      <div className="mb-4 flex items-center justify-between">
        <div />
        <div className="flex items-center gap-4">
          <button
            onClick={prevMonth}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-xs"
            aria-label="Previous month"
          >
            &lt;
          </button>
          <div className="text-sm font-semibold">
            {new Date(currentYear, currentMonth, 1).toLocaleDateString(
              undefined,
              { year: "numeric", month: "long" }
            )}
          </div>
          <button
            onClick={nextMonth}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-xs"
            aria-label="Next month"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Legend showing activity statuses + counts */}
      <div className="mb-4 flex flex-wrap gap-2">
        {Object.entries(activityStatusCount).map(([status, count]) => {
          const badgeClass = statusColors[status] || "bg-gray-300 text-black";
          const isSelected = selectedStatus === status;
          return (
            <button
              key={status}
              onClick={() => handleLegendClick(status)}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-[8px] font-semibold cursor-pointer select-none
                ${
                  isSelected
                    ? "ring-2 ring-blue-600 bg-blue-600 text-white"
                    : badgeClass
                }
              `}
              title={`Show posts with status: ${status}`}
            >
              <span>{status}</span>
              <span className="bg-white text-black rounded-full px-2">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Month view calendar */}
      <div className="grid grid-cols-7 gap-1 border rounded-md shadow-sm p-2 text-xs">
        {/* Weekday headers */}
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="font-semibold text-center border-b pb-1">
            {day}
          </div>
        ))}

        {/* Days grid */}
        {calendarGridDates.map((dateObj) => {
          const dateKey = formatDateKey(dateObj);
          const postsForDay = postsByDate[dateKey] || [];
          const isCurrentMonth = dateObj.getMonth() === currentMonth;

          return (
            <div
              key={dateKey}
              className={`border rounded min-h-[5rem] p-1 flex flex-col cursor-default
                ${
                  isSameDate(dateObj, today) ? "bg-orange-100" : ""
                }
                ${!isCurrentMonth ? "text-gray-400 bg-gray-50" : ""}
              `}
              aria-label={`Day ${dateObj.getDate()}, ${postsForDay.length} post${
                postsForDay.length !== 1 ? "s" : ""
              }`}
            >
              <div className="font-semibold text-right">{dateObj.getDate()}</div>
              <div className="flex-grow overflow-auto mt-1 space-y-1">
                {postsForDay.map((post) => {
                  const highlight = selectedStatus === post.activitystatus;
                  return (
                    <div
                      key={post.id}
                      tabIndex={0}
                      className={`bg-white border text-black px-2 p-2 cursor-pointer truncate uppercase text-[10px] shadow-md rounded-md
                        ${highlight ? "ring-1 ring-yellow-400 bg-yellow-50" : ""}
                      `}
                      title={`${post.companyname} - ${post.activitystatus}`}
                      onClick={() => handleEdit(post)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleEdit(post);
                        }
                      }}
                    >
                      {post.companyname}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CardCalendarView;
