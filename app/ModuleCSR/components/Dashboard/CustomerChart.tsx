"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { RiRefreshLine } from "react-icons/ri";

interface CustomerStatus {
  CustomerStatus: string | null;
  createdAt: string | null;
  ReferenceID: string;
}

interface CustomerChartProps {
  ReferenceID: string;
  Role: string;
  month: number;
  year: number;
  startDate?: string;
  endDate?: string;
}

const CustomerChart: React.FC<CustomerChartProps> = ({
  ReferenceID,
  Role,
  month,
  year,
  startDate = "",  // Default empty string if not provided
  endDate = "",    // Default empty string if not provided
}) => {
  const [customerData, setCustomerData] = useState<CustomerStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const calculateDateRange = useCallback(() => {
    const start = `${year}-${String(month).padStart(2, "0")}-01`;
    const end = new Date(year, month, 0).toISOString().split("T")[0];
    return { startDate: start, endDate: end };
  }, [month, year]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      setLoading(true);
      const { startDate, endDate } = calculateDateRange();

      try {
        const res = await fetch(
          `/api/ModuleCSR/Dashboard/Customer?ReferenceID=${ReferenceID}&Role=${Role}&startDate=${startDate}&endDate=${endDate}`
        );

        if (!res.ok) {
          console.error("Failed to fetch customer data:", res.statusText);
          return;
        }

        const data = await res.json();

        let filtered = data;
        if (Role === "Staff") {
          filtered = data.filter((item: CustomerStatus) => item.ReferenceID === ReferenceID);
        }

        const final = filtered.filter((item: CustomerStatus) => {
          if (!item.createdAt) return false;
          const createdAtDate = new Date(item.createdAt);
          return (
            createdAtDate.getMonth() + 1 === month &&
            createdAtDate.getFullYear() === year &&
            item.CustomerStatus &&
            [
              "New Client",
              "Existing Active",
              "New Non-Buying",
              "Existing Inactive",
            ].includes(item.CustomerStatus)
          );
        });

        setCustomerData(final);
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setCustomerData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [ReferenceID, Role, month, year, calculateDateRange]);

  // Memoize status counts calculation to avoid recalculating on every render
  const statusCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    customerData.forEach((item) => {
      const status = item.CustomerStatus || "Unknown";
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }, [customerData]);

  const total = Object.values(statusCounts).reduce((sum, val) => sum + val, 0);

  const colorMap: { [key: string]: string } = {
    "New Client": "bg-blue-600",
    "Existing Active": "bg-green-600",
    "New Non-Buying": "bg-yellow-500",
    "Existing Inactive": "bg-red-600",
    "Unknown": "bg-gray-500",
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white">
      <h3 className="text-sm font-bold mb-4 text-center">Customer Status Distribution</h3>

      {loading ? (
        <div className="flex justify-center items-center h-full w-full">
          <div className="flex justify-center items-center w-30 h-30">
            <RiRefreshLine size={30} className="animate-spin" />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status}>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-medium">{status}</span>
                <span className="text-xs text-gray-600">{count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${colorMap[status] || "bg-gray-400"}`}
                  style={{ width: `${(count / total) * 100}%` }}
                />
              </div>
            </div>
          ))}
          <div className="text-center text-xs text-gray-700 mt-4">
            Total: <span className="font-semibold">{total}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerChart;
