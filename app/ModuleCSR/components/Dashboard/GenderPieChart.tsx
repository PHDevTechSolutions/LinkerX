"use client";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

interface GenderPieChartProps {
  ReferenceID: string;
  Role: string;
}

const GenderPieChart: React.FC<GenderPieChartProps> = ({ ReferenceID, Role }) => {
  const [genderData, setGenderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString()); // Default to current month
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString()); // Default to current year

  // Fetch gender data based on selected month and year
  useEffect(() => {
    const fetchGenderData = async () => {
      try {
        const res = await fetch(
          `/api/ModuleCSR/Dashboard/Monitoring?ReferenceID=${ReferenceID}&Role=${Role}&month=${selectedMonth}&year=${selectedYear}`
        );
        const data = await res.json();
        if (res.ok) {
          setGenderData(data);
        }
      } catch (error) {
        console.error("Error fetching gender data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenderData();
  }, [selectedMonth, selectedYear, ReferenceID, Role]);

  // Pie chart data
  const pieChartData = {
    labels: genderData ? genderData.map((item: any) => item._id) : [],
    datasets: [
      {
        data: genderData ? genderData.map((item: any) => item.count) : [],
        backgroundColor: ["#B8742C", "#162F0B"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  // Pie chart options
  const pieChartOptions = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true,
    },
    plugins: {
      title: {
        display: true,
        text: "Inbound Traffic Per Gender",
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
    <div className="flex flex-col justify-center items-center w-full h-full p-4">
      {/* Month and Year Filters */}
      <div className="flex space-x-2 mb-4 w-full max-w-sm">
        {/* Month Select */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border px-2 py-1 rounded text-xs"
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

        {/* Year Select */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border px-2 py-1 rounded text-xs"
        >
          {Array.from({ length: 5 }).map((_, i) => {
            const year = new Date().getFullYear() - i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>

      {/* Chart Display */}
      <div className="w-full h-full">
        {loading ? (
          <p className="text-center text-gray-600 text-xs">Loading data...</p>
        ) : genderData && genderData.length > 0 ? (
          <Pie data={pieChartData} options={pieChartOptions} plugins={[ChartDataLabels]} />
        ) : (
          <p className="text-center text-gray-600 text-xs">No data available</p>
        )}
      </div>
    </div>
  );
};

export default GenderPieChart;
