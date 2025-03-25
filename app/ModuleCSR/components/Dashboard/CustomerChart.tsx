"use client";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

interface CustomerChartProps {
  ReferenceID: string;
  Role: string;
}

const CustomerChart: React.FC<CustomerChartProps> = ({ ReferenceID, Role }) => {
  const [customerData, setCustomerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>(`${new Date().getMonth() + 1}`);
  const [selectedYear, setSelectedYear] = useState<string>(`${new Date().getFullYear()}`);

  // ✅ Fetch data on component load and when filters change
  useEffect(() => {
    const fetchCustomerData = async () => {
      setLoading(true);
      try {
        // Build start and end date based on month and year
        const startDate = `${selectedYear}-${selectedMonth.padStart(2, "0")}-01`;
        const endDate = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0)
          .toISOString()
          .split("T")[0];

        // ✅ Corrected API call with new endpoint and parameters
        const res = await fetch(
          `/api/ModuleCSR/Dashboard/Customer?ReferenceID=${ReferenceID}&Role=${Role}&startDate=${startDate}&endDate=${endDate}`
        );
        const data = await res.json();

        if (res.ok) {
          setCustomerData(data);
        } else {
          setCustomerData(null);
        }
      } catch (error) {
        console.error("❌ Error fetching customer data:", error);
        setCustomerData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [selectedMonth, selectedYear, ReferenceID, Role]);

  // ✅ Prepare chart data
  const pieChartData = {
    labels: customerData ? customerData.map((item: any) => item._id) : [],
    datasets: [
      {
        data: customerData ? customerData.map((item: any) => item.count) : [],
        backgroundColor: ["#0B293F", "#332753", "#4C0000", "#1B360D", "#6D214F"],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true,
    },
    plugins: {
      title: {
        display: true,
        text: "Customer Status Distribution",
        font: {
          size: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
      datalabels: {
        color: "#fff",
        font: {
          weight: "bold" as const,
          size: 14,
        },
        formatter: function (value: any) {
          return value;
        },
      },
    },
    layout: {
      padding: 2,
    },
    elements: {
      arc: {
        borderWidth: 6,
      },
    },
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full space-y-4">
      {/* Month and Year Filters */}
      <div className="flex space-x-4 mb-2">
        {/* Month Filter */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border p-2 rounded text-xs bg-white"
        >
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>

        {/* Year Filter */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border p-2 rounded text-xs bg-white"
        >
          {Array.from({ length: 5 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>

      {/* Pie Chart */}
      <div className="w-full h-full">
        {loading ? (
          <p className="text-center text-gray-600 text-xs">Loading data...</p>
        ) : customerData && customerData.length > 0 ? (
          <Pie data={pieChartData} options={pieChartOptions} plugins={[ChartDataLabels]} />
        ) : (
          <p className="text-center text-gray-600 text-xs">No data available</p>
        )}
      </div>
    </div>
  );
};

export default CustomerChart;
