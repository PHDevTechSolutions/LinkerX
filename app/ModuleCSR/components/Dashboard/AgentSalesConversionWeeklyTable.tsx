import React, { useEffect, useState } from "react";

interface Metric {
  userName: string;
  ReferenceID: string;
  Traffic: string;
  Amount: any;
  QtySold: any;
  Status: string;
  createdAt: string;
}

interface AgentSalesConversionProps {
  ReferenceID: string;
  Role: string;
  month: number;
  year: number;
}

const AgentSalesConversion: React.FC<AgentSalesConversionProps> = ({
  ReferenceID,
  Role,
  month,
  year,
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
    "LR-CSR-849432": "Leroux Y Xchire",
    "MC-CSR-947264": "Capin, Mark Vincent",
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(
          `/api/ModuleCSR/Dashboard/AgentSalesConversion?ReferenceID=${ReferenceID}&Role=${Role}&month=${month}&year=${year}`
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();

        // ✅ Filter by month and year
        const filteredData = data.filter((item: Metric) => {
          const createdAtDate = new Date(item.createdAt);
          return (
            createdAtDate.getMonth() + 1 === month &&
            createdAtDate.getFullYear() === year
          );
        });

        setMetrics(filteredData);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [ReferenceID, Role, month, year]);

  // ✅ Group by ReferenceID
  const groupedMetrics: Record<string, Metric[]> = metrics.reduce(
    (acc, metric) => {
      if (!acc[metric.ReferenceID]) {
        acc[metric.ReferenceID] = [];
      }
      acc[metric.ReferenceID].push(metric);
      return acc;
    },
    {} as Record<string, Metric[]>
  );

  // ✅ Calculate totals per agent + Week-wise amount
  const calculateAgentTotals = (agentMetrics: Metric[]) => {
    const totals = agentMetrics.reduce(
      (acc, metric) => {
        const amount = parseFloat(metric.Amount) || 0;
        const qtySold = parseFloat(metric.QtySold) || 0;
        const isSale = metric.Traffic === "Sales";
        const isConverted = metric.Status === "Converted Into Sales";
        const createdAtDate = new Date(metric.createdAt);
        const day = createdAtDate.getDate();

        // ✅ Week-based amount
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

    return totals;
  };

  // ✅ Format amount with Peso sign
  const formatAmountWithPeso = (amount: any) => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      return "₱0.00";
    }
    return `₱${parsedAmount
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };

  return (
    <div className="overflow-x-auto max-h-screen overflow-y-auto">
      {loading ? (
        <p className="text-xs">Loading...</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300 shadow-md">
          <thead className="bg-gray-100 text-[10px] uppercase text-gray-700">
            <tr>
              <th className="border p-2">Agent Name</th>
              <th className="border p-2">Sales</th>
              <th className="border p-2">Non-Sales</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">QTY Sold</th>
              <th className="border p-2">Conversion to Sale</th>
              <th className="border p-2">Week 1</th>
              <th className="border p-2">Week 2</th>
              <th className="border p-2">Week 3</th>
              <th className="border p-2">Week 4</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(groupedMetrics).length > 0 ? (
              Object.keys(groupedMetrics).map((refId, index) => {
                const agentMetrics = groupedMetrics[refId];
                const totals = calculateAgentTotals(agentMetrics);

                return (
                  <tr key={index} className="text-center border-t text-[10px]">
                    <td className="border p-2 whitespace-nowrap">
                      {referenceIdToNameMap[refId] || "Unknown"}
                    </td>
                    <td className="border p-2">{totals.sales}</td>
                    <td className="border p-2">{totals.nonSales}</td>
                    <td className="border p-2">
                      {formatAmountWithPeso(totals.totalAmount)}
                    </td>
                    <td className="border p-2">{totals.totalQtySold}</td>
                    <td className="border p-2">{totals.totalConversionToSale}</td>
                    <td className="border p-2">
                      {formatAmountWithPeso(totals.week1)}
                    </td>
                    <td className="border p-2">
                      {formatAmountWithPeso(totals.week2)}
                    </td>
                    <td className="border p-2">
                      {formatAmountWithPeso(totals.week3)}
                    </td>
                    <td className="border p-2">
                      {formatAmountWithPeso(totals.week4)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10} className="p-2 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AgentSalesConversion;
