"use client";
import React, { useEffect, useState, useMemo } from "react";
import { RiRefreshLine } from "react-icons/ri";
import { CiExport } from "react-icons/ci";

interface WrapUp {
  WrapUp: string | null;
  createdAt: string | null;
  ReferenceID: string;
  CompanyName?: string; // Add if you have this field, else remove references to CompanyName below
}

interface WrapupProps {
  ReferenceID: string;
  Role: string;
  startDate?: string;
  endDate?: string;
}

const Wrapup: React.FC<WrapupProps> = ({
  ReferenceID,
  Role,
  startDate,
  endDate,
}) => {
  const [wrapups, setWrapups] = useState<WrapUp[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [selectedWrapup, setSelectedWrapup] = useState<string | null>(null);

  const wrapupLabels = useMemo(
    () => [
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
    ],
    []
  );

  const colors = useMemo(
    () => [
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
      "#00CED1",
      "#2E8B57",
      "#4682B4",
    ],
    []
  );

  useEffect(() => {
    const fetchWrapups = async () => {
      setLoading(true);
      try {
        const url = `/api/ModuleCSR/Dashboard/Wrapup?ReferenceID=${ReferenceID}&Role=${Role}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch wrapup data");

        let data: WrapUp[] = await res.json();

        if (Role === "Staff") {
          data = data.filter((m) => m.ReferenceID === ReferenceID);
        }

        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        const filtered = data.filter(({ createdAt, WrapUp }) => {
          if (!createdAt || !WrapUp) return false;
          const created = new Date(createdAt);
          return (!start || created >= start) && (!end || created <= end);
        });

        setWrapups(filtered);
      } catch (error) {
        console.error("Error fetching wrapup data:", error);
        setWrapups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWrapups();
  }, [ReferenceID, Role, startDate, endDate]);

  // Group wrap-ups for chart
  const grouped = useMemo(() => {
    return wrapups.reduce((acc, item) => {
      if (!item.WrapUp) return acc;
      acc[item.WrapUp] = (acc[item.WrapUp] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [wrapups]);

  const maxValue = useMemo(() => Math.max(...Object.values(grouped), 1), [
    grouped,
  ]);

  // Filter wrapups for modal display by selectedWrapup label
  const modalData = useMemo(() => {
    if (!selectedWrapup) return [];
    return wrapups.filter((w) => w.WrapUp === selectedWrapup);
  }, [selectedWrapup, wrapups]);

  // CSV Export for all filtered wrapups
  const handleExportCSV = () => {
    if (wrapups.length === 0) return;

    const csvRows = [
      ["WrapUp", "Created At", "ReferenceID"],
      ...wrapups.map(({ WrapUp, createdAt, ReferenceID }) => [
        WrapUp || "N/A",
        createdAt ? new Date(createdAt).toLocaleString() : "N/A",
        ReferenceID,
      ]),
    ];

    // Escape commas and quotes properly
    const csvContent = csvRows
      .map((row) =>
        row
          .map((v) => `"${(v ?? "").toString().replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Wrapup_Data_${ReferenceID}.csv`;
    link.click();
  };

  return (
    <>
      <div className="w-full">
        <div className="bg-white w-full h-full p-4">
          {loading ? (
            <div className="flex justify-center items-center h-full w-full">
              <RiRefreshLine size={30} className="animate-spin" />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-left text-sm font-semibold">Wrap-up</h3>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1 border mb-2 bg-white text-black text-xs px-4 py-2 shadow-sm rounded hover:bg-orange-500 hover:text-white transition"
                >
                  <CiExport size={16} /> Export CSV
                </button>
              </div>
              <div className="w-full h-full overflow-x-auto">
                <div className="flex items-end h-full space-x-4 sm:h-[400px] w-full">
                  {wrapupLabels.map((label, index) => {
                    const value = grouped[label] || 0;
                    const heightPercent = (value / maxValue) * 100;

                    return (
                      <button
                        key={label}
                        onClick={() => setSelectedWrapup(label)}
                        className="flex flex-col items-center h-full group focus:outline-none"
                        aria-label={`Show details for ${label} (${value})`}
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
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedWrapup && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wrapup-modal-title"
          onClick={() => setSelectedWrapup(null)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[70vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h4
                id="wrapup-modal-title"
                className="font-semibold text-lg"
              >
                Details for {selectedWrapup}
              </h4>
              <button
                onClick={() => setSelectedWrapup(null)}
                className="text-red-500 hover:underline focus:outline-none"
                aria-label="Close modal"
              >
                Close
              </button>
            </div>
            {modalData.length === 0 ? (
              <p className="text-center text-gray-500 text-xs">No records found.</p>
            ) : (
              <ul className="space-y-3 text-sm max-h-[50vh] overflow-y-auto">
                {modalData.map((item, i) => (
                  <li key={i} className="border-b pb-2">
                    {item.CompanyName && (
                      <div>
                        <strong>Company Name:</strong> {item.CompanyName}
                      </div>
                    )}
                    <div>
                      <strong>WrapUp:</strong> {item.WrapUp || "N/A"}
                    </div>
                    <div>
                      <strong>Date:</strong>{" "}
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : "N/A"}
                    </div>
                    <div>
                      <strong>ReferenceID:</strong> {item.ReferenceID}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Wrapup;
