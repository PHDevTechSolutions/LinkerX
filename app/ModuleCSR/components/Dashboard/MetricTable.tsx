"use client";
import React, { useEffect, useState } from "react";

interface Metric {
  CreatedAt: string;
  Total: string;
  Count: number;
  Amount: string;
  ConvertedSales: number;
  TotalQty: number;
  TransactionUnit: number;
  TransactionValue: number;
}

const getWeekNumber = (dateString: string) => {
  const date = new Date(dateString);
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  return Math.ceil((date.getDate() + firstDayOfMonth.getDay()) / 7);
};

interface MetricTableProps {
  ReferenceID: string;
  Role: string;
}

const MetricTable: React.FC<MetricTableProps> = ({ ReferenceID, Role }) => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [filteredMetrics, setFilteredMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedWeek, setSelectedWeek] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`/api/ModuleCSR/Dashboard/Metrics?ReferenceID=${ReferenceID}&Role=${Role}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();

        const updatedMetrics = data.map((metric: Metric) => {
          const numericAmount = parseFloat(metric.Amount.replace(/[₱,]/g, "")) || 0;
          return {
            ...metric,
            TransactionUnit: metric.ConvertedSales !== 0 ? metric.TotalQty / metric.ConvertedSales : 0,
            TransactionValue: metric.ConvertedSales !== 0 ? numericAmount / metric.ConvertedSales : 0,
          };
        });

        setMetrics(updatedMetrics);
        setFilteredMetrics(updatedMetrics);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [ReferenceID, Role]);

  useEffect(() => {
    let filteredData = [...metrics];

    if (selectedWeek !== "All") {
      const weekNumber = parseInt(selectedWeek.replace("Week ", ""), 10);
      filteredData = filteredData.filter((metric) => getWeekNumber(metric.CreatedAt) === weekNumber);
    }

    if (selectedMonth !== "All") {
      const monthNumber = new Date(`${selectedMonth} 1, 2023`).getMonth();
      filteredData = filteredData.filter((metric) => new Date(metric.CreatedAt).getMonth() === monthNumber);
    }

    if (selectedYear !== "All") {
      filteredData = filteredData.filter((metric) => new Date(metric.CreatedAt).getFullYear().toString() === selectedYear);
    }

    setFilteredMetrics(filteredData);
  }, [selectedWeek, selectedMonth, selectedYear, metrics]);

  const calculateTotals = () => {
    const totals = {
      count: 0,
      amount: 0,
      convertedSales: 0,
      TotalQty: 0,
      avgTransactionUnit: 0,
      avgTransactionValue: 0,
    };

    filteredMetrics.forEach((metric) => {
      totals.count += metric.Count;
      totals.amount += parseFloat(metric.Amount.replace(/[₱,]/g, "")) || 0;
      totals.convertedSales += metric.ConvertedSales;
      totals.TotalQty += metric.TotalQty;
    });

    totals.avgTransactionUnit = totals.convertedSales !== 0 ? totals.TotalQty / totals.convertedSales : 0;
    totals.avgTransactionValue = totals.convertedSales !== 0 ? totals.amount / totals.convertedSales : 0;

    return totals;
  };

  const totals = calculateTotals();

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex space-x-4 mb-4">
        <div>
          <label className="text-xs font-semibold mr-2">Filter by Week:</label>
          <select className="border p-1 rounded text-xs" value={selectedWeek} onChange={(e) => setSelectedWeek(e.target.value)}>
            <option value="All">All Weeks</option>
            <option value="Week 1">Week 1</option>
            <option value="Week 2">Week 2</option>
            <option value="Week 3">Week 3</option>
            <option value="Week 4">Week 4</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold mr-2">Filter by Month:</label>
          <select className="border p-1 rounded text-xs" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            <option value="All">All Months</option>
            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold mr-2">Filter by Year:</label>
          <select className="border p-1 rounded text-xs" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="All">All Years</option>
            {["2023", "2024", "2025"].map((year) => (
              <option key={year} value={year}>{year}</option>
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
              {["Channel", "Traffic", "Amount", "Converted to Sale", "Qty Sold", "Avg Transaction Unit", "Avg Transaction Value"].map((header) => (
                <th key={header} className="border p-2">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredMetrics.map((metric, index) => (
              <tr key={index} className="text-center border-t">
                <td className="border p-2">{metric.Total}</td>
                <td className="border p-2">{metric.Count}</td>
                <td className="border p-2">{metric.Amount}</td>
                <td className="border p-2">{metric.ConvertedSales}</td>
                <td className="border p-2">{metric.TotalQty}</td>
                <td className="border p-2">{metric.TransactionUnit.toFixed(2)}</td>
                <td className="border p-2">₱{metric.TransactionValue.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold">
              <td className="border text-right p-2">Total</td>
              <td className="border p-2 text-center">{totals.count}</td>
              <td className="border p-2 text-center">₱{totals.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</td>
              <td className="border p-2 text-center">{totals.convertedSales}</td>
              <td className="border p-2 text-center">{totals.TotalQty}</td>
              <td className="border p-2 text-center">{totals.avgTransactionUnit.toFixed(2)}</td>
              <td className="border p-2 text-center">₱{totals.avgTransactionValue.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
};

export default MetricTable;
