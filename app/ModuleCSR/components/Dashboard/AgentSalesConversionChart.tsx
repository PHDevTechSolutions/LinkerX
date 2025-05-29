"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { RiRefreshLine } from "react-icons/ri";

interface Metric {
  userName: string;
  ReferenceID: string;
  Traffic: string;
  Amount: number | string;
  QtySold: number | string;
  Status: string;
  createdAt: string;
  WrapUp?: string;
  Remarks: string;
}

interface AgentSalesConversionProps {
  ReferenceID: string;
  Role: string;
  startDate?: string;
  endDate?: string;
}

const AgentSalesConversion: React.FC<AgentSalesConversionProps> = ({
  ReferenceID,
  Role,
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

  const colorPalette = [
    "#3A7D44", "#27445D", "#71BBB2", "#578FCA", "#9966FF", "#FF9F40",
    "#C9CBCF", "#008080",
  ];

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/ModuleCSR/Dashboard/AgentSalesConversion?ReferenceID=${ReferenceID}&Role=${Role}`
      );
      if (!response.ok) throw new Error("Failed to fetch data");

      let data: Metric[] = await response.json();

      if (Role === "Staff") {
        data = data.filter(m => m.ReferenceID === ReferenceID);
      }

      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);

      const filtered = data.filter(({ createdAt }) => {
        const created = new Date(createdAt);
        return (!start || created >= start) && (!end || created <= end);
      });

      setMetrics(filtered);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  }, [ReferenceID, Role, startDate, endDate]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const groupedMetrics = useMemo(() => {
    return metrics.reduce((acc, metric) => {
      if (!acc[metric.ReferenceID]) acc[metric.ReferenceID] = [];
      acc[metric.ReferenceID].push(metric);
      return acc;
    }, {} as Record<string, Metric[]>);
  }, [metrics]);

  const calculateAgentTotals = useCallback((agentMetrics: Metric[]) => {
    return agentMetrics.reduce(
      (acc, metric) => {
        // ✅ Skip if Remarks is "PO Received"
        if (metric.Remarks?.toLowerCase() === "po received") return acc;

        const amount = typeof metric.Amount === "string"
          ? parseFloat(metric.Amount)
          : metric.Amount;

        acc.totalAmount += isNaN(amount) ? 0 : amount;
        return acc;
      },
      { totalAmount: 0 }
    );
  }, []);


  const agentLabels = useMemo(() => Object.keys(groupedMetrics), [groupedMetrics]);

  const maxAmount = useMemo(() => {
    return Math.max(
      ...agentLabels.map((refId) =>
        calculateAgentTotals(groupedMetrics[refId]).totalAmount
      ),
      1
    );
  }, [agentLabels, calculateAgentTotals, groupedMetrics]);

  return (
    <div className="overflow-x-auto w-full">
      {loading ? (
        <div className="flex justify-center items-center h-full w-full">
          <div className="w-30 h-30 flex justify-center items-center">
            <RiRefreshLine size={30} className="animate-spin" />
          </div>
        </div>
      ) : (
        <div className="w-full">
          <h2 className="text-sm font-semibold mb-4 text-left">Agent Sales Conversion</h2>

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
