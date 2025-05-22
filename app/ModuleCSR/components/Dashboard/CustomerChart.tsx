"use client";
import React, { useEffect, useState, useMemo } from "react";
import { RiRefreshLine } from "react-icons/ri";
import { CiExport } from "react-icons/ci";
import { motion } from "framer-motion";

interface CustomerStatus {
  CustomerStatus: string | null;
  createdAt: string | null;
  ReferenceID: string;
  CustomerName?: string;
  CompanyName?: string;
}

interface CustomerChartProps {
  ReferenceID: string;
  Role: string;
  startDate?: string;
  endDate?: string;
}

const VALID_STATUSES = [
  "New Client",
  "Existing Active",
  "New Non-Buying",
  "Existing Inactive",
];

const colorMap: { [key: string]: string } = {
  "New Client": "bg-blue-600",
  "Existing Active": "bg-green-600",
  "New Non-Buying": "bg-yellow-500",
  "Existing Inactive": "bg-red-600",
  Unknown: "bg-gray-500",
};

const CustomerChart: React.FC<CustomerChartProps> = ({
  ReferenceID,
  Role,
  startDate = "",
  endDate = "",
}) => {
  const [customerData, setCustomerData] = useState<CustomerStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      setLoading(true);
      try {
        const url = new URL("/api/ModuleCSR/Dashboard/Customer", window.location.origin);
        url.searchParams.append("ReferenceID", ReferenceID);
        url.searchParams.append("Role", Role);
        if (startDate) url.searchParams.append("startDate", startDate);
        if (endDate) url.searchParams.append("endDate", endDate);

        const res = await fetch(url.toString());
        if (!res.ok) {
          console.error("Failed to fetch customer data:", res.statusText);
          setCustomerData([]);
          return;
        }

        let data: CustomerStatus[] = await res.json();

        if (Role === "Staff") {
          data = data.filter((m) => m.ReferenceID === ReferenceID);
        }

        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        const filtered = data.filter(({ createdAt, CustomerStatus }) => {
          if (!createdAt || !CustomerStatus) return false;
          const created = new Date(createdAt);
          const inDateRange = (!start || created >= start) && (!end || created <= end);
          const validStatus = VALID_STATUSES.includes(CustomerStatus);
          return inDateRange && validStatus;
        });

        setCustomerData(filtered);
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setCustomerData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [ReferenceID, Role, startDate, endDate]);

  // Calculate counts per status
  const statusCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    customerData.forEach((item) => {
      const status = item.CustomerStatus || "Unknown";
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }, [customerData]);

  const total = Object.values(statusCounts).reduce((sum, val) => sum + val, 0);

  // CSV export logic
  const handleExportCSV = () => {
    const csvRows = [
      ["Customer Status", "Created At", "Customer Name", "Company Name"],
      ...customerData.map(({ CustomerStatus, createdAt, CustomerName, CompanyName }) => [
        CustomerStatus || "N/A",
        createdAt ? new Date(createdAt).toLocaleString() : "N/A",
        CustomerName || "N/A",
        CompanyName || "N/A",
      ]),
    ];

    const blob = new Blob([csvRows.map(row => row.join(",")).join("\n")], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Customer_Status_Data.csv";
    link.click();
  };

  const filteredDataByStatus = (status: string) =>
    customerData.filter(item => item.CustomerStatus === status);

  if (!loading && total === 0) {
    return (
      <div className="w-full max-w-md mx-auto bg-white p-4 rounded shadow text-center text-gray-600">
        No customer status data available for the selected range.
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold">Customer Status Distribution</h3>
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
          {Object.entries(statusCounts).map(([status, count]) => {
            const widthPercent = total ? (count / total) * 100 : 0;
            const colorClass = colorMap[status] || "bg-gray-400";

            return (
              <div
                key={status}
                className="cursor-pointer"
                onClick={() => setSelectedStatus(status)}
                aria-label={`Show details for status: ${status}`}
              >
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium">{status}</span>
                  <span className="text-xs text-gray-600">
                    {count} ({widthPercent.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-5">
                  <motion.div
                    className={`${colorClass} h-5 rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPercent}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <span className="sr-only">{`${status} percentage bar`}</span>
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

      {/* Modal for selected status details */}
      {selectedStatus && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="status-modal-title"
          onClick={() => setSelectedStatus(null)}
        >
          <div
            className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full max-h-[70vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h4 id="status-modal-title" className="font-semibold text-lg">
                Details for {selectedStatus}
              </h4>
              <button
                onClick={() => setSelectedStatus(null)}
                className="text-red-500 hover:underline"
                aria-label="Close modal"
              >
                Close
              </button>
            </div>
            <ul className="space-y-2 text-sm">
              {filteredDataByStatus(selectedStatus).map((item, i) => (
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

export default CustomerChart;
