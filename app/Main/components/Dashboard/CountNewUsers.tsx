"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const DAY_WINDOW = 7; // last 7 days
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MAX_USERS = 1000; // Example max for percentage calculation

const CountNewUsers: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [newUserTotal, setNewUserTotal] = useState<number>(0);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/Dashboard/FetchUser"); // adjust route if needed
      const json = await res.json();

      const users: any[] = Array.isArray(json)
        ? json
        : Array.isArray(json.data)
        ? json.data
        : [];

      const cutoff = Date.now() - DAY_WINDOW * MS_PER_DAY;

      const recentUsers = users.filter((u) => {
        const createdTime = new Date(u.createdAt).getTime();
        return !isNaN(createdTime) && createdTime >= cutoff;
      });

      setNewUserTotal(recentUsers.length);
    } catch (err) {
      console.error("User fetch error:", err);
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const percentage =
    !loading && MAX_USERS > 0
      ? ((newUserTotal / MAX_USERS) * 100).toFixed(1)
      : null;

  return (
    <div className="bg-white border rounded-lg shadow p-4 flex flex-col justify-between">
      <span className="text-xs text-gray-500">
        New Users (last {DAY_WINDOW} days)
      </span>
      <span className="text-2xl font-bold mt-2">
        {loading ? "..." : newUserTotal}
      </span>
      {!loading && percentage && (
        <span className="text-xs text-gray-400 mt-1">{percentage}% of max</span>
      )}
    </div>
  );
};

export default CountNewUsers;
