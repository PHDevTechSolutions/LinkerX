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
  "#C9CBCF", "#8B0000", "#008080", "#FFD700", "#DC143C"
];

const MetricTable: React.FC<MetricTableProps> = ({
  ReferenceID, Role, startDate, endDate
}) => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const url = `/api/ModuleCSR/Dashboard/Metrics?ReferenceID=${ReferenceID}&Role=${Role}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch metrics");

        let data: Metric[] = await res.json();

        if (Role === "Staff") {
          data = data.filter(m => m.ReferenceID === ReferenceID);
        }

        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        const filtered = data.filter(({ createdAt }) => {
          const created = new Date(createdAt);
          return (!start || created >= start) && (!end || created <= end);
        });

        setMetrics(filtered);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [ReferenceID, Role, startDate, endDate]);

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
    <div className="bg-white w-full h-auto">
      {loading ? (
        <div className="flex justify-center items-center w-full h-full">
          <RiRefreshLine size={30} className="animate-spin text-gray-600" />
        </div>
      ) : (
        <>
        <h3 className="text-left text-sm font-semibold mb-4">Channel</h3>
        <div className="w-full h-full overflow-x-auto">
          <div className="grid grid-cols-12 gap-2 items-end h-full sm:min-h-[400px]">
            {CHANNELS.map((channel, i) => {
              const value = grouped[channel] || 0;
              const height = (value / maxValue) * 100;

              return (
                <div key={channel} className="flex flex-col items-center h-full col-span-1">
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
        </>
      )}
    </div>
  );
};

export default MetricTable;
