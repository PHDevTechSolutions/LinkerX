import React, { useEffect, useState } from "react";

interface Metric {
  userName: string;
  ReferenceID: string;
  Traffic: string;
  Amount: number | string;
  QtySold: number | string;
  Status: string;
  createdAt: string;
  WrapUp?: string;
}

interface AgentSalesConversionProps {
  ReferenceID: string;
  Role: string;
  month: number;
  year: number;
  startDate?: string;
  endDate?: string;
}

const AgentSalesConversion: React.FC<AgentSalesConversionProps> = ({
  ReferenceID,
  Role,
  month,
  year,
  startDate,
  endDate,
}) => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  const referenceIdToNameMap: Record<string, string> = {
    "MQ-CSR-170039": "Quinto, Myra",
    "LM-CSR-809795": "Miguel, Lester",
    "RP-CSR-451122": "Paje, Rikki",
    "SA-CSR-517304": "Almoite, Sharmaine",
    "AA-CSR-785895": "Arendain, Armando",
    "GL-CSR-586725": "Lumabao, Grace",
    "MD-CSR-152985": "Dungso, Mary Grace",
    "MC-CSR-947264": "Capin, Mark Vincent",
  };

  const wrapupLabels = [
    "Confirmed", "Paid", "PDC", "Gcash", "BDO", "BPI", "Metrobank",
  ];

  const colorPalette = [
    "#3A7D44", "#27445D", "#71BBB2", "#578FCA", "#9966FF", "#FF9F40",
    "#C9CBCF", "#008080",
  ];

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(
          `/api/ModuleCSR/Dashboard/AgentSalesConversion?ReferenceID=${ReferenceID}&Role=${Role}&month=${month}&year=${year}`
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
  
        // Filter by Role
        let filteredData = Role === "Staff"
          ? data.filter((item: Metric) => item.ReferenceID === ReferenceID)
          : data;
  
        // Date range filtering
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);
  
        const finalData = filteredData.filter((item: Metric) => {
          if (!item.createdAt) return false;
  
          const createdAt = new Date(item.createdAt);
          const matchesMonthYear =
            createdAt.getMonth() + 1 === month &&
            createdAt.getFullYear() === year;
  
          const inRange =
            (!start || createdAt >= start) &&
            (!end || createdAt <= end);
  
          return matchesMonthYear && inRange;
        });
  
        setMetrics(finalData);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMetrics();
  }, [ReferenceID, Role, month, year, startDate, endDate]);
  

  const groupedMetrics: Record<string, Metric[]> = metrics.reduce(
    (acc, metric) => {
      if (!acc[metric.ReferenceID]) acc[metric.ReferenceID] = [];
      acc[metric.ReferenceID].push(metric);
      return acc;
    },
    {} as Record<string, Metric[]>
  );

  const calculateAgentTotals = (agentMetrics: Metric[]) => {
    return agentMetrics.reduce(
      (acc, metric) => {
        const amount = parseFloat(metric.Amount as string) || 0;
        acc.totalAmount += amount;
        return acc;
      },
      { totalAmount: 0 }
    );
  };

  const agentLabels = Object.keys(groupedMetrics);
  const maxAmount = Math.max(
    ...agentLabels.map((refId) =>
      calculateAgentTotals(groupedMetrics[refId]).totalAmount
    ), 1
  );

  return (
    <div className="overflow-x-auto w-full">
      {loading ? (
        <p className="text-sm">Loading...</p>
      ) : (
        <div className="w-full">
          <h2 className="text-sm font-semibold mb-4">Agent Sales Conversion</h2>

          <div className="flex flex-col space-y-4">
            {agentLabels.map((refId, index) => {
              const totals = calculateAgentTotals(groupedMetrics[refId]);
              const widthPercent = (totals.totalAmount / maxAmount) * 100;

              return (
                <div key={refId} className="flex items-center space-x-2">
                  <span className="text-[10px] sm:text-xs font-medium w-32">
                    {referenceIdToNameMap[refId] || "Unknown"}
                  </span>
                  <div className="flex-1 bg-gray-200 h-6 rounded-md overflow-hidden">
                    <div
                      className="h-full text-[10px] text-white px-2 flex items-center justify-end font-semibold transition-all duration-300"
                      style={{
                        width: `${widthPercent}%`,
                        backgroundColor: colorPalette[index % colorPalette.length],
                      }}
                    >
                      ₱{totals.totalAmount.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentSalesConversion;
