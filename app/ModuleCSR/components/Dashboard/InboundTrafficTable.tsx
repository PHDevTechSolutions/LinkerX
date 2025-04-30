"use client";
import React, { useEffect, useState } from "react";

interface Metric {
  createdAt: string;
  Channel: string;
  ReferenceID: string; // Add this property for filtering
}

interface MetricTableProps {
  ReferenceID: string;
  Role: string;
  month: number;
  year: number;
  startDate?: string;
  endDate?: string;
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

const MetricTable: React.FC<MetricTableProps> = ({ReferenceID, Role, month, year, startDate, endDate}) => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  const allChannels = [
    "Google Maps",
    "Website",
    "FB Main",
    "FB ES Home",
    "Viber",
    "Text Message",
    "Instagram",
    "Voice Call",
    "Email",
    "Whatsapp",
    "Shopify",
  ];

  // ✅ Fetch data with month and year filtering
  const fetchMetricsData = async (
    month: number,
    year: number
  ) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/ModuleCSR/Dashboard/InboundTraffic?ReferenceID=${ReferenceID}&Role=${Role}&month=${month}&year=${year}`
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();

      // ✅ Filter data by role
      let filteredData = data;

      if (Role === "Staff") {
        filteredData = data.filter(
          (item: Metric) => item.ReferenceID === ReferenceID
        );
      }

      // Convert startDate and endDate to dates with time set to 00:00:00 and 23:59:59 respectively
      const adjustedStartDate = startDate ? new Date(startDate) : null;
      const adjustedEndDate = endDate ? new Date(endDate) : null;

      if (adjustedStartDate) adjustedStartDate.setHours(0, 0, 0, 0); // Start date at 00:00:00
      if (adjustedEndDate) adjustedEndDate.setHours(23, 59, 59, 999); // End date at 23:59:59

      // ✅ Filter by month/year or by date range
      const finalData = filteredData.filter((item: Metric) => {
        const createdAtDate = new Date(item.createdAt);

        const isWithinMonthYear =
          month && year
            ? createdAtDate.getMonth() + 1 === month && createdAtDate.getFullYear() === year
            : true;

        const isWithinDateRange =
          adjustedStartDate && adjustedEndDate
            ? createdAtDate >= adjustedStartDate && createdAtDate <= adjustedEndDate
            : true;

        return isWithinDateRange && isWithinMonthYear;
      });

      setMetrics(filteredData);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetricsData(month, year);
  }, [ReferenceID, Role, month, year, startDate, endDate]);

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
        const key = metric.Channel;
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
    <div className="bg-white">
      {/* ✅ Loading or Data Table */}
      {loading ? (
        <p className="text-center text-xs">Loading...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200 text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Channel</th>
              <th className="border p-2">Week 1</th>
              <th className="border p-2">Week 2</th>
              <th className="border p-2">Week 3</th>
              <th className="border p-2">Week 4</th>
            </tr>
          </thead>
          <tbody>
            {allChannels.map((channel) => (
              <tr key={channel} className="text-center border-t">
                <td className="border p-2">{channel}</td>
                <td className="border p-2">
                  {weeklyCounts["Week 1"][channel] || 0}
                </td>
                <td className="border p-2">
                  {weeklyCounts["Week 2"][channel] || 0}
                </td>
                <td className="border p-2">
                  {weeklyCounts["Week 3"][channel] || 0}
                </td>
                <td className="border p-2">
                  {weeklyCounts["Week 4"][channel] || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MetricTable;
