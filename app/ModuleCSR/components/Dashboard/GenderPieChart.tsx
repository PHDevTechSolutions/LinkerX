import React, { useEffect, useState } from "react";

interface GenderCount {
  Gender: string | null;
  createdAt: string | null;
  ReferenceID: string;
}

interface GenderBarChartProps {
  ReferenceID: string;
  Role: string;
  month: number;
  year: number;
  startDate?: string;
  endDate?: string;
}

const GenderBarChart: React.FC<GenderBarChartProps> = ({ReferenceID, Role, month, year, startDate, endDate}) => {
  const [genderData, setGenderData] = useState<GenderCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenderData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/ModuleCSR/Dashboard/Monitoring?ReferenceID=${ReferenceID}&Role=${Role}&month=${month}&year=${year}`
        );

        if (!res.ok) {
          console.error("Failed to fetch gender data:", res.statusText);
          return;
        }

        const data = await res.json();

        let filteredData = data;

        if (Role === "Staff") {
          filteredData = data.filter(
            (item: GenderCount) => item.ReferenceID === ReferenceID
          );
        }

        const finalData = filteredData.filter((item: GenderCount) => {
          if (!item.createdAt) return false;
          const date = new Date(item.createdAt);
          return (
            date.getMonth() + 1 === month &&
            date.getFullYear() === year &&
            (item.Gender === "Male" || item.Gender === "Female")
          );
        });

        setGenderData(finalData);
      } catch (error) {
        console.error("Error fetching gender data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenderData();
  }, [ReferenceID, Role, month, year, startDate, endDate]);

  // Count based on gender
  const maleCount = genderData.filter((item) => item.Gender === "Male").length;
  const femaleCount = genderData.filter((item) => item.Gender === "Female").length;
  const total = maleCount + femaleCount;

  return (
    <div className="w-full max-w-md mx-auto bg-white">
      <h3 className="text-sm font-bold mb-4 text-center">Inbound Traffic Per Gender</h3>

      {loading ? (
        <p className="text-center text-gray-500 text-xs">Loading...</p>
      ) : total === 0 ? (
        <p className="text-center text-gray-500 text-xs">No data available</p>
      ) : (
        <div className="space-y-4">
          {/* Male Count */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium text-blue-800">Male</span>
              <span className="text-xs text-gray-600">{maleCount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-800 h-4 rounded-full"
                style={{ width: `${(maleCount / total) * 100}%` }}
              />
            </div>
          </div>

          {/* Female Count */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium text-yellow-600">Female</span>
              <span className="text-xs text-gray-600">{femaleCount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-yellow-500 h-4 rounded-full"
                style={{ width: `${(femaleCount / total) * 100}%` }}
              />
            </div>
          </div>

          {/* Total Count */}
          <div className="text-center text-xs text-gray-700 mt-4">
            Total: <span className="font-semibold">{total}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenderBarChart;
