"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface Metric {
  createdAt: string;
  Total: string;
  Count: number;
}

interface ChannelBarChartProps {
  ReferenceID: string;
  month?: number;
  year?: number;
}

const ChannelBarChart: React.FC<ChannelBarChartProps> = ({
  ReferenceID,
  month,
  year,
}) => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Set default values for month and year
  const selectedMonth = month || new Date().getMonth() + 1;
  const selectedYear = year || new Date().getFullYear();

  // ✅ Fetch and process data based on month and year
  const fetchData = async (month: number, year: number) => {
    try {
      setLoading(true);

      // ✅ Correct API URL without Role
      const apiUrl = `/api/ModuleCSR/Dashboard/Metrics?ReferenceID=${ReferenceID}&month=${month}&year=${year}`;
      console.log("Fetching URL:", apiUrl);

      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Failed to fetch data: ${errorDetails}`);
      }

      const data: Metric[] = await response.json();

      // ✅ Map data properly for chart
      const labels = data.map((item) => item.Total);
      const trafficData = data.map((item) => item.Count);

      const colors = [
        "#3A7D44",
        "#27667B",
        "#497D74",
        "#27445D",
        "#3674B5",
        "#FBA518",
        "#F9CB43",
        "#493D9E",
        "#77B254",
        "#8E1616",
      ];

      setChartData({
        labels,
        datasets: [
          {
            label: "Traffic Count",
            data: trafficData,
            backgroundColor: colors.slice(0, trafficData.length),
            borderColor: "#1E40AF",
            borderWidth: 1,
            datalabels: {
              align: "center",
              color: "#fff",
              font: { size: 12, weight: "bold" },
              formatter: (value: any) => value,
            },
          },
        ],
      });
    } catch (error) {
      setChartData(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch data when month/year or ReferenceID changes
  useEffect(() => {
    fetchData(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear, ReferenceID]);

  // ✅ Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Traffic Count by Channel",
        font: { size: 15 },
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
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full">
      {/* ✅ Chart or Loading State */}
      <div className="w-full flex justify-center items-center">
        {loading ? (
          <p>Loading...</p>
        ) : chartData ? (
          <Bar data={chartData} options={options} />
        ) : (
          <p>No data available for the selected period</p>
        )}
      </div>
    </div>
  );
};

export default ChannelBarChart;
