"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const MAX_COMPANIES = 500; // Example max number of companies for percentage calculation

const Card1: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [totalCompanies, setTotalCompanies] = useState<number>(0);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/Data/Applications/Taskflow/CustomerDatabase/Fetch", { signal });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const json = await res.json();
        const companies = Array.isArray(json) ? json : json.data;

        if (!signal.aborted) {
          setTotalCompanies(companies.length);
        }
      } catch (err) {
        if (signal.aborted) return; // fetch aborted, no need to set state or toast
        console.error("Company fetch error:", err);
        toast.error("Error fetching companies");
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };

    fetchAccounts();

    return () => {
      controller.abort();
    };
  }, []);

  const percentage =
    !loading && MAX_COMPANIES > 0
      ? ((totalCompanies / MAX_COMPANIES) * 100).toFixed(1)
      : null;

  return (
    <div className="bg-white border rounded-lg shadow p-4 flex flex-col justify-between">
      <span className="text-xs text-gray-500">Total Companies</span>
      <span className="text-2xl font-bold mt-2">{loading ? "..." : totalCompanies}</span>
      {!loading && percentage && (
        <span className="text-xs text-gray-400 mt-1">{percentage}% of max</span>
      )}
    </div>
  );
};

export default Card1;
