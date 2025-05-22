"use client";
import React, { useEffect, useState, useMemo } from "react";
import { RiRefreshLine } from "react-icons/ri";
import { CiExport } from "react-icons/ci";
import { motion } from "framer-motion";

interface GenderCount {
  Gender: string | null;
  createdAt: string | null;
  ReferenceID: string;
  CustomerName?: string;
  CompanyName?: string;
}

interface GenderBarChartProps {
  ReferenceID: string;
  Role: string;
  startDate?: string;
  endDate?: string;
}

const GenderBarChart: React.FC<GenderBarChartProps> = ({ ReferenceID, Role, startDate, endDate }) => {
  const [genderData, setGenderData] = useState<GenderCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenderData = async () => {
      setLoading(true);
      try {
        const url = `/api/ModuleCSR/Dashboard/Monitoring?ReferenceID=${ReferenceID}&Role=${Role}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch gender data");

        let data: GenderCount[] = await res.json();

        if (Role === "Staff") {
          data = data.filter(item => item.ReferenceID === ReferenceID);
        }

        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        const filtered = data.filter(item => {
          if (!item.createdAt) return false;
          const date = new Date(item.createdAt);
          const inRange = (!start || date >= start) && (!end || date <= end);
          return inRange && (item.Gender === "Male" || item.Gender === "Female");
        });

        setGenderData(filtered);
      } catch (error) {
        console.error("Error fetching gender data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGenderData();
  }, [ReferenceID, Role, startDate, endDate]);

  const { maleCount, femaleCount, total } = useMemo(() => {
    const maleCount = genderData.filter(item => item.Gender === "Male").length;
    const femaleCount = genderData.filter(item => item.Gender === "Female").length;
    return { maleCount, femaleCount, total: maleCount + femaleCount };
  }, [genderData]);

  const handleExportCSV = () => {
    const csvRows = [
      ["Gender", "Created At", "Customer Name", "Company Name"],
      ...genderData.map(({ Gender, createdAt, CustomerName, CompanyName }) => [
        Gender || "N/A",
        createdAt ? new Date(createdAt).toLocaleString() : "N/A",
        CustomerName || "N/A",
        CompanyName || "N/A",
      ]),
    ];

    const blob = new Blob([csvRows.map(row => row.join(",")).join("\n")], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Gender_Data.csv";
    link.click();
  };

  const filteredDataByGender = (gender: string) =>
    genderData.filter(item => item.Gender === gender);

  if (!loading && total === 0) {
    return (
      <div className="w-full max-w-md mx-auto bg-white p-4 rounded shadow text-center text-gray-600">
        No gender data available for the selected range.
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold">Inbound Traffic Per Gender</h3>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1 border mb-2 bg-white text-black text-xs px-4 py-2 shadow-sm rounded hover:bg-orange-500 hover:text-white transition"
        >
          <CiExport size={16} /> Export CSV
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-24">
          <RiRefreshLine size={30} className="animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {["Male", "Female"].map((gender, idx) => {
            const count = gender === "Male" ? maleCount : femaleCount;
            const widthPercent = total ? (count / total) * 100 : 0;

            return (
              <div key={gender} className="cursor-pointer" onClick={() => setSelectedGender(gender)} aria-label={`Show details for ${gender}`}>
                <div className="flex justify-between mb-1">
                  <span className={`text-xs font-medium ${gender === "Male" ? "text-blue-800" : "text-yellow-600"}`}>
                    {gender}
                  </span>
                  <span className="text-xs text-gray-600">{count} ({widthPercent.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-5">
                  <motion.div
                    className={`${gender === "Male" ? "bg-blue-800" : "bg-yellow-500"} h-5 rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPercent}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <span className="sr-only">{`${gender} percentage bar`}</span>
                  </motion.div>
                </div>
              </div>
            );
          })}

          <div className="text-center text-xs text-gray-700 mt-4">
            Total: <span className="font-semibold">{total}</span>
          </div>
        </div>
      )}

      {/* Modal for selected gender details */}
      {selectedGender && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gender-modal-title"
          onClick={() => setSelectedGender(null)}
        >
          <div
            className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full max-h-[70vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h4 id="gender-modal-title" className="font-semibold text-lg">
                Details for {selectedGender}
              </h4>
              <button
                onClick={() => setSelectedGender(null)}
                className="text-red-500 hover:underline"
                aria-label="Close modal"
              >
                Close
              </button>
            </div>
            <ul className="space-y-2 text-sm">
              {filteredDataByGender(selectedGender).map((item, i) => (
                <li key={i} className="border-b pb-2">
                  <div><strong>Company:</strong> {item.CompanyName || "N/A"}</div>
                  <div><strong>Customer:</strong> {item.CustomerName || "N/A"}</div>
                  <div><strong>Date:</strong> {item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A"}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenderBarChart;
