import React, { useEffect, useState, useMemo, useCallback } from "react";
import { RiRefreshLine } from "react-icons/ri";

interface Metric {
  userName: string;
  ReferenceID: string;
  Traffic: string;
  Amount: any;
  QtySold: any;
  Status: string;
  createdAt: string;
  Remarks?: string; // <- add this line
}

interface AgentSalesConversionProps {
  ReferenceID: string;
  Role: string;
  startDate?: string;
  endDate?: string;
}

const AgentSalesConversion: React.FC<AgentSalesConversionProps> = ({ ReferenceID, Role, startDate, endDate }) => {
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

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/ModuleCSR/Dashboard/AgentSalesConversion?ReferenceID=${ReferenceID}&Role=${Role}`
        );
        if (!response.ok) throw new Error("Failed to fetch data");

        let data: Metric[] = await response.json();

        if (Role === "Staff") {
          data = data.filter((m) => m.ReferenceID === ReferenceID);
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
    };

    fetchMetrics();
  }, [ReferenceID, Role, startDate, endDate]);


  // ✅ Group by ReferenceID
  const groupedMetrics = useMemo(
    () =>
      metrics.reduce((acc, metric) => {
        if (!acc[metric.ReferenceID]) {
          acc[metric.ReferenceID] = [];
        }
        acc[metric.ReferenceID].push(metric);
        return acc;
      }, {} as Record<string, Metric[]>),
    [metrics]
  );

  // ✅ Calculate totals per agent
  const calculateAgentTotals = useCallback((agentMetrics: Metric[]) => {
    return agentMetrics.reduce(
      (acc, metric) => {
        // ❌ Skip if remarks is "PO Received"
        if (metric.Remarks?.toLowerCase() === "po received") return acc;

        const amount = parseFloat(metric.Amount) || 0;
        const qtySold = parseFloat(metric.QtySold) || 0;
        const isSale = metric.Traffic === "Sales";
        const isConverted = metric.Status === "Converted Into Sales";
        const createdAtDate = new Date(metric.createdAt);
        const day = createdAtDate.getDate();

        if (day >= 1 && day <= 7) acc.week1 += amount;
        else if (day >= 8 && day <= 14) acc.week2 += amount;
        else if (day >= 15 && day <= 21) acc.week3 += amount;
        else acc.week4 += amount;

        acc.sales += isSale ? 1 : 0;
        acc.nonSales += !isSale ? 1 : 0;
        acc.totalAmount += amount;
        acc.totalQtySold += qtySold;
        acc.totalConversionToSale += isConverted ? 1 : 0;

        return acc;
      },
      {
        sales: 0,
        nonSales: 0,
        totalAmount: 0,
        totalQtySold: 0,
        totalConversionToSale: 0,
        week1: 0,
        week2: 0,
        week3: 0,
        week4: 0,
      }
    );
  }, []);


  // ✅ Format amount with Peso sign
  const formatAmountWithPeso = useCallback((amount: any) => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      return "₱0.00";
    }
    return `₱${parsedAmount
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  }, []);

  // ✅ Calculate total for all agents
  const calculateTotalMetrics = () => {
    return Object.keys(groupedMetrics).reduce(
      (totals, refId) => {
        const agentMetrics = groupedMetrics[refId];
        const agentTotals = calculateAgentTotals(agentMetrics);
        totals.sales += agentTotals.sales;
        totals.nonSales += agentTotals.nonSales;
        totals.totalAmount += agentTotals.totalAmount;
        totals.totalQtySold += agentTotals.totalQtySold;
        totals.totalConversionToSale += agentTotals.totalConversionToSale;
        totals.week1 += agentTotals.week1;
        totals.week2 += agentTotals.week2;
        totals.week3 += agentTotals.week3;
        totals.week4 += agentTotals.week4;

        return totals;
      },
      {
        sales: 0,
        nonSales: 0,
        totalAmount: 0,
        totalQtySold: 0,
        totalConversionToSale: 0,
        week1: 0,
        week2: 0,
        week3: 0,
        week4: 0,
      }
    );
  };

  const totalMetrics = calculateTotalMetrics();

  return (
    <div className="overflow-x-auto max-h-screen overflow-y-auto">
      {loading ? (
        <div className="flex justify-center items-center h-full w-full">
          <div className="flex justify-center items-center w-30 h-30">
            <RiRefreshLine size={30} className="animate-spin" />
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-sm font-semibold mb-4 text-left">Agent Sales Weekly</h2>
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr className="text-xs text-left whitespace-nowrap border-l-4 border-emerald-400">
                <th className="px-6 py-4 font-semibold text-gray-700">Agent Name</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Sales</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Non-Sales</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-4 font-semibold text-gray-700">QTY Sold</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Conversion to Sale</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Week 1</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Week 2</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Week 3</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Week 4</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.keys(groupedMetrics).length > 0 ? (
                Object.keys(groupedMetrics).map((refId, index) => {
                  const agentMetrics = groupedMetrics[refId];
                  const totals = calculateAgentTotals(agentMetrics);

                  return (
                    <tr key={index} className="border-b whitespace-nowrap">
                      <td className="px-6 py-4 text-xs whitespace-nowrap capitalize">
                        {referenceIdToNameMap[refId] || "-"}
                      </td>
                      <td className="px-6 py-4 text-xs">{totals.sales}</td>
                      <td className="px-6 py-4 text-xs">{totals.nonSales}</td>
                      <td className="px-6 py-4 text-xs">
                        {formatAmountWithPeso(totals.totalAmount)}
                      </td>
                      <td className="px-6 py-4 text-xs">{totals.totalQtySold}</td>
                      <td className="px-6 py-4 text-xs">{totals.totalConversionToSale}</td>
                      <td className="px-6 py-4 text-xs">
                        {formatAmountWithPeso(totals.week1)}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {formatAmountWithPeso(totals.week2)}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {formatAmountWithPeso(totals.week3)}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {formatAmountWithPeso(totals.week4)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="p-2 text-center text-gray-500 text-xs">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
            {/* Add tfoot for totals */}
            <tfoot className="bg-gray-100 px-6 py-4 text-xs text-left font-bold">
              <tr>
                <td className="px-6 py-4 text-xs">Total</td>
                <td className="px-6 py-4 text-xs">{totalMetrics.sales}</td>
                <td className="px-6 py-4 text-xs">{totalMetrics.nonSales}</td>
                <td className="px-6 py-4 text-xs">
                  {formatAmountWithPeso(totalMetrics.totalAmount)}
                </td>
                <td className="px-6 py-4 text-xs">{totalMetrics.totalQtySold}</td>
                <td className="px-6 py-4 text-xs">{totalMetrics.totalConversionToSale}</td>
                <td className="px-6 py-4 text-xs">
                  {formatAmountWithPeso(totalMetrics.week1)}
                </td>
                <td className="px-6 py-4 text-xs">
                  {formatAmountWithPeso(totalMetrics.week2)}
                </td>
                <td className="px-6 py-4 text-xs">
                  {formatAmountWithPeso(totalMetrics.week3)}
                </td>
                <td className="px-6 py-4 text-xs">
                  {formatAmountWithPeso(totalMetrics.week4)}
                </td>
              </tr>
            </tfoot>
          </table>
        </>
      )}
    </div>
  );
};

export default AgentSalesConversion;
