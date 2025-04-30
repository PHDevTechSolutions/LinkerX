"use client";
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
        const res = await fetch(`/api/ModuleCSR/Dashboard/Metrics?ReferenceID=${ReferenceID}&month=${month}&year=${year}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data: Metric[] = await res.json();
        setMetrics(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, [ReferenceID, month, year]);

  const { groupedArray, totalMetrics } = useMemo(() => {
    const grouped = new Map<string, any>();
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    let totalSales = 0, totalAmount = 0, totalQtySold = 0, totalConverted = 0, totalATV = 0, totalATU = 0, channelCount = 0;

    for (const m of metrics) {
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
        totalATV,
        avgATV: (channelCount ? totalATV / channelCount : 0).toFixed(2),
      },
    };
  }, [metrics, ReferenceID, Role, month, year, startDate, endDate]);

  const formatAmount = (amount: number) =>
    amount.toLocaleString("en-PH", { style: "currency", currency: "PHP" });

  return (
    <div className="bg-white">
      {loading ? (
        <div className="flex justify-center items-center h-full w-full">
          <RiRefreshLine size={30} className="animate-spin" />
        </div>
      ) : (
        <table className="w-full border-collapse border border-gray-200 text-[10px]">
          <thead className="bg-gray-100">
            <tr>
              {["Channel", "Traffic", "Amount", "Qty Sold", "Converted to Sale", "Avg Transaction Unit", "Avg Transaction Value"].map(h => (
                <th key={h} className="border p-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groupedArray.map((group, i) => (
              <tr key={i} className="text-center border-t text-xs">
                <td className="border p-2">{group.channel}</td>
                <td className="border p-2">{group.traffic}</td>
                <td className="border p-2">{formatAmount(group.totalAmount)}</td>
                <td className="border p-2">{group.totalQtySold}</td>
                <td className="border p-2">{group.totalConversionToSale}</td>
                <td className="border p-2">{group.avgTransactionUnit}</td>
                <td className="border p-2">{parseFloat(group.avgTransactionValue).toLocaleString("en-PH", {
                  style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2
                })}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100 text-xs text-center font-bold">
            <tr>
              <td className="border p-2">TOTAL</td>
              <td className="border p-2">{totalMetrics.sales}</td>
              <td className="border p-2">{formatAmount(totalMetrics.totalAmount)}</td>
              <td className="border p-2">{totalMetrics.totalQtySold}</td>
              <td className="border p-2">{totalMetrics.totalConversionToSale}</td>
              <td className="border p-2">-</td>
              <td className="border p-2">{parseFloat(totalMetrics.avgATV).toLocaleString("en-US", {
                minimumFractionDigits: 2, maximumFractionDigits: 2
              })}</td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
};

export default MetricTable;
