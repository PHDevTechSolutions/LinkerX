"use client";

import { useMemo, useState, useEffect } from "react";
import Source from "./Source";
import CSRMetrics from "./CSRMetrics";
import OutboundCalls from "./OutboundCalls";
import Quotation from "./Quotation";

interface MainContainerProps {
  filteredAccounts: any[];
}

const STORAGE_KEY = "mainContainerDateRange";

const MainContainer: React.FC<MainContainerProps> = ({ filteredAccounts }) => {
  const getToday = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [dateRange, setDateRange] = useState<{ start: string; end: string }>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    const today = getToday();
    return { start: today, end: today };
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dateRange));
    }
  }, [dateRange]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const filteredByDate = useMemo(() => {
    if (!dateRange.start && !dateRange.end) return filteredAccounts;

    const startFilter = dateRange.start ? new Date(dateRange.start) : null;
    const endFilter = dateRange.end ? new Date(dateRange.end) : null;

    return filteredAccounts.filter((acc) => {
      const startDate = acc.startdate ? new Date(acc.startdate) : null;
      const endDate = acc.enddate ? new Date(acc.enddate) : null;
      if (!startDate || !endDate) return false;
      return (
        (!endFilter || startDate <= endFilter) &&
        (!startFilter || endDate >= startFilter)
      );
    });
  }, [filteredAccounts, dateRange]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex gap-4 items-center">
        <div>
          <label htmlFor="start" className="block text-xs font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            id="start"
            name="start"
            value={dateRange.start}
            onChange={handleDateChange}
            className="border px-3 py-2 rounded text-xs"
          />
        </div>

        <div>
          <label htmlFor="end" className="block text-xs font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            id="end"
            name="end"
            value={dateRange.end}
            onChange={handleDateChange}
            className="border px-3 py-2 rounded text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Source filteredAccounts={filteredByDate} />
        <CSRMetrics filteredAccounts={filteredByDate} />
        <OutboundCalls filteredCalls={filteredByDate} dateRange={dateRange} />
        <Quotation records={filteredByDate} />
        {/* Sales Order */}
      </div>
    </div>
  );
};

export default MainContainer;
