"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { toast } from "react-toastify";

interface Ticket {
  createdAt: string;
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
        <p><strong>Count:</strong> {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const STORAGE_KEY = "ticket-chart-filter-state";

const TicketChart: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredData, setFilteredData] = useState<AggregatedData[]>([]);
  const [filterType, setFilterType] = useState<"7days" | "month" | "range">("7days");
  const [rangeStart, setRangeStart] = useState<string>("");
  const [rangeEnd, setRangeEnd] = useState<string>("");

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

  const fetchActivity = async () => {
    try {
      const response = await fetch("/api/ModuleCSR/Monitorings/FetchActivity", {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Failed to fetch tickets");

      const data = await response.json();
      const ticketsData: Ticket[] = Array.isArray(data) ? data : data.data || [];

      setTickets(ticketsData);
    } catch (error) {
      toast.error("Error fetching accounts.");
      console.error("Error fetching accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  // Aggregate tickets by day helper
  const aggregateByDay = (data: Ticket[]) => {
    const counts: Record<string, number> = {};
    data.forEach(({ createdAt }) => {
      const date = new Date(createdAt).toISOString().slice(0, 10);
      counts[date] = (counts[date] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  // Filter & aggregate tickets whenever dependencies change
  useEffect(() => {
    if (!tickets.length) {
      setFilteredData([]);
      return;
    }

    const now = Date.now();
    let filtered: Ticket[] = [];

    if (filterType === "7days") {
      const cutoff = now - 7 * DAY_MS;
      filtered = tickets.filter(({ createdAt }) => {
        const time = new Date(createdAt).getTime();
        return time >= cutoff && time <= now;
      });
    } else if (filterType === "month") {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
      filtered = tickets.filter(({ createdAt }) => {
        const time = new Date(createdAt).getTime();
        return time >= startOfMonth && time <= now;
      });
    } else if (filterType === "range") {
      if (rangeStart && rangeEnd) {
        const startTime = new Date(rangeStart).getTime();
        const endTime = new Date(rangeEnd).getTime() + DAY_MS - 1;
        filtered = tickets.filter(({ createdAt }) => {
          const time = new Date(createdAt).getTime();
          return time >= startTime && time <= endTime;
        });
      }
    }

    setFilteredData(aggregateByDay(filtered));
  }, [tickets, filterType, rangeStart, rangeEnd]);

  return (
    <div className="bg-white border rounded-lg shadow p-4">
      <h4 className="text-xs font-semibold mb-3 text-gray-700">Tickets Per Day | MongoDB</h4>

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

      {loading ? (
        <div className="text-center text-xs text-gray-400">Loading...</div>
      ) : filteredData.length === 0 ? (
        <div className="text-center text-xs text-gray-400">No ticket data</div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={filteredData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={{ r: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TicketChart;
