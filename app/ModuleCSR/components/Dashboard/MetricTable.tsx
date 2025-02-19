"use client";
import React, { useEffect, useState } from "react";

interface Metric {
  CreatedAt: string;
  Total: string;
  Count: number;
  Amount: string; // Keep as string initially
  ConvertedSales: number;
  TotalQty: number;
  TransactionUnit: string;
  TransactionValue: string;
}

const getWeekNumber = (dateString: string) => {
  const date = new Date(dateString);
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  return Math.ceil((date.getDate() + firstDayOfMonth.getDay()) / 7);
};

const MetricTable: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [filteredMetrics, setFilteredMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedWeek, setSelectedWeek] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/ModuleCSR/Dashboard/Metrics");
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();

        const updatedMetrics = data.map((metric: Metric) => {
          const numericAmount = parseFloat(metric.Amount.replace(/[₱,]/g, "")) || 0;
          return {
            ...metric,
            TransactionUnit:
              metric.ConvertedSales !== 0 ? (metric.TotalQty / metric.ConvertedSales) : 0,
            TransactionValue:
              metric.ConvertedSales !== 0 ? (numericAmount / metric.ConvertedSales) : 0,
          };
        });

        setMetrics(updatedMetrics);
        setFilteredMetrics(updatedMetrics);
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  useEffect(() => {
    let filteredData = [...metrics];

    if (selectedWeek !== "All") {
      const weekNumber = parseInt(selectedWeek.replace("Week ", ""), 10);
      filteredData = filteredData.filter((metric) => getWeekNumber(metric.CreatedAt) === weekNumber);
    }

    if (selectedMonth !== "All") {
      const monthNumber = new Date(selectedMonth + " 1, 2023").getMonth(); // Convert month name to number
      filteredData = filteredData.filter((metric) => new Date(metric.CreatedAt).getMonth() === monthNumber);
    }

    if (selectedYear !== "All") {
      filteredData = filteredData.filter((metric) => new Date(metric.CreatedAt).getFullYear().toString() === selectedYear);
    }

    setFilteredMetrics(filteredData);
  }, [selectedWeek, selectedMonth, selectedYear, metrics]);

  // Calculate totals for the footer
  const calculateTotals = () => {
    const totals = {
      count: 0,
      amount: 0,
      convertedSales: 0,
      TotalQty: 0,
      avgtransactionUnit: 0,
      avgtransactionValue: 0,
    };

    filteredMetrics.forEach((metric) => {
      totals.count += metric.Count;
      totals.amount += parseFloat(metric.Amount.replace(/[₱,]/g, "")) || 0;
      totals.convertedSales += metric.ConvertedSales;
      totals.TotalQty += metric.TotalQty;
    });

    if (totals.convertedSales !== 0) {
      totals.avgtransactionUnit = totals.TotalQty / totals.convertedSales;
    } else {
      totals.avgtransactionUnit = 0;
    }

    // Calculate avgtransactionValue (Amount / ConvertedSales)
    if (totals.convertedSales !== 0) {
      totals.avgtransactionValue = totals.amount / totals.convertedSales;
    } else {
      totals.avgtransactionValue = 0;
    }

    return totals;
  };

  const totals = calculateTotals();

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      {/* Filters */}
      <div className="flex space-x-4 mb-4">
        {/* Week Filter */}
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

        {/* Month Filter */}
        <div>
          <label className="text-xs font-semibold mr-2">Filter by Month:</label>
          <select className="border p-1 rounded text-xs" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            <option value="All">All Months</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <label className="text-xs font-semibold mr-2">Filter by Year:</label>
          <select className="border p-1 rounded text-xs" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="All">All Years</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200 text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Channel</th>
              <th className="border p-2">Traffic</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Converted to Sale</th>
              <th className="border p-2">Qty Sold</th>
              <th className="border p-2">Avg Transaction Unit</th>
              <th className="border p-2">Avg Transaction Value</th>
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
                <td className="border p-2">{metric.TransactionUnit}</td>
                <td className="border p-2">₱{parseFloat(metric.TransactionValue).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100">
              <td className="border text-right font-bold p-2">Total</td>
              <td className="border p-2 text-center font-bold">{totals.count}</td>
              <td className="border p-2 text-center font-bold">₱{totals.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</td>
              <td className="border p-2 text-center font-bold">{totals.convertedSales}</td>
              <td className="border p-2 text-center font-bold">{totals.TotalQty}</td>
              <td className="border p-2 text-center font-bold">{totals.avgtransactionUnit}</td>
              <td className="border p-2 text-center font-bold">₱{totals.avgtransactionValue.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
};

export default MetricTable;
