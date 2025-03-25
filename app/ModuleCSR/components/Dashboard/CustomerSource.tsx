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

interface CustomerSourceProps {
  ReferenceID: string;
  Role: string;
  month: number;
  year: number;
}

const CustomerSource: React.FC<CustomerSourceProps> = ({ ReferenceID, Role, month, year }) => {
  const [genderData, setGenderData] = useState<{ _id: string; count: number }[]>([]);

  // ✅ Fetch Customer Source Data Based on Month/Year
  const fetchGenderData = async () => {
    try {
      const res = await fetch(
        `/api/ModuleCSR/Dashboard/CustomerSource?ReferenceID=${ReferenceID}&Role=${Role}&month=${month}&year=${year}`
      );

      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setGenderData(data || []);
    } catch (error) {
      console.error("Error fetching gender data:", error);
    }
  };

  // ✅ Fetch Data When Month/Year Changes
  useEffect(() => {
    fetchGenderData();
  }, [month, year, ReferenceID, Role]);

  const colors = [
    "#A64D79",
    "#452A00",
    "#275214",
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
    "#D2691E",
  ];

  const labels = [
    "FB Ads",
    "Viber Community / Viber",
    "Whatsapp Community / Whatsapp",
    "SMS",
    "Website",
    "Word of Mouth",
    "Quotation Docs",
    "Google Search",
    "Email Blast",
    "Agent Call",
    "Catalogue",
    "Shopee",
    "Lazada",
    "Tiktok",
    "Worldbex",
    "PhilConstruct",
    "Calendar",
    "Product Demo",
  ];

  // ✅ Prepare Bar Chart Data
  const barChartData = {
    labels: labels,
    datasets: [
      {
        label: "Customer Count",
        data: labels.map((label) => {
          const item = genderData.find((entry) => entry._id === label);
          return item ? item.count : 0;
        }),
        backgroundColor: colors,
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  // ✅ Bar Chart Options
  const barChartOptions: any = {
    indexAxis: "y", // Horizontal bar chart
    responsive: true,
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
        text: "Where Customers Found Us",
        font: {
          size: 15,
        },
      },
      datalabels: {
        color: '#fff', // White text color for data labels
        font: {
          weight: 'bold' as const, // Use "as const" to explicitly type this as a valid option for font weight
          size: 10, // Font size for data labels
        },
        formatter: function (value: any) {
          return value; // Display the value directly inside the chart
        },
        backgroundColor: 'black', // Set background color of the label
        borderRadius: 50, // Make the background circular
        padding: 4, // Add padding inside the circle
        align: 'center', // Center the label within the circle
        anchor: 'center', // Anchor the label to the center of the bar
      },
    },
    layout: {
      padding: 0,
    },
    scales: {
      x: {
        beginAtZero: true,
        barThickness: 20,
        categoryPercentage: 1.0,
        barPercentage: 0.8,
      },
    },
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      {/* ✅ Render Chart or No Data Message */}
      <div className="flex justify-center items-center w-full h-full">
        <div className="w-full h-full">
          {genderData.length > 0 ? (
            <Bar data={barChartData} options={barChartOptions} />
          ) : (
            <p className="text-center text-gray-600 text-xs">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerSource;
