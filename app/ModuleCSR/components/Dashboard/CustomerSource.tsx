"use client";
import React, { useEffect, useState, useMemo } from "react";
import { RiRefreshLine } from "react-icons/ri";

interface Source {
  Source: string | null;
  createdAt: string;
  ReferenceID: string;
}

interface CustomerSourceProps {
  ReferenceID: string;
  Role: string;
  startDate?: string;
  endDate?: string;
}

const CustomerSource: React.FC<CustomerSourceProps> = ({
  ReferenceID,
  Role,
  startDate,
  endDate,
}) => {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Labels for the customer sources
  const sourceLabels = useMemo(
    () => [
      "FB Ads", "Viber Community / Viber", "Whatsapp Community / Whatsapp",
      "SMS", "Website", "Word of Mouth", "Quotation Docs", "Google Search",
      "Site Visit", "Agent Call", "Catalogue", "Shopee", "Lazada",
      "Tiktok", "WorldBex", "PhilConstruct", "Conex", "Product Demo",
    ],
    []
  );

  // Colors for bars in chart
  const colors = useMemo(
    () => [
      "#3A7D44", "#27445D", "#71BBB2", "#578FCA", "#9966FF", "#FF9F40",
      "#C9CBCF", "#8B0000", "#008080", "#FFD700", "#DC143C", "#20B2AA",
      "#8A2BE2", "#FF4500", "#00CED1", "#2E8B57", "#4682B4", "#F08080",
    ],
    []
  );

  useEffect(() => {
    const fetchSources = async () => {
      setLoading(true);
      try {
        const url = `/api/ModuleCSR/Dashboard/CustomerSource?ReferenceID=${ReferenceID}&Role=${Role}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch data");

        let data: Source[] = await res.json();

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

        setSources(filtered);
      } catch (error) {
        console.error("Error fetching sources:", error);
        setSources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSources();
  }, [ReferenceID, Role, startDate, endDate]);

  // Group and count the sources
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
            <h3 className="text-left text-sm font-semibold mb-4">
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
