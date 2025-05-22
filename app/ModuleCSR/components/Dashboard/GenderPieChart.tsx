import React, { useEffect, useState, useMemo } from "react";
import { RiRefreshLine } from "react-icons/ri";

interface GenderCount {
  Gender: string | null;
  createdAt: string | null;
  ReferenceID: string;
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

  // Fetch data on component mount and relevant prop changes
  useEffect(() => {
    const fetchGenderData = async () => {
      setLoading(true);
      try {
        const url = `/api/ModuleCSR/Dashboard/Monitoring?ReferenceID=${ReferenceID}&Role=${Role}`;
        const res = await fetch(url);

        if (!res.ok) throw new Error("Failed to fetch metrics");

        let data: GenderCount[] = await res.json();

        // Filter based on Role if necessary
        if (Role === "Staff") {
          data = data.filter(item => item.ReferenceID === ReferenceID);
        }

        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        // Filter data by date range and gender condition
        const finalData = data.filter(item => {
          if (!item.createdAt) return false;
          const date = new Date(item.createdAt);

          const inDateRange = (!start || date >= start) && (!end || date <= end);
          const validGender = item.Gender === "Male" || item.Gender === "Female";

          return inDateRange && validGender;
        });

        setGenderData(finalData);
      } catch (error) {
        console.error("Error fetching gender data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenderData();
  }, [ReferenceID, Role, startDate, endDate]);


  // Memoize the gender counts for performance optimization
  const { maleCount, femaleCount, total } = useMemo(() => {
    const maleCount = genderData.filter((item) => item.Gender === "Male").length;
    const femaleCount = genderData.filter((item) => item.Gender === "Female").length;
    const total = maleCount + femaleCount;

    return { maleCount, femaleCount, total };
  }, [genderData]);

  return (
    <div className="w-full max-w-md mx-auto bg-white">
      <h3 className="text-sm font-bold mb-4 text-left">Inbound Traffic Per Gender</h3>

      {loading ? (
        <div className="flex justify-center items-center h-full w-full">
          <div className="flex justify-center items-center w-30 h-30">
            <RiRefreshLine size={30} className="animate-spin" />
          </div>
        </div>
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
