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
  _id: string; // Channel name
  count: number; // Total count for the channel
}

interface BarChartProps {
  ReferenceID: string;
  month?: number;
  year?: number;
}

const BarChart: React.FC<BarChartProps> = ({ ReferenceID, month, year }) => {
  const selectedMonth = month || new Date().getMonth() + 1;
  const selectedYear = year || new Date().getFullYear();

  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data for the selected month and year
  const fetchData = async (month: number, year: number) => {
    try {
      setLoading(true);

      // API URL with month and year passed correctly
      const apiUrl = `/api/ModuleCSR/Dashboard/Channel?ReferenceID=${ReferenceID}&month=${month}&year=${year}`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Failed to fetch data: ${errorDetails}`);
      }

      const data: Metric[] = await response.json();

      // Define the channels you want to display on the bar chart
      const channels = [
        "Google Maps", "Website", "FB Main", "FB EShome", "Viber",
        "Text Message", "Instagram", "Voice Call", "Email", "WhatsApp", "Shopify"
      ];

      // Prepare the data for the chart
      const trafficData = channels.map((channel) => {
        const item = data.find((entry) => entry._id === channel);
        return item ? item.count : 0; // If no data for the channel, use 0
      });

      // Define colors for the bars
      const colors = [
        "#3A7D44", "#27667B", "#497D74", "#27445D", "#3674B5", "#FBA518",
        "#F9CB43", "#493D9E", "#77B254", "#8E1616", "#8E1316"
      ];

      // Update the chart data state
      setChartData({
        labels: channels, // Channel names
        datasets: [
          {
            label: "Inbound Traffic Per Channel",
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

  // Fetch data when month, year, or ReferenceID changes
  useEffect(() => {
    fetchData(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear, ReferenceID]);

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Total Channel Count for Selected Month",
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
      {/* Show loading or the chart */}
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

export default BarChart;
