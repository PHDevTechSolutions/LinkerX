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
  CustomerStatus: string;
  TicketEndorsed: string;
  TicketReceived: string;
  Remarks: string;
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
    "LR-CSR-654001": "LX",
    "MC-CSR-947264": "Capin, Mark Vincent",
  };

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ModuleCSR/Dashboard/AgentSalesConversion?ReferenceID=${ReferenceID}&Role=${Role}`);
      if (!res.ok) throw new Error("Failed to fetch data");

      let data = await res.json();

      if (Role === "Staff") {
        data = data.filter((m: Metric) => m.ReferenceID === ReferenceID);
      }

      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);

      const filtered = data.filter(({ createdAt }: Metric) => {
        const created = new Date(createdAt);
        return (!start || created >= start) && (!end || created <= end);
      });

      setMetrics(filtered);
    } catch (err) {
      console.error("Error fetching metrics:", err);
    } finally {
      setLoading(false);
    }
  }, [ReferenceID, Role, startDate, endDate]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // ✅ Group by ReferenceID
  const groupedMetrics: Record<string, Metric[]> = useMemo(() => {
    return metrics.reduce((acc, metric) => {
      if (!acc[metric.ReferenceID]) {
        acc[metric.ReferenceID] = [];
      }
      acc[metric.ReferenceID].push(metric);
      return acc;
    }, {} as Record<string, Metric[]>);
  }, [metrics]);

  // ✅ Calculate totals per agent
  const calculateAgentTotals = useCallback((agentMetrics: Metric[]) => {
    return agentMetrics.reduce(
      (acc, metric) => {
        // ✅ Skip computation if Remarks is "PO Received"
        if (metric.Remarks?.toLowerCase() === "po received") return acc;

        const amount = parseFloat(metric.Amount) || 0;
        const qtySold = parseFloat(metric.QtySold) || 0;
        const isSale = metric.Traffic === "Sales";
        const isConverted = metric.Status === "Converted Into Sales";

        acc.sales += isSale ? 1 : 0;
        acc.nonSales += !isSale ? 1 : 0;
        acc.totalAmount += amount;
        acc.totalQtySold += qtySold;
        acc.totalConversionToSale += isConverted ? 1 : 0;

        // Add customer status totals
        switch (metric.CustomerStatus) {
          case "New Client":
            acc.newClientAmount += amount;
            break;
          case "New Non-Buying":
            acc.newNonBuyingAmount += amount;
            break;
          case "Existing Active":
            acc.existingActiveAmount += amount;
            break;
          case "Existing Inactive":
            acc.existingInactiveAmount += amount;
            break;
          default:
            break;
        }

        return acc;
      },
      {
        sales: 0,
        nonSales: 0,
        totalAmount: 0,
        totalQtySold: 0,
        totalConversionToSale: 0,
        newClientAmount: 0,
        newNonBuyingAmount: 0,
        existingActiveAmount: 0,
        existingInactiveAmount: 0,
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

  // ✅ Calculate overall totals for tfoot
  const totalMetrics = useMemo(() => {
    return Object.values(groupedMetrics).reduce(
      (acc, agentMetrics) => {
        const totals = calculateAgentTotals(agentMetrics);

        acc.sales += totals.sales;
        acc.nonSales += totals.nonSales;
        acc.totalAmount += totals.totalAmount;
        acc.totalQtySold += totals.totalQtySold;
        acc.totalConversionToSale += totals.totalConversionToSale;
        acc.newClientAmount += totals.newClientAmount;
        acc.newNonBuyingAmount += totals.newNonBuyingAmount;
        acc.existingActiveAmount += totals.existingActiveAmount;

        acc.totalATU += totals.totalConversionToSale > 0
          ? totals.totalQtySold / totals.totalConversionToSale
          : 0;
        acc.totalATV += totals.totalConversionToSale > 0
          ? totals.totalAmount / totals.totalConversionToSale
          : 0;

        acc.totalConversionPercentage += totals.sales > 0
          ? (totals.totalConversionToSale / totals.sales) * 100
          : 0;

        acc.agentCount += 1;
        return acc;
      },
      {
        sales: 0,
        nonSales: 0,
        totalAmount: 0,
        totalQtySold: 0,
        totalConversionToSale: 0,
        newClientAmount: 0,
        newNonBuyingAmount: 0,
        existingActiveAmount: 0,
        existingInactiveAmount: 0,
        totalATU: 0,
        totalATV: 0,
        totalConversionPercentage: 0,
        agentCount: 0,
      }
    );
  }, [groupedMetrics, calculateAgentTotals]);

  // ✅ Final Averages for % Conversion, ATU, and ATV
  const avgConversionPercentage = totalMetrics.sales === 0
    ? "0.00"
    : (totalMetrics.totalConversionToSale / totalMetrics.sales).toFixed(2);

  const avgATU =
    totalMetrics.totalConversionToSale === 0
      ? "0.00%"
      : `${((totalMetrics.totalQtySold / totalMetrics.totalConversionToSale) * 100).toFixed(2)}%`;

  const avgATV =
    totalMetrics.totalConversionToSale === 0
      ? "0.00"
      : formatAmountWithPeso(totalMetrics.totalAmount / totalMetrics.totalConversionToSale);


  const calculateResponseTime = useCallback((TicketReceived: string, TicketEndorsed: string) => {
    if (!TicketReceived || !TicketEndorsed) return "N/A";

    const start = new Date(TicketReceived);
    const end = new Date(TicketEndorsed);

    const diffInSeconds = (end.getTime() - start.getTime()) / 1000;
    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = Math.floor(diffInSeconds % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  }, []);

  const parseTimeToSeconds = (timeStr: string) => {
    const match = timeStr.match(/(\d+)h\s+(\d+)m\s+(\d+)s/);
    if (!match) return 0;
    const [, h, m, s] = match.map(Number);
    return h * 3600 + m * 60 + s;
  };

  const formatSecondsToTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const totalCSRSeconds = Object.keys(groupedMetrics).reduce((acc, refId) => {
    const agentMetrics = groupedMetrics[refId];
    if (!agentMetrics.length) return acc;

    const responseTime = calculateResponseTime(
      agentMetrics[0].TicketReceived,
      agentMetrics[0].TicketEndorsed
    );

    return acc + parseTimeToSeconds(responseTime);
  }, 0);

  const totalCSRTimeFormatted = formatSecondsToTime(totalCSRSeconds);


  // ✅ Final Averages for % Conversion, ATU, and ATV
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
          <h2 className="text-sm font-semibold mb-4 text-left">Agent Sales Table</h2>
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr className="text-xs text-left whitespace-nowrap border-l-4 border-emerald-400">
                <th className="px-6 py-4 font-semibold text-gray-700">Agent Name</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Sales</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Non-Sales</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-4 font-semibold text-gray-700">QTY Sold</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Conversion to Sale</th>
                <th className="px-6 py-4 font-semibold text-gray-700">% Conversion Inquiry to Sales</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Avg Transaction Unit</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Avg Transaction Value</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Sales Per (New Client)</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Sales Per (New-Non Buying)</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Sales Per (Existing Active)</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Sales Per (Existing Inactive)</th>
                <th className="px-6 py-4 font-semibold text-gray-700">CSR Response Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.keys(groupedMetrics).length > 0 ? (
                Object.keys(groupedMetrics).map((refId, index) => {
                  const agentMetrics = groupedMetrics[refId];
                  const totals = calculateAgentTotals(agentMetrics);

                  // ✅ Calculate Conversion %
                  const conversionPercentage = totals.sales === 0
                    ? "0.00" : (totals.totalConversionToSale / totals.sales).toFixed(2);

                  // ✅ Calculate Avg Transaction Unit (ATU)
                  const avgTransactionUnit =
                    totals.totalConversionToSale === 0
                      ? "0.00%"
                      : `${((totals.totalQtySold / totals.totalConversionToSale) * 100).toFixed(2)}%`;

                  // ✅ Calculate Avg Transaction Value (ATV)
                  const avgTransactionValue =
                    totals.totalConversionToSale === 0
                      ? "0.00"
                      : formatAmountWithPeso(
                        totals.totalAmount / totals.totalConversionToSale
                      );

                  // ✅ Calculate CSR Response Time
                  const csrResponseTime =
                    agentMetrics.length > 0
                      ? calculateResponseTime(
                        agentMetrics[0].TicketReceived,
                        agentMetrics[0].TicketEndorsed
                      )
                      : "N/A";
                  return (
                    <tr key={index} className="border-b whitespace-nowrap">
                      <td className="px-6 py-4 text-xs">
                        {referenceIdToNameMap[refId] || "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-xs">{totals.sales}</td>
                      <td className="px-6 py-4 text-xs">{totals.nonSales}</td>
                      <td className="px-6 py-4 text-xs">
                        {formatAmountWithPeso(totals.totalAmount)}
                      </td>
                      <td className="px-6 py-4 text-xs">{totals.totalQtySold}</td>
                      <td className="px-6 py-4 text-xs">{totals.totalConversionToSale}</td>
                      <td className="px-6 py-4 text-xs">{conversionPercentage}</td>
                      <td className="px-6 py-4 text-xs">{avgTransactionUnit}</td>
                      <td className="px-6 py-4 text-xs">{avgTransactionValue}</td>
                      <td className="px-6 py-4 text-xs">{formatAmountWithPeso(totals.newClientAmount)}</td>
                      <td className="px-6 py-4 text-xs">{formatAmountWithPeso(totals.newNonBuyingAmount)}</td>
                      <td className="px-6 py-4 text-xs">{formatAmountWithPeso(totals.existingActiveAmount)}</td>
                      <td className="px-6 py-4 text-xs">{formatAmountWithPeso(totals.existingInactiveAmount)}</td>
                      <td className="px-6 py-4 text-xs">{csrResponseTime}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={13} className="p-2 text-center text-gray-500 text-xs">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>

            {/* ✅ TFOOT for Total Summary */}
            <tfoot className="bg-gray-100 px-6 py-4 text-xs text-left font-bold">
              <tr>
                <td className="px-6 py-4 text-xs">TOTAL</td>
                <td className="px-6 py-4 text-xs">{totalMetrics.sales}</td>
                <td className="px-6 py-4 text-xs">{totalMetrics.nonSales}</td>
                <td className="px-6 py-4 text-xs">{formatAmountWithPeso(totalMetrics.totalAmount)}</td>
                <td className="px-6 py-4 text-xs">{totalMetrics.totalQtySold}</td>
                <td className="px-6 py-4 text-xs">{totalMetrics.totalConversionToSale}</td>
                <td className="px-6 py-4 text-xs">{avgConversionPercentage}%</td>
                <td className="px-6 py-4 text-xs">{avgATU}</td>
                <td className="px-6 py-4 text-xs">
                  {totalMetrics.totalATV.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-6 py-4 text-xs">{formatAmountWithPeso(totalMetrics.newClientAmount)}</td>
                <td className="px-6 py-4 text-xs">{formatAmountWithPeso(totalMetrics.newNonBuyingAmount)}</td>
                <td className="px-6 py-4 text-xs">{formatAmountWithPeso(totalMetrics.existingActiveAmount)}</td>
                <td className="px-6 py-4 text-xs">{formatAmountWithPeso(totalMetrics.existingInactiveAmount)}</td>
                <td className="px-6 py-4 text-xs">{totalCSRTimeFormatted}</td>
              </tr>
            </tfoot>
          </table>
        </>
      )}
    </div>
  );
};

export default AgentSalesConversion;
