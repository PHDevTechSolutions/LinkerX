import React, { useState, useEffect } from "react";
import Pin from "./Pin";
import ActivityLogs from "./ActivityLogs";

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

const GridView: React.FC<GridViewProps> = ({ posts, handleEdit }) => {
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
  const [activityDataMap, setActivityDataMap] = useState<Record<string, ActivityFetchState>>({});
  const [loading, setLoading] = useState(false);

  // Notify feature states
  const [notifySettings, setNotifySettings] = useState<NotifySetting[]>([]);
  const [showNotifyPickerFor, setShowNotifyPickerFor] = useState<string | null>(null);

  // Load pinned posts from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(PINNED_POSTS_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setPinnedIds(new Set(parsed));
        }
      } catch {}
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
      } catch {}
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

  // Schedule notification in X minutes
  const scheduleNotification = (postId: string, minutes: number) => {
    const notifyAt = Date.now() + minutes * 60000;
    setNotifySettings((prev) => {
      const filtered = prev.filter((s) => s.postId !== postId);
      return [...filtered, { postId, notifyAt }];
    });
    setShowNotifyPickerFor(null);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border rounded p-5 shadow-sm animate-pulse bg-gray-100 h-40" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return <p className="text-center text-gray-500 text-sm mt-10">No records available</p>;
  }

  const pinnedPosts = posts.filter((p) => pinnedIds.has(p.id));
  const unpinnedPosts = posts.filter((p) => !pinnedIds.has(p.id));
  const sortedPosts = [...pinnedPosts, ...unpinnedPosts];

  return (
    <>
      <div className="mb-4 text-sm font-medium text-gray-700">
        Pinned Posts: {pinnedIds.size}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sortedPosts.map((post) => {
          const isPinned = pinnedIds.has(post.id);
          const activityState = activityDataMap[post.activitynumber];
          const loadingActivities = activityState?.loading ?? false;
          const activities = activityState?.data ?? [];

          const isNotifyPickerOpen = showNotifyPickerFor === post.id;
          const hasNotify = notifySettings.some((s) => s.postId === post.id);

          return (
            <div
              key={post.id}
              tabIndex={0}
              className={`bg-white rounded-lg p-2 flex flex-col justify-between cursor-pointer
                shadow-sm transition-shadow duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 relative border
                ${isPinned ? "border-yellow-400" : "border-gray-200"}`}
            >
              {isPinned && (
                <span className="absolute top-2 left-3 bg-yellow-200 text-yellow-800 text-xs px-2 py-0.5 rounded font-semibold select-none">
                  Pinned
                </span>
              )}

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
                </div>

                <div className="flex space-x-2 relative z-20">
                  <div title={isPinned ? "Unpin this post" : "Pin this post"}>
                    <Pin
                      isPinned={isPinned}
                      onToggle={(e) => togglePin(post.id, e)}
                      companyname={post.companyname}
                      loading={loadingActivities}
                    />
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(post);
                    }}
                    className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`Edit ${post.companyname}`}
                    type="button"
                  >
                    Create
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowNotifyPickerFor(isNotifyPickerOpen ? null : post.id);
                    }}
                    className={`text-xs px-2 py-1 rounded ${
                      hasNotify ? "bg-yellow-300" : "bg-gray-200"
                    } hover:bg-yellow-400`}
                    type="button"
                  >
                    {hasNotify ? "Notification Set" : "Notify Me"}
                  </button>

                  {isNotifyPickerOpen && (
                    <div
                      className="absolute top-full right-0 mt-1 bg-white border rounded shadow-lg z-50 p-2 text-xs text-gray-800"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p className="mb-1 font-semibold">Notify me in:</p>
                      {[5, 10, 15, 30, 60, 120].map((min) => (
                        <button
                          key={min}
                          className="block w-full text-left hover:bg-gray-100 rounded px-2 py-1"
                          type="button"
                          onClick={() => scheduleNotification(post.id, min)}
                        >
                          {min < 60 ? `${min} minute${min > 1 ? "s" : ""}` : `${min / 60} hour${min / 60 > 1 ? "s" : ""}`}
                        </button>
                      ))}
                      <button
                        type="button"
                        className="mt-1 w-full text-left text-red-600 hover:bg-red-100 rounded px-2 py-1"
                        onClick={() => {
                          // Remove notify setting for this post
                          setNotifySettings((prev) => prev.filter((s) => s.postId !== post.id));
                          setShowNotifyPickerFor(null);
                        }}
                      >
                        Cancel Notification
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div
                className="mt-3 overflow-x-auto"
                style={{ maxHeight: 180 }}
              >
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
