"use client";
import React, { useEffect, useState, useMemo } from "react";
import { RiRefreshLine } from "react-icons/ri";

interface Source {
  Source: string | null;
  createdAt: string | null;
  ReferenceID: string;
}

interface CustomerSourceProps {
  ReferenceID: string;
  Role: string;
  month?: number;
  year?: number;
  startDate?: string;
  endDate?: string;
}

const CustomerSource: React.FC<CustomerSourceProps> = ({
  ReferenceID,
  Role,
  month,
  year,
  startDate,
  endDate,
}) => {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const sourceLabels = useMemo(
    () => [
      "FB Ads", "Viber Community / Viber", "Whatsapp Community / Whatsapp",
      "SMS", "Website", "Word of Mouth", "Quotation Docs", "Google Search",
      "Site Visit", "Agent Call", "Catalogue", "Shopee", "Lazada",
      "Tiktok", "WorldBex", "PhilConstruct", "Conex", "Product Demo"
    ],
    []
  );

  const colors = useMemo(
    () => [
      "#3A7D44", "#27445D", "#71BBB2", "#578FCA", "#9966FF", "#FF9F40",
      "#C9CBCF", "#8B0000", "#008080", "#FFD700", "#DC143C", "#20B2AA",
      "#8A2BE2", "#FF4500", "#00CED1", "#2E8B57", "#4682B4", "#F08080"
    ],
    []
  );

  useEffect(() => {
    const fetchSources = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          ReferenceID,
          Role,
          month: month?.toString() ?? "",
          year: year?.toString() ?? "",
        });

        const res = await fetch(`/api/ModuleCSR/Dashboard/CustomerSource?${queryParams}`);
        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();

        let filtered = data;
        if (Role === "Staff") {
          filtered = data.filter((item: Source) => item.ReferenceID === ReferenceID);
        }

        const adjustedStartDate = startDate ? new Date(startDate) : null;
        const adjustedEndDate = endDate ? new Date(endDate) : null;

        if (adjustedStartDate) adjustedStartDate.setHours(0, 0, 0, 0);
        if (adjustedEndDate) adjustedEndDate.setHours(23, 59, 59, 999);

        const final = filtered.filter((item: Source) => {
          if (!item.createdAt || !item.Source) return false;

          const createdAt = new Date(item.createdAt);
          const isWithinMonthYear = month && year
            ? createdAt.getMonth() + 1 === month && createdAt.getFullYear() === year
            : true;

          const isWithinDateRange = adjustedStartDate && adjustedEndDate
            ? createdAt >= adjustedStartDate && createdAt <= adjustedEndDate
            : true;

          return isWithinMonthYear && isWithinDateRange && sourceLabels.includes(item.Source);
        });

        setSources(final);
      } catch (error) {
        console.error("Error fetching sources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSources();
  }, [ReferenceID, Role, month, year, startDate, endDate, sourceLabels]);

  const grouped = useMemo(() => {
    return sources.reduce((acc, item) => {
      if (!item.Source) return acc;
      acc[item.Source] = (acc[item.Source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [sources]);

  const maxValue = useMemo(() => Math.max(...Object.values(grouped), 1), [grouped]);

  return (
    <div className="w-full">
      <div className="bg-white w-full h-full">
        {loading ? (
          <div className="flex justify-center items-center h-full w-full">
            <div className="flex justify-center items-center w-30 h-30">
              <RiRefreshLine size={30} className="animate-spin" />
            </div>
          </div>
        ) : (
          <div className="w-full h-full overflow-x-auto">
            <h3 className="text-center text-sm font-semibold mb-4">
              Where Customers Found Us
            </h3>
            <div className="flex items-end h-full space-x-4 sm:h-[400px] w-full">
              {sourceLabels.map((label, index) => {
                const value = grouped[label] || 0;
                const heightPercent = (value / maxValue) * 100;

                return (
                  <div key={label} className="flex flex-col items-center h-full group">
                    <div className="relative w-full flex-1 bg-gray-100 flex items-end rounded-md overflow-hidden">
                      <div
                        className="w-full transition-all duration-300 rounded-t group-hover:scale-105 group-hover:brightness-90"
                        style={{
                          height: `${heightPercent}%`,
                          backgroundColor: colors[index % colors.length],
                        }}
                        title={`${label}: ${value}`}
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs text-center mt-1 break-words leading-tight">
                      {label}
                    </span>
                    <span className="text-[10px] font-semibold sm:text-sm">
                      {value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSource;
