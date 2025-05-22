"use client";
import React, { useEffect, useState, useMemo } from "react";
import { RiRefreshLine } from "react-icons/ri";

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

const CustomerTypeChart: React.FC<CustomerTypeChartProps> = ({
  ReferenceID,
  Role,
  startDate = "",
  endDate = "",
}) => {
  const [customerTypeData, setCustomerTypeData] = useState<CustomerType[]>([]);
  const [loading, setLoading] = useState(true);

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

      // Filter by ReferenceID if Role is Staff
      if (Role === "Staff") {
        data = data.filter(m => m.ReferenceID === ReferenceID);
      }

      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);

      // Filter by createdAt date range
      const filtered = data.filter(({ createdAt }) => {
        if (!createdAt) return false;
        const created = new Date(createdAt);
        return (!start || created >= start) && (!end || created <= end);
      });

      // Filter valid CustomerType values
      const validTypes = ["B2B", "B2C", "B2G", "Gentrade", "Modern Trade"];
      const final = filtered.filter(
        item => item.CustomerType && validTypes.includes(item.CustomerType)
      );

      setCustomerTypeData(final);
    } catch (error) {
      console.error("Error fetching customer type data:", error);
      setCustomerTypeData([]);
    } finally {
      setLoading(false);
    }
  };

  fetchCustomerTypeData();
}, [ReferenceID, Role, startDate, endDate]);


  // Memoized calculation of type counts
  const typeCounts = useMemo(() => {
    return customerTypeData.reduce((acc, item) => {
      const type = item.CustomerType || "Unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  }, [customerTypeData]);

  // Calculate total
  const total = useMemo(() => Object.values(typeCounts).reduce((sum, val) => sum + val, 0), [typeCounts]);

  const colorMap: { [key: string]: string } = {
    "B2B": "bg-blue-600",
    "B2C": "bg-green-600",
    "B2G": "bg-yellow-500",
    "Gentrade": "bg-red-600",
    "Modern Trade": "bg-purple-600",
    "Unknown": "bg-gray-500",
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white">
      <h3 className="text-sm font-bold mb-4 text-left">Inbound Traffic Per Customer Type</h3>

      {loading ? (
        <div className="flex justify-center items-center h-full w-full">
          <div className="flex justify-center items-center w-30 h-30">
            <RiRefreshLine size={30} className="animate-spin" />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(typeCounts).map(([type, count]) => (
            <div key={type}>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-medium">{type}</span>
                <span className="text-xs text-gray-600">{count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${colorMap[type] || "bg-gray-400"}`}
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

export default CustomerTypeChart;
