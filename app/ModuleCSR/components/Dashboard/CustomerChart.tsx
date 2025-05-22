"use client";
import React, { useEffect, useState, useMemo } from "react";
import { RiRefreshLine } from "react-icons/ri";

interface CustomerStatus {
  CustomerStatus: string | null;
  createdAt: string | null;
  ReferenceID: string;
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

const CustomerChart: React.FC<CustomerChartProps> = ({
  ReferenceID,
  Role,
  startDate = "",
  endDate = "",
}) => {
  const [customerData, setCustomerData] = useState<CustomerStatus[]>([]);
  const [loading, setLoading] = useState(true);

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

        // Filter data by Role and ReferenceID if Role is Staff
        if (Role === "Staff") {
          data = data.filter((m) => m.ReferenceID === ReferenceID);
        }

        // Convert to dates for filtering
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        // Filter by createdAt date range and valid customer statuses
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

  const colorMap: { [key: string]: string } = {
    "New Client": "bg-blue-600",
    "Existing Active": "bg-green-600",
    "New Non-Buying": "bg-yellow-500",
    "Existing Inactive": "bg-red-600",
    Unknown: "bg-gray-500",
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white">
      <h3 className="text-sm font-bold mb-4 text-let">Customer Status Distribution</h3>

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
