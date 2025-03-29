"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface WrapupProps {
  ReferenceID: string;
  Role: string;
  month: number;
  year: number;
}

const Wrapup: React.FC<WrapupProps> = ({ ReferenceID, Role, month, year }) => {
  const [wrapupData, setWrapupData] = useState<{ _id: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Wrapup Data with Month and Year
  const fetchWrapupData = async () => {
    try {
      setLoading(true);
      const monthParam = month !== 0 ? month.toString() : "";
      const yearParam = year !== 0 ? year.toString() : "";

      const res = await fetch(
        `/api/ModuleCSR/Dashboard/Wrapup?ReferenceID=${ReferenceID}&Role=${Role}&month=${monthParam}&year=${yearParam}`
      );
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setWrapupData(data || []);
    } catch (error) {
      console.error("Error fetching wrapup data:", error);
      setWrapupData([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Data on Initial Render and When Filters Change
  useEffect(() => {
    fetchWrapupData();
  }, [ReferenceID, Role, month, year]);

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

  const labels = [
    "Customer Order",
    "Customer Inquiry Sales",
    "Customer Inquiry Non-Sales",
    "Follow Up Sales",
    "After Sales",
    "Customer Complaint",
    "Customer Feedback/Recommendation",
    "Job Inquiry",
    "Job Applicants",
    "Supplier/Vendor Product Offer",
    "Follow Up Non-Sales",
    "Internal Whistle Blower",
    "Threats/Extortion/Intimidation",
    "Prank Call",
    "Supplier Accreditation Request",
    "Internal Concern",
    "Others",
  ];

  const barChartData = {
    labels: labels,
    datasets: [
      {
        label: "Wrap Up Count",
        data: labels.map((label) => {
          const item = wrapupData.find((entry) => entry._id === label);
          return item ? item.count : 0;
        }),
        backgroundColor: colors,
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions: any = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: true, // ✅ Allow custom height
    aspectRatio: 1,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          generateLabels: function (chart: ChartJS) {
            const labels = chart.data.labels as string[];
            const datasets = chart.data.datasets as any[];
            return labels.map((label, index) => {
              const dataset = datasets[0];
              const dataValue = dataset.data[index];
              return {
                text: `${label}: ${dataValue}`,
                fillStyle: dataset.backgroundColor[index],
                strokeStyle: dataset.borderColor[index],
                lineWidth: dataset.borderWidth,
              };
            });
          },
        },
      },
      title: {
        display: true,
        text: "Wrap Up",
        font: { size: 15 },
      },
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
        align: 'center', // Center the label within the circle
        anchor: 'center', // Anchor the label to the center of the bar
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
    layout: { padding: 2 },
    scales: {
      x: { beginAtZero: true },
    },
  };

  return (
    <div className="flex flex-col items-center w-full h-full p-4">
      {/* ✅ Chart Section */}
      <div className="w-full h-full">
        {loading ? (
          <p className="text-center text-gray-600 text-xs">Loading data...</p>
        ) : wrapupData.length > 0 ? (
          <Bar data={barChartData} options={barChartOptions} />
        ) : (
          <p className="text-center text-gray-600 text-xs">No data available</p>
        )}
      </div>
    </div>
  );
};

export default Wrapup;
