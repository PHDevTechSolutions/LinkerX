"use client";
import React, { useEffect, useState } from "react";

interface CustomerType {
  CustomerType: string | null;
  createdAt: string | null;
  ReferenceID: string;
}

interface CustomerTypeChartProps {
  ReferenceID: string;
  Role: string;
  month: number;
  year: number;
  startDate?: string;
  endDate?: string;
}

const CustomerTypeChart: React.FC<CustomerTypeChartProps> = ({
  ReferenceID,
  Role,
  month,
  year,
  startDate = "",  // Default empty string if not provided
  endDate = "",    // Default empty string if not provided
}) => {
  const [customerTypeData, setCustomerTypeData] = useState<CustomerType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerTypeData = async () => {
      setLoading(true);
      try {
        // Construct start and end dates based on the provided year and month
        const startDateFormatted = `${year}-${String(month).padStart(2, "0")}-01`;
        const endDateFormatted = new Date(year, month, 0).toISOString().split("T")[0];

        const res = await fetch(
          `/api/ModuleCSR/Dashboard/CustomerType?ReferenceID=${ReferenceID}&Role=${Role}&startDate=${startDateFormatted}&endDate=${endDateFormatted}`
        );

        const data = await res.json();

        let filtered = data;
        if (Role === "Staff") {
          filtered = data.filter((item: CustomerType) => item.ReferenceID === ReferenceID);
        }

        const final = filtered.filter((item: CustomerType) => {
          if (!item.createdAt) return false;
          const createdAtDate = new Date(item.createdAt);
          return (
            createdAtDate.getMonth() + 1 === month &&
            createdAtDate.getFullYear() === year &&
            item.CustomerType &&
            [
              "B2B", "B2C", "B2G", "Gentrade", "Modern Trade",
            ].includes(item.CustomerType)
          );
        });

        setCustomerTypeData(final);
      } catch (error) {
        console.error("Error fetching customer type data:", error);
        setCustomerTypeData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerTypeData();
  }, [ReferenceID, Role, month, year, startDate, endDate]); 

  // Count by CustomerType
  const typeCounts: { [key: string]: number } = {};
  customerTypeData.forEach((item) => {
    const type = item.CustomerType || "Unknown";
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  const total = Object.values(typeCounts).reduce((sum, val) => sum + val, 0);

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
      <h3 className="text-sm font-bold mb-4 text-center">Inbound Traffic Per Customer Type</h3>

      {loading ? (
        <p className="text-center text-gray-500 text-xs">Loading...</p>
      ) : total === 0 ? (
        <p className="text-center text-gray-500 text-xs">No data available</p>
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
