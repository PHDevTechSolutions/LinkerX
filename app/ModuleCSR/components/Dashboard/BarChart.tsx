"use client";
import React, { useEffect, useState, useMemo } from "react";
import { RiRefreshLine } from "react-icons/ri";

interface Metric {
  createdAt: string;
  Channel: string;
  Traffic: string;
  ReferenceID: string;
}

interface MetricTableProps {
  ReferenceID: string;
  month?: number;
  year?: number;
  Role: string;
  startDate?: string;
  endDate?: string;
}

const CHANNELS = [
  "Google Maps", "Website", "FB Main", "FB ES Home", "Viber", "Text Message",
  "Instagram", "Voice Call", "Email", "Whatsapp", "Shopify"
];

const COLORS = [
  "#3A7D44", "#27445D", "#71BBB2", "#578FCA", "#9966FF", "#FF9F40",
  "#C9CBCF", "#8B0000", "#008080", "#FFD700", "#DC143C", "#20B2AA",
  "#8A2BE2", "#FF4500", "#00CED1", "#2E8B57", "#4682B4"
];

const MetricTable: React.FC<MetricTableProps> = ({
  ReferenceID, month, year, Role, startDate, endDate
}) => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const url = `/api/ModuleCSR/Dashboard/Metrics?ReferenceID=${ReferenceID}&month=${month}&year=${year}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch metrics");

        let data: Metric[] = await res.json();

        // Apply ReferenceID filtering only if needed
        if (Role === "Staff") {
          data = data.filter(m => m.ReferenceID === ReferenceID);
        }

        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        // Parse once for performance
        const filtered = data.filter(({ createdAt }) => {
          const created = new Date(createdAt);
          const matchMonthYear =
            month && year ? (created.getMonth() + 1 === month && created.getFullYear() === year) : true;
          const inDateRange =
            start && end ? (created >= start && created <= end) : true;
          return matchMonthYear && inDateRange;
        });

        setMetrics(filtered);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [ReferenceID, Role, month, year, startDate, endDate]);

  const grouped = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const { Channel } of metrics) {
      if (!CHANNELS.includes(Channel)) continue;
      counts[Channel] = (counts[Channel] || 0) + 1;
    }
    return counts;
  }, [metrics]);

  const maxValue = useMemo(() => Math.max(...Object.values(grouped), 1), [grouped]);

  return (
    <div className="bg-white h-full w-full">
      {loading ? (
        <div className="flex justify-center items-center h-full w-full">
          <RiRefreshLine size={30} className="animate-spin text-gray-600" />
        </div>
      ) : (
        <div className="w-full h-full overflow-x-auto">
          <div className="flex items-end h-full space-x-4 min-w-max sm:h-[400px]">
            {CHANNELS.map((channel, i) => {
              const value = grouped[channel] || 0;
              const height = (value / maxValue) * 100;

              return (
                <div key={channel} className="flex flex-col items-center w-12 h-full group">
                  <div className="relative w-full flex-1 bg-gray-100 flex items-end rounded-md overflow-hidden">
                    <div
                      title={`${channel}: ${value}`}
                      style={{
                        height: `${height}%`,
                        backgroundColor: COLORS[i % COLORS.length],
                      }}
                      className="w-full transition-all duration-300 rounded-t group-hover:scale-105 group-hover:brightness-90"
                    />
                  </div>
                  <span className="text-[10px] sm:text-xs text-center mt-1 break-words leading-tight">
                    {channel}
                  </span>
                  <span className="text-[10px] font-semibold sm:text-sm">{value}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricTable;
