"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { toast } from "react-toastify";

interface Order {
  date_created: string;
}

interface AggregatedData {
  date: string;
  count: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md rounded p-2 text-xs text-gray-700">
        <p><strong>Date:</strong> {label}</p>
        <p><strong>Orders:</strong> {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const STORAGE_KEY = "count-orders-filter-state";

const CountOrders: React.FC = () => {
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredData, setFilteredData] = useState<AggregatedData[]>([]);
  const [filterType, setFilterType] = useState<"7days" | "month" | "range">("7days");
  const [rangeStart, setRangeStart] = useState<string>("");
  const [rangeEnd, setRangeEnd] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Load filter state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.filterType) setFilterType(parsed.filterType);
        if (parsed.rangeStart) setRangeStart(parsed.rangeStart);
        if (parsed.rangeEnd) setRangeEnd(parsed.rangeEnd);
      }
    } catch (e) {
      console.warn("Failed to load filter state from localStorage", e);
    }
  }, []);

  // Save filter state to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ filterType, rangeStart, rangeEnd })
      );
    } catch (e) {
      console.warn("Failed to save filter state to localStorage", e);
    }
  }, [filterType, rangeStart, rangeEnd]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/woocommerce/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to load orders.");
        setError("Failed to fetch orders.");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  // Aggregate orders by locale date string
  const aggregateByDay = (data: Order[]) => {
    const counts: Record<string, number> = {};
    data.forEach(({ date_created }) => {
      const date = new Date(date_created).toLocaleDateString();
      counts[date] = (counts[date] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Filter and aggregate orders based on filterType and date range
  useEffect(() => {
    if (!orders.length) {
      setFilteredData([]);
      return;
    }

    const now = Date.now();
    let filtered: Order[] = [];

    if (filterType === "7days") {
      const cutoff = now - 7 * DAY_MS;
      filtered = orders.filter(({ date_created }) => {
        const time = new Date(date_created).getTime();
        return time >= cutoff && time <= now;
      });
    } else if (filterType === "month") {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
      filtered = orders.filter(({ date_created }) => {
        const time = new Date(date_created).getTime();
        return time >= startOfMonth && time <= now;
      });
    } else if (filterType === "range") {
      if (rangeStart && rangeEnd) {
        const startTime = new Date(rangeStart).getTime();
        const endTime = new Date(rangeEnd).getTime() + DAY_MS - 1;
        filtered = orders.filter(({ date_created }) => {
          const time = new Date(date_created).getTime();
          return time >= startTime && time <= endTime;
        });
      }
    }

    setFilteredData(aggregateByDay(filtered));
  }, [orders, filterType, rangeStart, rangeEnd]);

  return (
    <div className="bg-white border rounded-lg shadow p-4">
      <h4 className="text-xs font-semibold mb-3 text-gray-700">Orders Per Day | Wordpress Website (REST API)</h4>

      <div className="mb-3 flex flex-wrap gap-2 items-center text-xs">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="filter"
            value="7days"
            checked={filterType === "7days"}
            onChange={() => setFilterType("7days")}
            className="cursor-pointer"
          />
          Last 7 days
        </label>

        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="filter"
            value="month"
            checked={filterType === "month"}
            onChange={() => setFilterType("month")}
            className="cursor-pointer"
          />
          This Month
        </label>

        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="filter"
            value="range"
            checked={filterType === "range"}
            onChange={() => setFilterType("range")}
            className="cursor-pointer"
          />
          Date Range
        </label>

        {filterType === "range" && (
          <>
            <input
              type="date"
              value={rangeStart}
              max={rangeEnd || undefined}
              onChange={(e) => setRangeStart(e.target.value)}
              className="border rounded px-2 py-1 text-xs"
            />
            <input
              type="date"
              value={rangeEnd}
              min={rangeStart || undefined}
              onChange={(e) => setRangeEnd(e.target.value)}
              className="border rounded px-2 py-1 text-xs"
            />
          </>
        )}
      </div>

      {loadingOrders ? (
        <div className="text-center text-xs text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-center text-xs text-red-500">{error}</div>
      ) : filteredData.length === 0 ? (
        <div className="text-center text-xs text-gray-400">No order data</div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={filteredData}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CountOrders;
