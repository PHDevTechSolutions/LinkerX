"use client";
import React, { useEffect, useState } from "react";

interface WrapUp {
  WrapUp: string | null;
  createdAt: string | null;
  ReferenceID: string;
}

interface WrapupProps {
  ReferenceID: string;
  Role: string;
  month?: number;
  year?: number;
  startDate?: string;
  endDate?: string;
}

const Wrapup: React.FC<WrapupProps> = ({
  ReferenceID,
  Role,
  month,
  year,
  startDate,
  endDate,
}) => {
  const [wrapups, setWrapups] = useState<WrapUp[]>([]);
  const [loading, setLoading] = useState(true);

  const wrapupLabels = [
    "Customer Order",
    "Customer Inquiry Sales",
    "Customer Inquiry Non-Sales",
    "Follow Up Sales",
    "After Sales",
    "Customer Complaint",
    "Customer Feedback/Recommendation",
    "Job Inquiry",
    "Job Applicants",
    "Supplier/Vendor Product Offer",
    "Follow Up Non-Sales",
    "Internal Whistle Blower",
    "Threats/Extortion/Intimidation",
    "Supplier Accreditation Request",
    "Internal Concern",
    "Others",
  ];

  const colors = [
    "#3A7D44", "#27445D", "#71BBB2", "#578FCA", "#9966FF", "#FF9F40",
    "#C9CBCF", "#8B0000", "#008080", "#FFD700", "#DC143C", "#20B2AA",
    "#8A2BE2", "#00CED1", "#2E8B57", "#4682B4"
  ];

  useEffect(() => {
    const fetchWrapups = async () => {
      try {
        const res = await fetch(
          `/api/ModuleCSR/Dashboard/Wrapup?ReferenceID=${ReferenceID}&Role=${Role}&month=${month}&year=${year}`
        );
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();

        let filtered = data;
        if (Role === "Staff") {
          filtered = data.filter((item: WrapUp) => item.ReferenceID === ReferenceID);
        }

        const adjustedStartDate = startDate ? new Date(startDate) : null;
        const adjustedEndDate = endDate ? new Date(endDate) : null;

        if (adjustedStartDate) adjustedStartDate.setHours(0, 0, 0, 0);
        if (adjustedEndDate) adjustedEndDate.setHours(23, 59, 59, 999);

        const final = filtered.filter((item: WrapUp) => {
          if (!item.createdAt || !item.WrapUp) return false;

          const createdAt = new Date(item.createdAt);
          const isWithinMonthYear = month && year
            ? createdAt.getMonth() + 1 === month && createdAt.getFullYear() === year
            : true;

          const isWithinDateRange = adjustedStartDate && adjustedEndDate
            ? createdAt >= adjustedStartDate && createdAt <= adjustedEndDate
            : true;

          return isWithinMonthYear && isWithinDateRange && wrapupLabels.includes(item.WrapUp);
        });

        setWrapups(final);
      } catch (error) {
        console.error("Error fetching wrapup data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWrapups();
  }, [ReferenceID, Role, month, year, startDate, endDate]);

  const grouped = wrapups.reduce((acc, item) => {
    if (!item.WrapUp) return acc;
    acc[item.WrapUp] = (acc[item.WrapUp] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const maxValue = Math.max(...Object.values(grouped), 1);

  return (
    <div className="w-full">
      <div className="bg-white w-full h-full">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="w-full h-full overflow-x-auto">
            <h3 className="text-center text-sm font-semibold mb-4">
              Wrap-up
            </h3>
            <div className="flex items-end h-full space-x-4 sm:h-[400px] w-full">
              {wrapupLabels.map((label, index) => {
                const value = grouped[label] || 0;
                const heightPercent = (value / maxValue) * 100;

                return (
                  <div
                    key={label}
                    className="flex flex-col items-center h-full group"
                  >
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

export default Wrapup;
