"use client";
import React, { useEffect, useState, useMemo } from "react";
import { RiRefreshLine } from "react-icons/ri";
import { CiExport } from "react-icons/ci";

interface Source {
  Source: string | null;
  createdAt: string;
  ReferenceID: string;
  CompanyName: string;
  CustomerName: string;
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
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

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
          data = data.filter((m) => m.ReferenceID === ReferenceID);
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

  // Filter data for modal by selected source
  const filteredDataBySource = (source: string) =>
    sources.filter((s) => s.Source === source);

  // CSV Export for all filtered sources
  const handleExportCSV = () => {
    const csvRows = [
      ["Source", "Created At", "CompanyName"],
      ...sources.map(({ Source, createdAt, CompanyName }) => [
        Source || "N/A",
        createdAt ? new Date(createdAt).toLocaleString() : "N/A",
        CompanyName,
      ]),
    ];

    const csvContent = csvRows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "CustomerSource_Data.csv";
    link.click();
  };

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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-left text-sm font-semibold mb-4">Where Customers Found Us</h3>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1 border mb-2 bg-white text-black text-xs px-4 py-2 shadow-sm rounded hover:bg-orange-500 hover:text-white transition"
              >
                <CiExport size={16} /> Export CSV
              </button>
            </div>

            <div className="flex items-end h-full space-x-4 sm:h-[400px] w-full">
              {sourceLabels.map((label, index) => {
                const value = grouped[label] || 0;
                const heightPercent = (value / maxValue) * 100;

                return (
                  <div
                    key={label}
                    className="flex flex-col items-center h-full group cursor-pointer"
                    onClick={() => setSelectedSource(label)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setSelectedSource(label);
                    }}
                    aria-label={`View details for ${label}`}
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
                    <span className="text-[10px] font-semibold sm:text-sm">{value}</span>
                  </div>
                );
              })}
            </div>

            {/* Modal */}
            {selectedSource && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]"
                role="dialog"
                aria-modal="true"
                aria-labelledby="customer-source-modal-title"
                onClick={() => setSelectedSource(null)}
              >
                <div
                  className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[70vh] overflow-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4
                      id="customer-source-modal-title"
                      className="font-semibold text-lg"
                    >
                      Details for {selectedSource}
                    </h4>
                    <button
                      onClick={() => setSelectedSource(null)}
                      className="text-red-500 hover:underline focus:outline-none"
                      aria-label="Close modal"
                    >
                      Close
                    </button>
                  </div>
                  <ul className="space-y-3 text-sm">
                    {filteredDataBySource(selectedSource).map((item, i) => (
                      <li key={i} className="border-b pb-2">
                        <div>
                          <strong>Company Name:</strong> {item.CompanyName}
                        </div>
                        <div>
                          <strong>Source:</strong> {item.Source || "N/A"}
                        </div>
                        <div>
                          <strong>Date:</strong>{" "}
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleString()
                            : "N/A"}
                        </div>
                      </li>
                    ))}
                    {filteredDataBySource(selectedSource).length === 0 && (
                      <li className="text-center text-gray-500 text-xs">No records found.</li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSource;
