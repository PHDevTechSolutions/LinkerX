"use client";
import React, { useEffect, useState, useMemo } from "react";
import { RiRefreshLine } from "react-icons/ri";
import { CiExport } from "react-icons/ci";
import { motion } from "framer-motion";

interface CustomerType {
  CustomerType: string | null;
  createdAt: string | null;
  ReferenceID: string;
}

interface CustomerTypeChartProps {
  ReferenceID: string;
  Role: string;
  startDate?: string;
  endDate?: string;
}

const VALID_TYPES = ["B2B", "B2C", "B2G", "Gentrade", "Modern Trade"];

const CustomerTypeChart: React.FC<CustomerTypeChartProps> = ({
  ReferenceID,
  Role,
  startDate = "",
  endDate = "",
}) => {
  const [customerTypeData, setCustomerTypeData] = useState<CustomerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerTypeData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/ModuleCSR/Dashboard/CustomerType?ReferenceID=${ReferenceID}&Role=${Role}`
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch customer type data: ${res.statusText}`);
        }

        let data: CustomerType[] = await res.json();

        if (Role === "Staff") {
          data = data.filter((m) => m.ReferenceID === ReferenceID);
        }

        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        const filtered = data.filter(({ createdAt, CustomerType }) => {
          if (!createdAt || !CustomerType) return false;
          const created = new Date(createdAt);
          const inRange = (!start || created >= start) && (!end || created <= end);
          const validType = VALID_TYPES.includes(CustomerType);
          return inRange && validType;
        });

        setCustomerTypeData(filtered);
      } catch (error) {
        console.error("Error fetching customer type data:", error);
        setCustomerTypeData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerTypeData();
  }, [ReferenceID, Role, startDate, endDate]);

  const typeCounts = useMemo(() => {
    return customerTypeData.reduce((acc, item) => {
      const type = item.CustomerType || "Unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  }, [customerTypeData]);

  const total = useMemo(
    () => Object.values(typeCounts).reduce((sum, val) => sum + val, 0),
    [typeCounts]
  );

  const colorMap: { [key: string]: string } = {
    B2B: "bg-blue-600",
    B2C: "bg-green-600",
    B2G: "bg-yellow-500",
    Gentrade: "bg-red-600",
    "Modern Trade": "bg-purple-600",
    Unknown: "bg-gray-500",
  };

  const handleExportCSV = () => {
    const csvRows = [
      ["Customer Type", "Created At", "Reference ID"],
      ...customerTypeData.map(({ CustomerType, createdAt, ReferenceID }) => [
        CustomerType || "N/A",
        createdAt ? new Date(createdAt).toLocaleString() : "N/A",
        ReferenceID,
      ]),
    ];

    const blob = new Blob([csvRows.map((r) => r.join(",")).join("\n")], {
      type: "text/csv",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "CustomerType_Data.csv";
    link.click();
  };

  const filteredDataByType = (type: string) =>
    customerTypeData.filter((item) => item.CustomerType === type);

  if (!loading && total === 0) {
    return (
      <div className="w-full max-w-md mx-auto bg-white p-4 rounded shadow text-center text-gray-600">
        No customer type data available for the selected range.
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-left">Inbound Traffic Per Customer Type</h3>
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
          {Object.entries(typeCounts).map(([type, count]) => {
            const widthPercent = total ? (count / total) * 100 : 0;
            return (
              <div
                key={type}
                className="cursor-pointer"
                onClick={() => setSelectedType(type)}
                aria-label={`Show details for ${type}`}
              >
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium">{type}</span>
                  <span className="text-xs text-gray-600">
                    {count} ({widthPercent.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-5">
                  <motion.div
                    className={`${colorMap[type] || "bg-gray-400"} h-5 rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPercent}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <span className="sr-only">{`${type} percentage bar`}</span>
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

      {/* Modal for selected type details */}
      {selectedType && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="customer-type-modal-title"
          onClick={() => setSelectedType(null)}
        >
          <div
            className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full max-h-[70vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h4 id="customer-type-modal-title" className="font-semibold text-lg">
                Details for {selectedType}
              </h4>
              <button
                onClick={() => setSelectedType(null)}
                className="text-red-500 hover:underline"
                aria-label="Close modal"
              >
                Close
              </button>
            </div>
            <ul className="space-y-2 text-sm">
              {filteredDataByType(selectedType).map((item, i) => (
                <li key={i} className="border-b pb-2">
                  <div>
                    <strong>Customer Type:</strong> {item.CustomerType || "N/A"}
                  </div>
                  <div>
                    <strong>Date:</strong>{" "}
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A"}
                  </div>
                  <div>
                    <strong>Reference ID:</strong> {item.ReferenceID}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerTypeChart;
