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

// Register chart.js components and plugins
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

interface Metric {
  createdAt: string;
  Channel: string;
  Traffic: string;
  ReferenceID: string;
}

interface MetricTableProps {
  ReferenceID: string;
  month?: number;
  year?: number;
  Role: string;
}

const MetricTable: React.FC<MetricTableProps> = ({ ReferenceID, month, year, Role }) => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Fixed list of channels
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

  // ✅ Fixed colors for each channel
  const colors = [
    "#3A7D44",
    "#27445D",
    "#71BBB2",
    "#578FCA",
    "#9966FF",
    "#FF9F40",
    "#C9CBCF",
    "#8B0000",
    "#008080",
    "#FFD700",
    "#DC143C",
    "#20B2AA",
    "#8A2BE2",
    "#FF4500",
    "#00CED1",
    "#2E8B57",
    "#4682B4",
  ];

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const apiUrl = `/api/ModuleCSR/Dashboard/Metrics?ReferenceID=${ReferenceID}&month=${month}&year=${year}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();

        // ✅ Filter data by role
        let filteredData = data;

        if (Role === "Staff") {
          filteredData = data.filter(
            (item: Metric) => item.ReferenceID === ReferenceID
          );
        }

        // ✅ Filter by month and year in frontend if backend is not filtering
        const finalData = filteredData.filter((item: Metric) => {
          const createdAtDate = new Date(item.createdAt);
          return (
            createdAtDate.getMonth() + 1 === month &&
            createdAtDate.getFullYear() === year
          );
        });

        setMetrics(finalData);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [ReferenceID, Role, month, year]);

  // ✅ Group by Channel for predefined channels
  const groupedMetrics = metrics.reduce((groups, metric) => {
    if (channels.includes(metric.Channel)) {
      if (!groups[metric.Channel]) {
        groups[metric.Channel] = {
          channel: metric.Channel,
          traffic: 0,
        };
      }
      groups[metric.Channel].traffic += 1;
    }
    return groups;
  }, {} as Record<string, any>);

  // ✅ Prepare data for the bar chart
  const chartData = {
    labels: Object.keys(groupedMetrics),
    datasets: [
      {
        label: "Traffic per Channel",
        data: Object.values(groupedMetrics).map((group) => group.traffic),
        backgroundColor: Object.keys(groupedMetrics).map(
          (_, index) => colors[index % colors.length]
        ),
        borderColor: "#388E3C",
        borderRadius: 10,
      },
    ],
  };

  // ✅ Chart options with data labels
  const chartOptions = {
    responsive: true,
    plugins: {
      datalabels: {
        color: "black",
        font: {
          weight: "bold" as const,
          size: 8,
        },
        formatter: function (value: any) {
          return value;
        },
        backgroundColor: "white",
        borderRadius: 50,
        padding: 4,
        align: "center" as const,
        anchor: "center" as const,
      },
    },
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
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
