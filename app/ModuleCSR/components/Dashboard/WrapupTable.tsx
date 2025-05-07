"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { RiRefreshLine } from "react-icons/ri";

interface WrapupTableData {
  createdAt: string;
  WrapUp: string;
  ReferenceID?: string;
}

interface WrapupTableProps {
  ReferenceID: string;
  Role: string;
  month: number;
  year: number;
  startDate?: string;
  endDate?: string;
}

// Week number logic based on day of the month
const getWeekNumber = (dateString: string) => {
  const day = new Date(dateString).getDate();
  if (day <= 7) return 1;
  if (day <= 14) return 2;
  if (day <= 21) return 3;
  return 4;
};

const WrapupTable: React.FC<WrapupTableProps> = ({
  ReferenceID,
  Role,
  month,
  year,
  startDate,
  endDate,
}) => {
  const [metrics, setMetrics] = useState<WrapupTableData[]>([]);
  const [loading, setLoading] = useState(true);

  const wrapupLabels = [
    "Customer Order",
    "Customer Inquiry Sales",
    "Customer Inquiry Non-Sales",
    "Follow Up Sales",
    "Follow Up Non-Sales",
    "After Sales",
    "Customer Complaint",
    "Customer Feedback/Recommendation",
    "Job Applicants",
    "Supplier/Vendor Product Offer",
    "Internal Whistle Blower",
    "Threats/Extortion/Intimidation",
    "Supplier Accreditation Request",
    "Internal Concern",
    "Others",
  ];

  // Memoized fetch function to prevent re-fetching unnecessarily
  const fetchMetricsData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/ModuleCSR/Dashboard/WrapupData?ReferenceID=${ReferenceID}&Role=${Role}&month=${month}&year=${year}`
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const data: WrapupTableData[] = await response.json();

      // Filter by ReferenceID for Staff
      let filteredData = Role === "Staff"
        ? data.filter(item => item.ReferenceID === ReferenceID)
        : data;

      // Date range filtering
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);

      const finalData = filteredData.filter((item) => {
        if (!item.createdAt || !item.WrapUp) return false;

        const createdAt = new Date(item.createdAt);

        const matchesMonthYear =
          createdAt.getMonth() + 1 === month &&
          createdAt.getFullYear() === year;

        const inRange =
          (!start || createdAt >= start) &&
          (!end || createdAt <= end);

        return matchesMonthYear && inRange && wrapupLabels.includes(item.WrapUp);
      });

      setMetrics(finalData);
    } catch (error) {
      console.error("Error fetching wrap-up data:", error);
    } finally {
      setLoading(false);
    }
  }, [ReferenceID, Role, month, year, startDate, endDate]);

  useEffect(() => {
    fetchMetricsData();
  }, [fetchMetricsData]);

  // Memoized calculation of weekly counts
  const weeklyCounts = useMemo(() => {
    const counts: Record<string, Record<string, number>> = {
      "Week 1": {},
      "Week 2": {},
      "Week 3": {},
      "Week 4": {},
    };

    metrics.forEach((item) => {
      const week = `Week ${getWeekNumber(item.createdAt)}`;
      const label = item.WrapUp;

      if (!counts[week][label]) {
        counts[week][label] = 0;
      }
      counts[week][label]++;
    });

    return counts;
  }, [metrics]);

  return (
    <div className="bg-white">
      {loading ? (
        <div className="flex justify-center items-center h-full w-full">
          <div className="flex justify-center items-center w-30 h-30">
            <RiRefreshLine size={30} className="animate-spin" />
          </div>
        </div>
      ) : (
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr className="text-xs text-left whitespace-nowrap border-l-4 border-emerald-400">
              <th className="px-6 py-4 font-semibold text-gray-700">Wrap-Up</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Week 1</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Week 2</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Week 3</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Week 4</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {wrapupLabels.map((label) => (
              <tr key={label} className="border-b whitespace-nowrap">
                <td className="px-6 py-4 text-xs">{label}</td>
                <td className="px-6 py-4 text-xs">{weeklyCounts["Week 1"][label] || 0}</td>
                <td className="px-6 py-4 text-xs">{weeklyCounts["Week 2"][label] || 0}</td>
                <td className="px-6 py-4 text-xs">{weeklyCounts["Week 3"][label] || 0}</td>
                <td className="px-6 py-4 text-xs">{weeklyCounts["Week 4"][label] || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WrapupTable;
