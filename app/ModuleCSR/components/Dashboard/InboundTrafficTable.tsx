"use client";
import React, { useEffect, useState, useMemo } from "react";
import { RiRefreshLine } from "react-icons/ri";

interface Metric {
  createdAt: string;
  Channel: string;
  ReferenceID: string;
}

interface MetricTableProps {
  ReferenceID: string;
  Role: string;
  month: number;
  year: number;
  startDate?: string;
  endDate?: string;
}

const getWeekNumber = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  if (day <= 7) return 1;
  if (day <= 14) return 2;
  if (day <= 21) return 3;
  return 4;
};

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

const MetricTable: React.FC<MetricTableProps> = ({
  ReferenceID,
  Role,
  month,
  year,
  startDate,
  endDate,
}) => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/ModuleCSR/Dashboard/InboundTraffic?ReferenceID=${ReferenceID}&Role=${Role}&month=${month}&year=${year}`
      );
      if (!res.ok) throw new Error("Failed to fetch data");

      const data: Metric[] = await res.json();
      const userFiltered = Role === "Staff"
        ? data.filter((m) => m.ReferenceID === ReferenceID)
        : data;

      setMetrics(userFiltered);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [ReferenceID, Role, month, year]);

  const filteredMetrics = useMemo(() => {
    if (!startDate && !endDate) return metrics;

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    return metrics.filter((item) => {
      const date = new Date(item.createdAt);
      return (!start || date >= start) && (!end || date <= end);
    });
  }, [metrics, startDate, endDate]);

  const weeklyCounts = useMemo(() => {
    const counts: Record<string, Record<string, number>> = {
      "Week 1": {},
      "Week 2": {},
      "Week 3": {},
      "Week 4": {},
    };

    for (const item of filteredMetrics) {
      const week = `Week ${getWeekNumber(item.createdAt)}`;
      counts[week][item.Channel] = (counts[week][item.Channel] || 0) + 1;
    }

    return counts;
  }, [filteredMetrics]);

  return (
    <div className="bg-white overflow-x-auto">
      {loading ? (
        <div className="flex justify-center items-center h-full py-10">
          <RiRefreshLine size={30} className="animate-spin text-gray-600" />
        </div>
      ) : (
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr className="text-xs text-left whitespace-nowrap border-l-4 border-emerald-400">
              <th className="px-6 py-4 font-semibold text-gray-700">Channel</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Week 1</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Week 2</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Week 3</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Week 4</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {allChannels.map((channel) => (
              <tr key={channel} className="border-b whitespace-nowrap">
                <td className="px-6 py-4 text-xs">{channel}</td>
                <td className="px-6 py-4 text-xs">{weeklyCounts["Week 1"][channel] || 0}</td>
                <td className="px-6 py-4 text-xs">{weeklyCounts["Week 2"][channel] || 0}</td>
                <td className="px-6 py-4 text-xs">{weeklyCounts["Week 3"][channel] || 0}</td>
                <td className="px-6 py-4 text-xs">{weeklyCounts["Week 4"][channel] || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MetricTable;
