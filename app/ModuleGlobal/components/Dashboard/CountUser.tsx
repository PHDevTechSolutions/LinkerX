"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const MAX_USERS = 1000; // Set a max user count for percentage calculation

const CountUser: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [userTotal, setUserTotal] = useState<number>(0);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/Dashboard/FetchUser"); // adjust route if needed
      const json = await res.json();

      const users: any[] = Array.isArray(json)
        ? json
        : Array.isArray(json.data)
        ? json.data
        : [];

      setUserTotal(users.length);
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
      ? ((userTotal / MAX_USERS) * 100).toFixed(1)
      : null;

  return (
    <div className="bg-white border rounded-lg shadow p-4 flex flex-col justify-between">
      <span className="text-xs text-gray-500">Total Users</span>
      <span className="text-2xl font-bold mt-2">{loading ? "..." : userTotal}</span>
      {!loading && percentage && (
        <span className="text-xs text-gray-400 mt-1">{percentage}% of max</span>
      )}
    </div>
  );
};

export default CountUser;
