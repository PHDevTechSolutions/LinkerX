"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';  // Import the plugin

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

interface ChannelBarChartProps {
  startDate?: string;
  endDate?: string;
}

const ChannelBarChart: React.FC<ChannelBarChartProps> = ({ startDate, endDate }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to get current month's start and end dates
  const getCurrentMonthRange = () => {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    return { startOfMonth, endOfMonth };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use default date range if no dates are provided
        const { startOfMonth, endOfMonth } = getCurrentMonthRange();
        const finalStartDate = startDate || startOfMonth.toISOString();
        const finalEndDate = endDate || endOfMonth.toISOString();

        const response = await fetch(`/api/ModuleCSR/Dashboard/Metrics?startDate=${finalStartDate}&endDate=${finalEndDate}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();

        const labels = data.map((item: any) => item.Total);
        const trafficData = data.map((item: any) => item.Count);

        const colors = [
          "#3A7D44", "#27667B", "#497D74", "#27445D", "#3674B5",
          "#FBA518", "#F9CB43", "#493D9E", "#77B254", "#8E1616"
        ];

        setChartData({
          labels,
          datasets: [
            {
              label: "Traffic Count",
              data: trafficData,
              backgroundColor: colors.slice(0, trafficData.length), // Apply colors to bars
              borderColor: "#1E40AF",
              borderWidth: 1,
              datalabels: {
                align: 'center',
                color: '#fff', // Set text color
                font: { size: 12, weight: 'bold' }, // Set font size and weight
                formatter: (value: any) => value, // Display the value inside the bar
              }
            },
          ],
        });
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Traffic Count by Channel",
        font: { size: 16 },
      },
      datalabels: {
        display: true, // Enable data labels
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full flex justify-center items-center">
      {loading ? (
        <p>Loading...</p>
      ) : chartData ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default ChannelBarChart;
