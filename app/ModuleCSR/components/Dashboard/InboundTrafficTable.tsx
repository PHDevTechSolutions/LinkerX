import React, { useEffect, useState } from "react";

interface Metric {
  createdAt: string;
  Channel: string;
}

interface MetricTableProps {
  ReferenceID: string;
  Role: string;
}

const getWeekNumber = (dateString: string) => {
  const date = new Date(dateString);
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  return Math.ceil((date.getDate() + firstDayOfMonth.getDay()) / 7);
};

const MetricTable: React.FC<MetricTableProps> = ({ ReferenceID, Role }) => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const allChannels = [
    "Google Maps", "Website", "FB Main", "FB ES Home", "Viber", "Text Message", 
    "Instagram", "Voice Call", "Email", "Whatsapp", "Shopify"
  ];

  const fetchMetricsData = async (month: number, year: number) => {
    try {
        const response = await fetch(`/api/ModuleCSR/Dashboard/InboundTraffic?ReferenceID=${ReferenceID}&Role=${Role}&month=${month}&year=${year}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setMetrics(data);
    } catch (error) {
        console.error("Error fetching metrics:", error);
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    fetchMetricsData(selectedMonth, selectedYear);
}, [ReferenceID, Role, selectedMonth, selectedYear]);


  const calculateWeeklyCounts = () => {
    const weeklyCounts: Record<string, Record<string, number>> = {
      "Week 1": {},
      "Week 2": {},
      "Week 3": {},
      "Week 4": {},
    };

    metrics.forEach((metric) => {
      const weekNumber = getWeekNumber(metric.createdAt);
      if (weekNumber >= 1 && weekNumber <= 4) {
        const key = `${metric.Channel}`;
        if (!weeklyCounts[`Week ${weekNumber}`][key]) {
          weeklyCounts[`Week ${weekNumber}`][key] = 0;
        }
        weeklyCounts[`Week ${weekNumber}`][key]++;
      }
    });

    return weeklyCounts;
  };

  const weeklyCounts = calculateWeeklyCounts();

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="mb-4 flex gap-4">
        <div>
          <label htmlFor="month" className="block text-sm font-semibold">Month</label>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="border p-2 rounded"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="year" className="block text-sm font-semibold">Year</label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border p-2 rounded"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200 text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Channel</th>
              <th className="border p-2">Week 1</th>
              <th className="border p-2">Week 2</th>
              <th className="border p-2">Week 3</th>
              <th className="border p-2">Week 4</th>
            </tr>
          </thead>
          <tbody>
            {allChannels.map((channel) => (
              <tr key={channel} className="text-center border-t">
                <td className="border p-2">{channel}</td>
                <td className="border p-2">{weeklyCounts["Week 1"][channel] || 0}</td>
                <td className="border p-2">{weeklyCounts["Week 2"][channel] || 0}</td>
                <td className="border p-2">{weeklyCounts["Week 3"][channel] || 0}</td>
                <td className="border p-2">{weeklyCounts["Week 4"][channel] || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MetricTable;
