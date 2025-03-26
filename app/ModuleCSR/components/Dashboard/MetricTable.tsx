"use client";
import React, { useEffect, useState } from "react";

interface Metric {
  createdAt: string;
  Channel: string;
  Amount: string | number; // Allow Amount to be a string or number
  QtySold: number;
  Status: string;
  Traffic: string;
}

interface MetricTableProps {
  ReferenceID: string;
  month?: number;
  year?: number;
  Role: string;
}

const MetricTable: React.FC<MetricTableProps> = ({
  ReferenceID,
  month,
  year,
  Role,
}) => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fixed list of channels
  const channels = [
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
  ];

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const apiUrl = `/api/ModuleCSR/Dashboard/Metrics?ReferenceID=${ReferenceID}&month=${month}&year=${year}`;
        const response = await fetch(apiUrl); // Fetching data from API
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();

        // ✅ Filter by month and year in frontend if backend is not filtering
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

    fetchMetrics(); // Call the fetch function
  }, [ReferenceID, Role, month, year]);

  // Group by Channel, only for the predefined channels
  const groupedMetrics = metrics.reduce((groups, metric) => {
    // Check if the metric's channel is in the predefined list
    if (channels.includes(metric.Channel)) {
      if (!groups[metric.Channel]) {
        groups[metric.Channel] = {
          channel: metric.Channel,
          traffic: 0, // Initialize traffic counter
          totalAmount: 0, // Initialize total amount
          totalQtySold: 0, // Initialize total qty sold
          sales: 0,
          totalConversionToSale: 0, // Initialize totalConversionToSale to 0
          items: [],
        };
      }

      groups[metric.Channel].items.push(metric); // Add the metric to the channel group
      groups[metric.Channel].traffic += 1; // Increase traffic count for the channel

      // Parse Amount and QtySold as numbers
      const amount = parseFloat(String(metric.Amount)) || 0;
      const qtySold = parseFloat(String(metric.QtySold)) || 0;
      const isSale = metric.Traffic === "Sales";
      const isConverted = metric.Status === "Converted Into Sales";

      groups[metric.Channel].totalAmount += amount; // Summing up the Amount
      groups[metric.Channel].totalQtySold += qtySold; // Summing up Qty Sold
      groups[metric.Channel].sales += isSale ? 1 : 0; // Count conversion to sale
      groups[metric.Channel].totalConversionToSale += isConverted ? 1 : 0; // Count conversion to sale
    }

    return groups;
  }, {} as Record<string, any>);

  // Now calculate the overall totals
  const totalMetrics = Object.values(groupedMetrics).reduce(
    (acc, agentMetrics) => {
      // Totals for each channel group
      acc.sales += agentMetrics.sales;
      acc.totalAmount += agentMetrics.totalAmount;
      acc.totalQtySold += agentMetrics.totalQtySold;
      acc.totalConversionToSale += agentMetrics.totalConversionToSale;

      // Calculate Avg Transaction Unit & Value for overall
      acc.totalATU += agentMetrics.totalConversionToSale > 0
        ? agentMetrics.totalQtySold / agentMetrics.totalConversionToSale
        : 0;
      acc.totalATV += agentMetrics.totalConversionToSale > 0
        ? agentMetrics.totalAmount / agentMetrics.totalConversionToSale
        : 0;

      // Calculate Conversion % for overall
      acc.totalConversionPercentage += agentMetrics.sales > 0
        ? (agentMetrics.totalConversionToSale / agentMetrics.sales) * 100
        : 0;

      acc.agentCount += 1; // Count total agents for averaging
      return acc;
    },
    {
      sales: 0,
      nonSales: 0,
      totalAmount: 0,
      totalQtySold: 0,
      totalConversionToSale: 0,
      totalATU: 0,
      totalATV: 0,
    }
  );

  // Helper function to format Amount with Peso symbol
  const formatAmountWithPeso = (amount: number) =>
    amount.toLocaleString("en-PH", { style: "currency", currency: "PHP" });

  // Convert the groupedMetrics object into an array to render in the table
  const groupedArray = Object.values(groupedMetrics);

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      {/* Loading or Table Content */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200 text-xs">
          <thead>
            <tr className="bg-gray-100">
              {[
                "Channel",
                "Traffic",
                "Amount",
                "Qty Sold",
                "Converted to Sale",
                "Average Transaction Unit",
                "Average Transaction Value",
              ].map((header) => (
                <th key={header} className="border p-2">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groupedArray.map((group, index) => {
              // Compute Average Transaction Unit: QtySold / totalConversionToSale
              const avgTransactionUnit =
                group.totalConversionToSale === 0
                  ? "0.00"
                  : (group.totalQtySold / group.totalConversionToSale).toFixed(2);

              const avgTransactionValue =
                group.totalConversionToSale === 0
                  ? "0.00"
                  : (group.totalAmount / group.totalConversionToSale).toFixed(2);

              return (
                <tr key={index} className="text-center border-t">
                  <td className="border p-2">{group.channel}</td>
                  <td className="border p-2">{group.traffic}</td>
                  <td className="border p-2">
                    {group.totalAmount.toLocaleString("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    })}
                  </td>
                  <td className="border p-2">{group.totalQtySold}</td>
                  <td className="border p-2">{group.totalConversionToSale}</td>
                  <td className="border p-2">{avgTransactionUnit}</td>
                  <td className="border p-2">
                    {parseFloat(avgTransactionValue).toLocaleString("en-PH", {
                      style: "decimal",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-100 text-[10px] text-center font-bold">
            <tr>
              <td className="border p-2">TOTAL</td>
              <td className="border p-2">{totalMetrics.sales}</td>
              <td className="border p-2">{formatAmountWithPeso(totalMetrics.totalAmount)}</td>
              <td className="border p-2">{totalMetrics.totalQtySold}</td>
              <td className="border p-2">{totalMetrics.totalConversionToSale}</td>
              <td className="border p-2">-</td>
              <td className="border p-2">{totalMetrics.totalATV.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2,})}</td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
};

export default MetricTable;
