"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register the necessary chart.js components and the datalabels plugin
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

interface Metric {
  createdAt: string;
  Channel: string;
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

  // Array of fixed colors for each channel
  const colors = [
    "#3A7D44", "#27445D", "#71BBB2", "#578FCA", "#9966FF", "#FF9F40", 
    "#C9CBCF", "#8B0000", "#008080", "#FFD700", "#DC143C", "#20B2AA", 
    "#8A2BE2", "#FF4500", "#00CED1", "#2E8B57", "#4682B4"
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
    if (channels.includes(metric.Channel)) {
      if (!groups[metric.Channel]) {
        groups[metric.Channel] = {
          channel: metric.Channel,
          traffic: 0,
          items: [],
        };
      }
      groups[metric.Channel].items.push(metric);
      groups[metric.Channel].traffic += 1;
    }
    return groups;
  }, {} as Record<string, any>);

  // Prepare data for the bar chart
  const chartData = {
    labels: Object.keys(groupedMetrics), // Channel names as labels
    datasets: [
      {
        label: "Traffic per Channel", // Set your label here
        data: Object.values(groupedMetrics).map((group) => group.traffic),
        backgroundColor: Object.keys(groupedMetrics).map((_, index) => colors[index % colors.length]), // Apply fixed colors cyclically
        borderColor: "#388E3C", // Border color for bars
        borderWidth: 1, // Border width of bars
        borderRadius: 10,
      },
    ],
  };

  // Chart options including data labels plugin
  const chartOptions = {
    responsive: true,
    plugins: {
      datalabels: {
        color: 'black', // White text color for data labels
        font: {
          weight: 'bold' as const, // Use "as const" to explicitly type this as a valid option for font weight
          size: 8, // Font size for data labels
        },
        formatter: function (value: any) {
          return value; // Display the value directly inside the chart
        },
        backgroundColor: 'white', // Set background color of the label
        borderRadius: 50, // Make the background circular
        padding: 4, // Add padding inside the circle
        align: 'center' as const, // Explicitly cast "center" to match the expected type
        anchor: 'center' as const, // Explicitly cast "center" to match the expected type
      },
    },
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      {/* Loading or Bar Chart Content */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div>
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default MetricTable;
