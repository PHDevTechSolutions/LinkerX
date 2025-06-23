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

// Safe date parser
const parseDate = (str: string): Date | null => {
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
};

const formatDateKey = (date: Date) => date.toISOString().slice(0, 10);

const isSameDate = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const getMonthDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  return { firstDay, lastDay, daysInMonth: lastDay.getDate() };
};

const getCalendarGridDates = (year: number, month: number): Date[] => {
  const { firstDay } = getMonthDays(year, month);
  const startDay = firstDay.getDay();
  const calendarStart = new Date(year, month, 1 - startDay);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(calendarStart);
    d.setDate(calendarStart.getDate() + i);
    return d;
  });
};

const CardCalendarView: React.FC<CardCalendarViewProps> = ({ posts, handleEdit }) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
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
    () => posts.filter((p) => !fieldOnlyStatus.includes(p.activitystatus)),
    [posts]
  );

  const postsByDate = useMemo(() => {
    const map: Record<string, Post[]> = {};
    for (const post of filteredPosts) {
      const date = parseDate(post.date_created);
      if (!date) continue;
      const key = formatDateKey(date);
      if (!map[key]) map[key] = [];
      map[key].push(post);
    }
    return map;
  }, [filteredPosts]);

  const calendarGridDates = useMemo(
    () => getCalendarGridDates(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const activityStatusCount = useMemo(() => {
    const count: Record<string, number> = {};
    for (const post of filteredPosts) {
      const date = parseDate(post.date_created);
      if (!date) continue;
      if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
        count[post.activitystatus] = (count[post.activitystatus] || 0) + 1;
      }
    }
    return count;
  }, [filteredPosts, currentYear, currentMonth]);

  const prevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    setCurrentYear((prev) => (currentMonth === 0 ? prev - 1 : prev));
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    setCurrentYear((prev) => (currentMonth === 11 ? prev + 1 : prev));
  };

  const handleLegendClick = (status: string) => {
    setSelectedStatus((prev) => (prev === status ? null : status));
  };

  return (
    <div>
      {/* Navigation */}
      <div className="mb-4 flex justify-between items-center">
        <div />
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="px-3 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300">
            &lt;
          </button>
          <div className="text-sm font-semibold">
            {new Date(currentYear, currentMonth).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
            })}
          </div>
          <button onClick={nextMonth} className="px-3 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300">
            &gt;
          </button>
        </div>
      </div>

      {/* Status Legend */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(activityStatusCount).map(([status, count]) => {
          const badgeClass = statusColors[status] || "bg-gray-300 text-black";
          const isActive = selectedStatus === status;
          return (
            <button
              key={status}
              onClick={() => handleLegendClick(status)}
              className={`flex items-center gap-1 px-3 py-1 text-[10px] rounded-full font-semibold
                ${isActive ? "ring-2 ring-blue-600 bg-blue-600 text-white" : badgeClass}`}
            >
              <span>{status}</span>
              <span className="bg-white text-black rounded-full px-2">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-xs border p-2 rounded shadow-sm">
        {DAYS_OF_WEEK.map((d) => (
          <div key={d} className="font-semibold text-center border-b pb-1">{d}</div>
        ))}
        {calendarGridDates.map((date) => {
          const key = formatDateKey(date);
          const items = postsByDate[key] || [];
          const isCurrentMonth = date.getMonth() === currentMonth;
          const isToday = isSameDate(date, today);

          return (
            <div
              key={key}
              className={`min-h-[5rem] border rounded p-1 flex flex-col
                ${!isCurrentMonth ? "text-gray-400 bg-gray-50" : ""}
                ${isToday ? "bg-orange-100" : ""}`}
            >
              <div className="text-right font-semibold">{date.getDate()}</div>
              <div className="flex-grow mt-1 space-y-1 overflow-auto">
                {items.map((post) => {
                  const highlight = selectedStatus === post.activitystatus;
                  return (
                    <div
                      key={post.id}
                      tabIndex={0}
                      className={`truncate uppercase text-[10px] shadow-md rounded-md p-2 px-2 cursor-pointer
                        bg-white border ${highlight ? "ring-1 ring-yellow-400 bg-yellow-50" : ""}`}
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
