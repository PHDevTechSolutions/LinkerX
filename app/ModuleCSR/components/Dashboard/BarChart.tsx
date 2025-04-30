"use client";
import React, { useEffect, useState } from "react";

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

const MetricTable: React.FC<MetricTableProps> = ({ ReferenceID, month, year, Role, startDate, endDate }) => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Fixed list of channels
  const channels = [
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

  // ✅ Fixed colors for each channel
  const colors = [
    "#3A7D44",
    "#27445D",
    "#71BBB2",
    "#578FCA",
    "#9966FF",
    "#FF9F40",
    "#C9CBCF",
    "#8B0000",
    "#008080",
    "#FFD700",
    "#DC143C",
    "#20B2AA",
    "#8A2BE2",
    "#FF4500",
    "#00CED1",
    "#2E8B57",
    "#4682B4",
  ];

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const apiUrl = `/api/ModuleCSR/Dashboard/Metrics?ReferenceID=${ReferenceID}&month=${month}&year=${year}`;
        const response = await fetch(apiUrl);
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

        setMetrics(finalData);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [ReferenceID, Role, month, year, startDate, endDate]);


  // ✅ Group by Channel for predefined channels
  const grouped = metrics.reduce((acc, item) => {
    if (!channels.includes(item.Channel)) return acc;
    acc[item.Channel] = (acc[item.Channel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const maxValue = Math.max(...Object.values(grouped), 1);

  return (
    <div className="bg-white h-full w-full">
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="w-full h-full overflow-x-auto">
          <div className="flex items-end h-full space-x-4 min-w-max sm:h-[400px]">
            {channels.map((channel, index) => {
              const value = grouped[channel] || 0;
              const heightPercent = (value / maxValue) * 100;

              return (
                <div
                  key={channel}
                  className="flex flex-col items-center w-12 h-full group"
                >
                  <div className="relative w-full flex-1 bg-gray-100 flex items-end rounded-md overflow-hidden">
                    <div
                      className="w-full transition-all duration-300 rounded-t group-hover:scale-105 group-hover:brightness-90"
                      style={{
                        height: `${heightPercent}%`,
                        backgroundColor: colors[index % colors.length],
                      }}
                      title={`${channel}: ${value}`}
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
