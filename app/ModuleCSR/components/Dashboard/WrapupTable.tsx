"use client";
import React, { useEffect, useState } from "react";

interface WrapupTable {
  createdAt: string;
  WrapUp: string;
}

interface WrapupTableProps {
  ReferenceID: string;
  Role: string;
  month: number;
  year: number;
}

// ✅ Get week number logic
const getWeekNumber = (dateString: string) => {
  const date = new Date(dateString);
  const dayOfMonth = date.getDate();

  if (dayOfMonth <= 7) return 1;
  if (dayOfMonth <= 14) return 2;
  if (dayOfMonth <= 21) return 3;
  return 4; // Days 22-31 go to Week 4
};

const WrapupTable: React.FC<WrapupTableProps> = ({
  ReferenceID,
  Role,
  month,
  year,
}) => {
  const [metrics, setMetrics] = useState<WrapupTable[]>([]);
  const [loading, setLoading] = useState(true);

  const allChannels = [
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
    "Prank Call",
    "Supplier Accreditation Request",
    "Internal Concern",
    "Others",
  ];

  // ✅ Fetch data with month and year filtering
  const fetchMetricsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/ModuleCSR/Dashboard/WrapupData?ReferenceID=${ReferenceID}&Role=${Role}&month=${month}&year=${year}`
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();

      // ✅ Filter the data based on selected month and year
      const filteredData = data.filter((metric: WrapupTable) => {
        const metricDate = new Date(metric.createdAt);
        return (
          metricDate.getMonth() + 1 === month &&
          metricDate.getFullYear() === year
        );
      });

      setMetrics(filteredData);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetricsData();
  }, [ReferenceID, Role, month, year]);

  // ✅ Calculate weekly counts per channel
  const calculateWeeklyCounts = () => {
    const weeklyCounts: Record<string, Record<string, number>> = {
      "Week 1": {},
      "Week 2": {},
      "Week 3": {},
      "Week 4": {},
    };

    metrics.forEach((metric) => {
      const weekNumber = getWeekNumber(metric.createdAt);
      if (weekNumber >= 1 && weekNumber <= 4) {
        const key = metric.WrapUp;
        if (!weeklyCounts[`Week ${weekNumber}`][key]) {
          weeklyCounts[`Week ${weekNumber}`][key] = 0;
        }
        weeklyCounts[`Week ${weekNumber}`][key]++;
      }
    });

    return weeklyCounts;
  };

  const weeklyCounts = calculateWeeklyCounts();

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      {/* ✅ Loading or Data Table */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200 text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Wrap-Up</th>
              <th className="border p-2">Week 1</th>
              <th className="border p-2">Week 2</th>
              <th className="border p-2">Week 3</th>
              <th className="border p-2">Week 4</th>
            </tr>
          </thead>
          <tbody>
            {allChannels.map((WrapUp) => (
              <tr key={WrapUp} className="text-center border-t">
                <td className="border p-2 text-left">{WrapUp}</td>
                <td className="border p-2">
                  {weeklyCounts["Week 1"][WrapUp] || 0}
                </td>
                <td className="border p-2">
                  {weeklyCounts["Week 2"][WrapUp] || 0}
                </td>
                <td className="border p-2">
                  {weeklyCounts["Week 3"][WrapUp] || 0}
                </td>
                <td className="border p-2">
                  {weeklyCounts["Week 4"][WrapUp] || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WrapupTable;
