import React, { useState, useEffect } from "react";
import { MdModeEdit } from "react-icons/md";
import ActivityModal from "./Modal/ActivityModal";
import { motion, AnimatePresence } from "framer-motion";
import { FaClock } from "react-icons/fa6";

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

  referenceid: string;
  manager: string;
  tsm: string;
  activitynumber: string;
  companyname: string;
  contactperson: string;
  contactnumber: string;
  emailaddress: string;
  typeclient: string;
  address: string;
  deliveryaddress: string;
  area: string;
  projectname: string;
  projectcategory: string;
  projecttype: string;
  source: string;
  targetquota: string;
}

interface ActivityLogsProps {
  activities: Activity[];
  loading: boolean;
  postId: string;
}

const ActivityLogs: React.FC<ActivityLogsProps> = ({ activities, loading, postId }) => {
  const [expanded, setExpanded] = useState(false);
  const [activityList, setActivityList] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  useEffect(() => {
    setActivityList(activities);
  }, [activities]);

  const toggleExpanded = () => setExpanded(prev => !prev);

  const handleEditClick = (activityId: number) => {
    const selected = activityList.find(act => act.id === activityId);
    if (selected) {
      setSelectedActivity(selected);
      setIsEditModalOpen(true);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!selectedActivity) return;
    const { name, value } = e.target;
    setSelectedActivity({ ...selectedActivity, [name]: value });
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedActivity(null);
  };

  const handleSaveEdit = async () => {
    if (!selectedActivity) return;

    const originalActivity = activities.find(a => a.id === selectedActivity.id);
    if (!originalActivity) return;

    const soChanged =
      originalActivity.sonumber !== selectedActivity.sonumber &&
      originalActivity.soamount !== selectedActivity.soamount;

    try {
      if (soChanged) {
        // 1. Update original activity to reflect RE-SO
        const updatedOriginal = {
          ...selectedActivity,
          soamount: "0",
          activitystatus: "RE-SO",
          sonumber: originalActivity.sonumber, // keep old SO number
        };

        // PUT update for RE-SO activity
        const updateRes = await fetch(
          "/api/ModuleSales/Task/DailyActivity/EditProgress",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedOriginal),
          }
        );

        if (!updateRes.ok) throw new Error("Failed to update RE-SO activity");

        // 2. POST new duplicated activity with new SO details
        const newActivity = {
          ...selectedActivity,
          id: undefined, // let backend assign new ID
          date_created: new Date().toISOString(),
        };

        const postRes = await fetch(
          "/api/ModuleSales/Task/DailyActivity/AddProgress",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newActivity),
          }
        );

        if (!postRes.ok) throw new Error("Failed to create new activity");

        const created = await postRes.json();

        // Update UI
        setActivityList((prev) =>
          prev.map((a) =>
            a.id === updatedOriginal.id ? updatedOriginal : a
          ).concat(created)
        );
        setHighlightedId(created.id);
      } else {
        // Normal edit
        const response = await fetch(
          "/api/ModuleSales/Task/DailyActivity/EditProgress",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selectedActivity),
          }
        );
        if (!response.ok) throw new Error("Failed to update activity");

        setActivityList((prev) =>
          prev.map((a) => (a.id === selectedActivity.id ? selectedActivity : a))
        );
        setHighlightedId(selectedActivity.id);
      }

      setIsEditModalOpen(false);
      setTimeout(() => setHighlightedId(null), 2000);
    } catch (error) {
      console.error("Error during save:", error);
      alert("Update failed. Please try again.");
      setActivityList(activities); // revert
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4" role="status" aria-live="polite" aria-label="Loading activities">
        <svg
          className="animate-spin h-5 w-5 text-blue-600"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      </div>
    );
  }

  if (activityList.length === 0) {
    return <p className="text-xs text-gray-500 italic">No activity logs.</p>;
  }

  // Helper to format time spent nicely
  const formatTimeSpent = (startStr: string, endStr: string) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return "Invalid date";
    const diffMs = end.getTime() - start.getTime();
    if (diffMs < 0) return "End before start";

    const seconds = Math.floor(diffMs / 1000) % 60;
    const minutes = Math.floor(diffMs / (1000 * 60)) % 60;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${hours}h ${pad(minutes)}m ${pad(seconds)}s`;
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, maxHeight: 0 }}
        animate={{ opacity: 1, maxHeight: expanded ? 1000 : 160 }}
        transition={{ duration: 0.3 }}
        className="space-y-2 overflow-hidden"
        aria-live="polite"
        aria-expanded={expanded}
        id={`activity-logs-${postId}`}
        style={{ overflowY: "auto" }}
      >
        <AnimatePresence>
          {activityList.map((act, index) => (
            <motion.div
              key={act.id ?? `activity-${index}`}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className={`p-2 rounded bg-gray-50 hover:bg-white hover:shadow-md text-xs text-gray-700 flex justify-between items-center
                ${highlightedId === act.id ? "bg-green-100 transition-colors" : ""}
              `}
            >
              <div>
                <div>
                  <strong>Activity Type:</strong> {act.typeactivity}
                </div>
                <div className="flex gap-1 text-green-600">
                  <strong><FaClock /></strong> {formatTimeSpent(act.startdate, act.enddate)}
                </div>
              </div>
              <button
                onClick={() => handleEditClick(act.id)}
                className="hover:shadow-md bg-blue-400 text-white p-2 rounded-full"
                title="Edit Activity"
              >
                <MdModeEdit size={10} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {activityList.length > 3 && (
        <button
          className="mt-1 text-xs text-blue-600 hover:underline"
          onClick={toggleExpanded}
          aria-expanded={expanded}
          aria-controls={`activity-logs-${postId}`}
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}

      {isEditModalOpen && selectedActivity && (
        <ActivityModal
          activity={selectedActivity}
          onChange={handleInputChange}
          onClose={handleModalClose}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
};

export default ActivityLogs;