import React, { useState, useEffect } from "react";
import { FaCaretRight, FaCaretDown } from "react-icons/fa";

interface Post {
  id: string;
  companyname: string;
  contactperson: string;
  contactnumber: string;
  typeclient: string;
  activitystatus: string;
  ticketreferencenumber: string;
  date_created: string;
  date_updated: string | null;
  activitynumber: string;
}

interface CardCalendarViewProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
}

type ViewType = "day" | "week" | "month";

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "Invalid date";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

const getWeekNumber = (date: Date) => {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
};

const groupPostsByView = (posts: Post[], view: ViewType) => {
  const groups: Record<string, Post[]> = {};

  posts.forEach((post) => {
    const dateStr = post.date_updated || post.date_created;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return;

    let key = "";
    switch (view) {
      case "day":
        key = date.toISOString().slice(0, 10);
        break;
      case "week": {
        const year = date.getFullYear();
        const week = getWeekNumber(date);
        key = `${year}-W${week.toString().padStart(2, "0")}`;
        break;
      }
      case "month":
        key = date.toLocaleDateString(undefined, { year: "numeric", month: "long" });
        break;
    }

    if (!groups[key]) groups[key] = [];
    groups[key].push(post);
  });

  return groups;
};

const getRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  if (diffMs < 0) return "in the future";

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return `${seconds} sec ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const isRecentlyUpdated = (post: Post, days = 3) => {
  const dateStr = post.date_updated || post.date_created;
  const date = new Date(dateStr);
  const now = new Date();
  return now.getTime() - date.getTime() <= days * 24 * 60 * 60 * 1000;
};

const CardCalendarView: React.FC<CardCalendarViewProps> = ({ posts, handleEdit }) => {
  const [view, setView] = useState<ViewType>(() => {
    const saved = localStorage.getItem("cardCalendarView");
    if (saved === "day" || saved === "week" || saved === "month") return saved;
    return "day";
  });

  useEffect(() => {
    localStorage.setItem("cardCalendarView", view);
  }, [view]);

  const groupedPosts = groupPostsByView(posts, view);

  const sortedKeys = Object.keys(groupedPosts).sort((a, b) => {
    // Para makuha yung latest date sa bawat grupo:
    const getLatestDate = (posts: Post[]) => {
      return posts.reduce((latest, post) => {
        const dateStr = post.date_updated || post.date_created;
        const date = new Date(dateStr).getTime();
        return date > latest ? date : latest;
      }, 0);
    };

    const latestA = getLatestDate(groupedPosts[a]);
    const latestB = getLatestDate(groupedPosts[b]);

    // Descending order ng latest date sa group (latest group first)
    return latestB - latestA;
  });

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    sortedKeys.forEach((k) => {
      init[k] = true;
    });
    return init;
  });

  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const [jumpDate, setJumpDate] = useState<string>("");

  const handleJump = () => {
    if (!jumpDate) return;
    const date = new Date(jumpDate);
    if (isNaN(date.getTime())) return alert("Invalid date");
    let key = "";
    switch (view) {
      case "day":
        key = date.toISOString().slice(0, 10);
        break;
      case "week": {
        const year = date.getFullYear();
        const week = getWeekNumber(date);
        key = `${year}-W${week.toString().padStart(2, "0")}`;
        break;
      }
      case "month":
        key = date.toLocaleDateString(undefined, { year: "numeric", month: "long" });
        break;
    }

    if (groupedPosts[key]) {
      setExpandedGroups((prev) => ({ ...prev, [key]: true }));
      const el = document.getElementById(`group-${key}`);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      alert("No posts found for that date group");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "cold":
        return "bg-blue-100 border-blue-400";
      case "warm":
        return "bg-yellow-100 border-yellow-400";
      case "hot":
        return "bg-red-100 border-red-400";
      case "done":
        return "bg-green-100 border-green-400";
      default:
        return "bg-white border-gray-300";
    }
  };

  return (
    <div>
      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(["day", "week", "month"] as ViewType[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-3 py-1 rounded ${view === v ? "bg-blue-600 text-white text-xs" : "bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs"
              }`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}

        <div className="ml-auto flex items-center space-x-2">
          <input
            type="date"
            value={jumpDate}
            onChange={(e) => setJumpDate(e.target.value)}
            className="border rounded px-2 py-1 text-xs"
            aria-label="Jump to date"
          />
          <button
            onClick={handleJump}
            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
          >
            Jump
          </button>
        </div>
      </div>

      {/* Calendar groups */}
      <div className="space-y-8">
        {sortedKeys.length === 0 && (
          <p className="text-center text-gray-500">No posts available</p>
        )}

        {sortedKeys.map((key) => {
          let displayLabel = key;
          if (view === "week") {
            const [year, week] = key.split("-W");
            displayLabel = `Week ${week}, ${year}`;
          }

          const isExpanded = expandedGroups[key];
          const postsInGroup = groupedPosts[key];

          return (
            <section key={key} id={`group-${key}`}>
              <h2
                className="text-xs font-semibold mb-2 border-b pb-2 cursor-pointer select-none flex justify-between items-center"
                onClick={() => toggleGroup(key)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleGroup(key);
                  }
                }}
              >
                <span>{displayLabel} ({postsInGroup.length} post{postsInGroup.length > 1 ? "s" : ""})</span>
                <span
                  aria-label={isExpanded ? "Collapse group" : "Expand group"}
                  className="text-sm select-none"
                >
                  {isExpanded ? <FaCaretDown /> : <FaCaretRight />}
                </span>
              </h2>

              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-screen" : "max-h-0"
                  }`}
                style={{ transitionProperty: "max-height" }}
                aria-hidden={!isExpanded}
              >
                {postsInGroup.map((post) => {
                  const isCardExpanded = !!expandedCards[post.id];
                  const recent = isRecentlyUpdated(post);

                  return (
                    <div
                      key={post.id}
                      onClick={() => toggleCard(post.id)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleCard(post.id);
                        }
                      }}
                      className={`rounded-md p-4 shadow hover:shadow-md transition cursor-pointer outline-none relative
    ${getStatusColor(post.activitystatus)} ${recent ? "ring-2 m-1" : ""}`}
                      aria-expanded={isCardExpanded}
                      aria-controls={`card-details-${post.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold uppercase text-xs">{post.companyname}</h3>
                        {recent && (
                          <span
                            className="text-[10px] bg-orange-400 text-white px-1 rounded ml-2"
                            title="Recently updated within last 3 days"
                          >
                            NEW
                          </span>
                        )}
                      </div>

                      <div className="text-xs capitalize mt-1">
                        <p>
                          Contact: {post.contactperson} | Number: {post.contactnumber}
                        </p>
                        <p>Created: {formatDate(post.date_created)} ({getRelativeTime(post.date_created)})</p>
                        <p>
                          Updated:{" "}
                          {post.date_updated
                            ? `${formatDate(post.date_updated)} (${getRelativeTime(post.date_updated)})`
                            : "N/A"}
                        </p>
                      </div>

                      {/* Spacer div to push the button to the bottom */}
                      <div className="h-4"></div>

                      <div className="flex justify-end mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(post);
                          }}
                          className="bg-blue-400 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label={`Edit ${post.companyname}`}
                          type="button"
                        >
                          Create
                        </button>
                      </div>

                      <div
                        id={`card-details-${post.id}`}
                        className={`mt-3 overflow-hidden transition-all duration-300 ${isCardExpanded ? "max-h-96" : "max-h-0"
                          }`}
                        aria-hidden={!isCardExpanded}
                      >
                        <p className="text-xs text-gray-600 italic">
                          Detailed info can go here, e.g., address, notes, etc.
                        </p>
                      </div>
                    </div>

                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default CardCalendarView;
