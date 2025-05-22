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
        `/api/ModuleCSR/Dashboard/WrapupData?ReferenceID=${ReferenceID}&Role=${Role}`
      );
      if (!response.ok) throw new Error("Failed to fetch data");

      let data: WrapupTableData[] = await response.json();

      if (Role === "Staff") {
        data = data.filter(m => m.ReferenceID === ReferenceID);
      }

      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);

      // Filter by createdAt date range
      const filtered = data.filter(({ createdAt }) => {
        const created = new Date(createdAt);
        return (!start || created >= start) && (!end || created <= end);
      });

      // If you have month and year variables to filter by, define them:
      // For example:
      // const month = start ? start.getMonth() + 1 : null;
      // const year = start ? start.getFullYear() : null;

      // Filter final data with wrapupLabels and optional month/year check
      const finalData = filtered.filter(item => {
        if (!item.createdAt || !item.WrapUp) return false;
        const createdAt = new Date(item.createdAt);

        // Example month/year check (remove if not used)
        const month = start ? start.getMonth() + 1 : null;
        const year = start ? start.getFullYear() : null;

        const matchesMonthYear = month && year
          ? createdAt.getMonth() + 1 === month && createdAt.getFullYear() === year
          : true;

        return matchesMonthYear && wrapupLabels.includes(item.WrapUp);
      });

      setMetrics(finalData);
    } catch (error) {
      console.error("Error fetching wrap-up data:", error);
    } finally {
      setLoading(false);
    }
  }, [ReferenceID, Role, startDate, endDate]);


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

  // Calculate totals for each week
  const weekTotals = useMemo(() => {
    const totals = {
      "Week 1": 0,
      "Week 2": 0,
      "Week 3": 0,
      "Week 4": 0,
    };

    wrapupLabels.forEach((label) => {
      Object.keys(totals).forEach((week) => {
        totals[week as keyof typeof totals] += weeklyCounts[week as keyof typeof weeklyCounts][label] || 0;
      });
    });

    return totals;
  }, [weeklyCounts, wrapupLabels]);

  return (
    <div className="bg-white">
      {loading ? (
        <div className="flex justify-center items-center h-full w-full">
          <div className="flex justify-center items-center w-30 h-30">
            <RiRefreshLine size={30} className="animate-spin" />
          </div>
        </div>
      ) : (
        <>
          <h3 className="text-left text-sm font-semibold mb-4">Weekly Wrap-Up</h3>
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
            <tfoot className="bg-gray-100">
              <tr className="text-xs font-semibold text-gray-700">
                <td className="px-6 py-4">Total</td>
                <td className="px-6 py-4">{weekTotals["Week 1"]}</td>
                <td className="px-6 py-4">{weekTotals["Week 2"]}</td>
                <td className="px-6 py-4">{weekTotals["Week 3"]}</td>
                <td className="px-6 py-4">{weekTotals["Week 4"]}</td>
              </tr>
            </tfoot>
          </table>
        </>
      )}
    </div>
  );
};

export default WrapupTable;
