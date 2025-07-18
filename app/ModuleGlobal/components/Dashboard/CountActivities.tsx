"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const MAX_ACTIVITIES = 1000; // Example max or capacity number to calculate percentage

const CountActivities: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [totalActivities, setTotalActivities] = useState<number>(0);

  const fetchActivities = async () => {
    try {
      const response = await fetch("/api/Data/Applications/Taskflow/Progress/Fetch", {
        cache: "no-store",
      });

      if (!response.ok) throw new Error("Failed to fetch activities");

      const data = await response.json();
      const activities = Array.isArray(data) ? data : data.data || [];

      if (activities.length !== totalActivities) {
        setTotalActivities(activities.length);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast.error("Error fetching activities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Calculate percentage (avoid division by zero)
  const percentage =
    !loading && MAX_ACTIVITIES > 0
      ? ((totalActivities / MAX_ACTIVITIES) * 100).toFixed(1)
      : null;

  return (
    <div className="bg-white border rounded-lg shadow p-4 flex flex-col justify-between">
      <span className="text-xs text-gray-500">Total Activities</span>
      <span className="text-2xl font-bold mt-2">{loading ? "..." : totalActivities}</span>
      {!loading && percentage && (
        <span className="text-xs text-gray-400 mt-1">{percentage}% of max</span>
      )}
    </div>
  );
};

export default CountActivities;
