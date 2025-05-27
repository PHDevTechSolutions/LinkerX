import React, { useEffect, useState, useMemo } from "react";
import { RiRefreshLine } from "react-icons/ri";

interface Metric {
  createdAt: string;
  Channel: string;
  Amount: string | number;
  QtySold: number;
  Status: string;
  Traffic: string;
  ReferenceID: string;
  Remarks?: string; // ✅ Added to handle filtering
}

interface MetricTableProps {
  ReferenceID: string;
  month?: number;
  year?: number;
  Role: string;
  startDate?: string;
  endDate?: string;
}

const channelsSet = new Set([
  "Google Maps",
  "Website",
  "FB Main",
  "FB ES Home",
  "Viber",
  "Text Message",
  "Instagram",
  "Voice Call",
  "Email",
  "Whatsapp",
  "Shopify",
]);

const MetricTable: React.FC<MetricTableProps> = ({ ReferenceID, month, year, Role, startDate, endDate }) => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const url = `/api/ModuleCSR/Dashboard/Metrics?ReferenceID=${ReferenceID}&Role=${Role}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch metrics");

        let data: Metric[] = await res.json();

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
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [ReferenceID, Role, startDate, endDate]);

  const { groupedArray, totalMetrics } = useMemo(() => {
    const grouped = new Map<string, any>();
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    let totalSales = 0, totalAmount = 0, totalQtySold = 0, totalConverted = 0, totalATV = 0, totalATU = 0, channelCount = 0;

    for (const m of metrics) {
      if (m.Remarks === "PO Received") continue; // ✅ Skip if PO Received

      const created = new Date(m.createdAt);
      if (
        (Role === "Staff" && m.ReferenceID !== ReferenceID) ||
        (month && year && (created.getMonth() + 1 !== month || created.getFullYear() !== year)) ||
        (start && end && (created < start || created > end))
      ) continue;

      if (!channelsSet.has(m.Channel)) continue;

      const amount = parseFloat(m.Amount as string) || 0;
      const qty = m.QtySold || 0;
      const isSale = m.Traffic === "Sales";
      const isConverted = m.Status === "Converted Into Sales";

      if (!grouped.has(m.Channel)) {
        grouped.set(m.Channel, {
          channel: m.Channel,
          traffic: 0,
          totalAmount: 0,
          totalQtySold: 0,
          sales: 0,
          totalConversionToSale: 0,
        });
        channelCount++;
      }

      const entry = grouped.get(m.Channel);
      entry.traffic += 1;
      entry.totalAmount += amount;
      entry.totalQtySold += qty;
      entry.sales += isSale ? 1 : 0;
      entry.totalConversionToSale += isConverted ? 1 : 0;

      grouped.set(m.Channel, entry);
    }

    const groupedArray = Array.from(grouped.values()).map(group => {
      const ATU = group.totalConversionToSale ? group.totalQtySold / group.totalConversionToSale : 0;
      const ATV = group.totalConversionToSale ? group.totalAmount / group.totalConversionToSale : 0;
      totalSales += group.sales;
      totalAmount += group.totalAmount;
      totalQtySold += group.totalQtySold;
      totalConverted += group.totalConversionToSale;
      totalATU += ATU;
      totalATV += ATV;
      return {
        ...group,
        avgTransactionUnit: ATU.toFixed(2),
        avgTransactionValue: ATV.toFixed(2),
      };
    });

    return {
      groupedArray,
      totalMetrics: {
        sales: totalSales,
        totalAmount,
        totalQtySold,
        totalConversionToSale: totalConverted,
        totalATU,
        totalATV,
        avgATU: (channelCount ? totalATU / channelCount : 0).toFixed(2),
        avgATV: (channelCount ? totalATV / channelCount : 0).toFixed(2),
      },
    };
  }, [metrics, ReferenceID, Role, month, year, startDate, endDate]);

  const formatAmount = (amount: number) =>
    amount.toLocaleString("en-PH", { style: "currency", currency: "PHP" });

  return (
    <div className="bg-white overflow-x-auto">
      {loading ? (
        <div className="flex justify-center items-center h-full w-full">
          <RiRefreshLine size={30} className="animate-spin" />
        </div>
      ) : (
        <>
          <h3 className="text-left text-sm font-semibold mb-4">Metrics</h3>
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr className="text-xs text-left whitespace-nowrap border-l-4 border-emerald-400">
                {["Channel", "Traffic", "Amount", "Qty Sold", "Converted to Sale", "Avg Transaction Unit", "Avg Transaction Value"].map(h => (
                  <th key={h} className="px-6 py-4 font-semibold text-gray-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {groupedArray.map((group, i) => (
                <tr key={i} className="border-b whitespace-nowrap">
                  <td className="px-6 py-4 text-xs">{group.channel}</td>
                  <td className="px-6 py-4 text-xs">{group.traffic}</td>
                  <td className="px-6 py-4 text-xs">{formatAmount(group.totalAmount)}</td>
                  <td className="px-6 py-4 text-xs">{group.totalQtySold}</td>
                  <td className="px-6 py-4 text-xs">{group.totalConversionToSale}</td>
                  <td className="px-6 py-4 text-xs">{group.avgTransactionUnit}</td>
                  <td className="px-6 py-4 text-xs">{parseFloat(group.avgTransactionValue).toLocaleString("en-PH", {
                    style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2
                  })}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100 px-6 py-4 text-xs text-left font-bold">
              <tr>
                <td className="px-6 py-4 text-xs">TOTAL</td>
                <td className="px-6 py-4 text-xs">{totalMetrics.sales}</td>
                <td className="px-6 py-4 text-xs">{formatAmount(totalMetrics.totalAmount)}</td>
                <td className="px-6 py-4 text-xs">{totalMetrics.totalQtySold}</td>
                <td className="px-6 py-4 text-xs">{totalMetrics.totalConversionToSale}</td>
                <td className="px-6 py-4 text-xs">{parseFloat(totalMetrics.avgATU).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}</td>
                <td className="px-6 py-4 text-xs">{parseFloat(totalMetrics.avgATV).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}</td>
              </tr>
            </tfoot>
          </table>
        </>
      )}
    </div>
  );
};

export default MetricTable;
