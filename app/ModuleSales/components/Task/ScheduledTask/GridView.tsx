import React, { useState, useEffect } from "react";
import Pin from "./Pin";
import ActivityLogs from "./ActivityLogs";
import NotifyMe from "./NotifyMe";
import Priorities from "./Priorities";
import { RiEditCircleLine } from "react-icons/ri";

interface Post {
  id: string;
  companyname: string;
  contactperson: string;
  contactnumber: string;
  typeclient: string;
  activitystatus: string;
  activityremarks: string;
  ticketreferencenumber: string;
  date_created: string;
  date_updated: string | null;
  activitynumber: string;
  remarks?: string; // Add remarks here if missing
}

interface Activity {
  id: number;
  date_created: string;
  typeactivity: string;
  startdate: string;
  enddate: string;
  callback?: string;
  callstatus?: string;
  typecall?: string;
  quotationnumber?: string;
  quotationamount?: string;
  soamount?: string;
  sonumber?: string;
  actualsales?: string;
  remarks?: string;
  activitystatus?: string;
}

interface ActivityFetchState {
  loading: boolean;
  data: Activity[];
}

interface GridViewProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
}

interface NotifySetting {
  postId: string;
  notifyAt: number; // timestamp in milliseconds
}

const PINNED_POSTS_STORAGE_KEY = "pinnedPosts";
const NOTIFY_STORAGE_KEY = "notifySettings";

const DAYS_THRESHOLD = 7; // days threshold for follow-up and pending checks

const GridView: React.FC<GridViewProps> = ({ posts, handleEdit }) => {
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
  const [activityDataMap, setActivityDataMap] = useState<Record<string, ActivityFetchState>>({});
  const [notifySettings, setNotifySettings] = useState<NotifySetting[]>([]);

  // Load pinned posts from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(PINNED_POSTS_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setPinnedIds(new Set(parsed));
        }
      } catch { }
    }
  }, []);

  // Save pinned posts to localStorage when pinnedIds change
  useEffect(() => {
    localStorage.setItem(PINNED_POSTS_STORAGE_KEY, JSON.stringify(Array.from(pinnedIds)));
  }, [pinnedIds]);

  // Load notifySettings from localStorage on mount
  useEffect(() => {
    const storedNotify = localStorage.getItem(NOTIFY_STORAGE_KEY);
    if (storedNotify) {
      try {
        const parsed = JSON.parse(storedNotify);
        if (Array.isArray(parsed)) {
          setNotifySettings(parsed);
        }
      } catch { }
    }
  }, []);

  // Save notifySettings to localStorage on change
  useEffect(() => {
    localStorage.setItem(NOTIFY_STORAGE_KEY, JSON.stringify(notifySettings));
  }, [notifySettings]);

  // Request browser notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Poll every minute to check if notify time reached
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      notifySettings.forEach((setting) => {
        if (setting.notifyAt <= now) {
          if (Notification.permission === "granted") {
            const post = posts.find((p) => p.id === setting.postId);
            if (post) {
              new Notification("Reminder", {
                body: `Notification for ${post.companyname}`,
                tag: setting.postId,
              });
            }
          }
          // Remove the notify setting after notification
          setNotifySettings((prev) => prev.filter((s) => s.postId !== setting.postId));
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [notifySettings, posts]);

  // Fetch activity data for posts when posts change
  useEffect(() => {
    posts.forEach((post) => {
      if (!activityDataMap[post.activitynumber]) {
        setActivityDataMap((prev) => ({
          ...prev,
          [post.activitynumber]: { loading: true, data: [] },
        }));

        fetch(`/api/ModuleSales/Task/DailyActivity/FetchActivity?activitynumber=${post.activitynumber}`)
          .then((res) => res.json())
          .then((result) => {
            if (Array.isArray(result.data)) {
              const sorted = result.data.sort(
                (a: Activity, b: Activity) =>
                  new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
              );
              setActivityDataMap((prev) => ({
                ...prev,
                [post.activitynumber]: { loading: false, data: sorted },
              }));
            } else {
              setActivityDataMap((prev) => ({
                ...prev,
                [post.activitynumber]: { loading: false, data: [] },
              }));
            }
          })
          .catch(() => {
            setActivityDataMap((prev) => ({
              ...prev,
              [post.activitynumber]: { loading: false, data: [] },
            }));
          });
      }
    });
  }, [posts]);

  const togglePin = (postId: string, isNowPinned: boolean) => {
    setPinnedIds((prev) => {
      const newSet = new Set(prev);
      if (isNowPinned) {
        newSet.add(postId);
      } else {
        newSet.delete(postId);
      }
      return newSet;
    });
  };

  const updateNotifySettings = (newSettings: NotifySetting[]) => {
    setNotifySettings(newSettings);
  };


  if (posts.length === 0) {
    return <p className="text-center text-gray-500 text-sm mt-10">No records available</p>;
  }

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
    "TSM Coaching"
  ];

  // Filter posts to exclude those with activitystatus in fieldOnlyStatus
  const visiblePosts = posts.filter(
    (p) => !fieldOnlyStatus.includes(p.activitystatus)
  );

  const pinnedPosts = visiblePosts.filter((p) => pinnedIds.has(p.id));
  const unpinnedPosts = visiblePosts.filter((p) => !pinnedIds.has(p.id));
  const sortedPosts = [...pinnedPosts, ...unpinnedPosts];


  return (
    <>
      <div className="mb-4 text-xs font-medium text-gray-700">
        Pinned Posts: {pinnedIds.size}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sortedPosts.map((post) => {
          const isPinned = pinnedIds.has(post.id);
          const activityState = activityDataMap[post.activitynumber];
          const loadingActivities = activityState?.loading ?? false;
          const activities = activityState?.data ?? [];


          return (
            <div
              key={post.id}
              tabIndex={0}
              className={`bg-white rounded-lg p-2 flex flex-col justify-between cursor-pointer
                shadow-sm transition-shadow duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 relative border
                ${isPinned ? "border-yellow-400" : "border-gray-200"}`}
            >
              {isPinned && (
                <span className="absolute top-2 left-3 bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded font-semibold select-none text-[10px]">
                  Pinned
                </span>
              )}

              {/* Show Priority */}

              <div className="bg-white flex justify-between items-start border p-2 rounded-lg">
                <div>
                  <p className="text-xs font-semibold text-gray-800 mb-1">
                    Company: <span className="uppercase">{post.companyname}</span>
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    Contact Person: <span className="capitalize">{post.contactperson}</span>
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    Contact Number: <span className="capitalize">{post.contactnumber}</span>
                  </p>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[8px] font-semibold select-none
                      ${post.activitystatus.toLowerCase() === "assisted"
                        ? "bg-blue-400 text-white"
                        : post.activitystatus.toLowerCase() === "paid"
                          ? "bg-green-500 text-white"
                          : post.activitystatus.toLowerCase() === "delivered"
                            ? "bg-cyan-400 text-white"
                            : post.activitystatus.toLowerCase() === "collected"
                              ? "bg-indigo-500 text-white"
                              : post.activitystatus.toLowerCase() === "quote-done"
                                ? "bg-slate-500 text-white"
                                : post.activitystatus.toLowerCase() === "so-done"
                                  ? "bg-purple-500 text-white"
                                  : post.activitystatus.toLowerCase() === "cancelled"
                                    ? "bg-red-500 text-white"
                                    : post.activitystatus.toLowerCase() === "loss"
                                      ? "bg-red-800 text-white"
                                      : "bg-green-500 text-white"
                      }`}

                    aria-label={`Status: ${post.activitystatus}`}>
                    {post.activitystatus}
                  </span>

                  <div className="flex items-center space-x-2">
                    {/* Activity Status Badge */}
                    <Priorities post={post} activities={activities} />
                  </div>
                </div>

                <div className="flex space-x-1 relative z-20">
                  <div title={isPinned ? "Unpin this post" : "Pin this post"}>
                    <Pin
                      isPinned={isPinned}
                      onToggle={(e) => togglePin(post.id, e)}
                      companyname={post.companyname}
                      loading={loadingActivities}
                    />
                  </div>

                  <NotifyMe
                    postId={post.id}
                    notifySettings={notifySettings}
                    updateNotifySettings={updateNotifySettings}
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(post);
                    }}
                    className="flex items-center gap-1 bg-blue-500 hover:rounded-full text-white text-[10px] px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                    aria-label={`Edit ${post.companyname}`}
                    type="button"
                  >
                    <RiEditCircleLine size={12} /> Update
                  </button>
                </div>
              </div>

              <div className="mt-3 overflow-x-auto" style={{ maxHeight: 180 }}>
                {loadingActivities ? (
                  <p className="text-xs italic text-gray-400">Loading activities...</p>
                ) : activities.length === 0 ? (
                  <p className="text-xs italic text-gray-400">No activities found</p>
                ) : (
                  <ActivityLogs activities={activities} loading={loadingActivities} postId={post.id} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default GridView;
