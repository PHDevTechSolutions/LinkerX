"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';  // Import the plugin

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

interface Metric {
  userName: string;
  totalSalesAmount: string;
}

const AgentSalesConversionBarChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/ModuleCSR/Dashboard/AgentSalesConversion");
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();

        // Process the data to extract userName and totalSalesAmount
        const labels = data.map((metric: Metric) => metric.userName);
        const salesAmountData = data.map((metric: Metric) => parseFloat(metric.totalSalesAmount.replace("₱", "").replace(",", "")));

        // Define color options for each bar
        const colors = [
          "#3A7D44", "#27667B", "#497D74", "#27445D", "#3674B5",
          "#FBA518", "#F9CB43", "#493D9E", "#77B254", "#8E1616"
        ];

        setChartData({
          labels,
          datasets: [
            {
              label: "Total Sales Amount",
              data: salesAmountData,
              backgroundColor: colors.slice(0, salesAmountData.length), // Apply colors to bars
              borderColor: "#1E40AF",
              borderWidth: 1,
              datalabels: {
                align: 'center',
                color: '#fff', // Set text color
                font: { size: 12, weight: 'bold' }, // Set font size and weight
                formatter: (value: any) => `₱${value.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`, // Format amount as currency
              }
            },
          ],
        });
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Traffic to Sales Conversion",
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
        <p className="text-xs">Loading...</p>
      ) : chartData ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default AgentSalesConversionBarChart;
