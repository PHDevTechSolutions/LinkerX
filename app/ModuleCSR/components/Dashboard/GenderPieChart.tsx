"use client";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from "chart.js";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Type for chart data (optional, to help with typing)
interface GenderPieChartProps {
  startDate?: string;
  endDate?: string;
  ReferenceID: string;
  Role: string;
}

const GenderPieChart: React.FC<GenderPieChartProps> = ({ startDate, endDate, ReferenceID, Role }) => {
  const [genderData, setGenderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to get the current month's start and end dates
  const getCurrentMonthRange = () => {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    return { startOfMonth, endOfMonth };
  };

  useEffect(() => {
    const fetchGenderData = async () => {
      const { startOfMonth, endOfMonth } = getCurrentMonthRange();
      const finalStartDate = startDate || startOfMonth.toISOString(); // Fallback to the current month if no startDate
      const finalEndDate = endDate || endOfMonth.toISOString(); // Fallback to the current month if no endDate

      try {
        const res = await fetch(`/api/ModuleCSR/Dashboard/Monitoring?startDate=${finalStartDate}&endDate=${finalEndDate}&ReferenceID=${ReferenceID}&Role=${Role}`);
        const data = await res.json();
        if (res.ok) {
          setGenderData(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenderData();
  }, [startDate, endDate, ReferenceID, Role]);

  const pieChartData = {
    labels: genderData ? genderData.map((item: any) => item._id) : [], // Gender status
    datasets: [
      {
        data: genderData ? genderData.map((item: any) => item.count) : [], // Count of each gender
        backgroundColor: ["#B8742C", "#162F0B"], // Custom colors for gender
        borderColor: "#fff", // Border color for better contrast
        borderWidth: 2,
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
        text: "Inbound Traffic Per Gender",
        font: {
          size: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`; // Tooltip format
          },
        },
      },
      datalabels: {
        color: '#fff', // White color for the text
        font: {
          weight: 'bold' as const, // Use "as const" to explicitly type this as a valid option for font weight
          size: 14, // Font size for data labels
        },
        formatter: function (value: any) {
          return value; // Display the value directly inside the chart
        },
      },
    },
    layout: {
      padding: 2, // Added padding for better view
    },
    elements: {
      arc: {
        borderWidth: 6, // Add border width for distinct arcs
      },
    },
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="w-full h-full">
        <p className="text-xs">
          <strong>Pie Chart</strong> tracking the count of <strong>male</strong> and <strong>female</strong> entries in the dataset. A loading message appears while data is fetched, and "No data available" will display if there's no data.
        </p>

        {loading ? (
          <p className="text-center text-gray-600 text-xs">Loading data...</p>
        ) : genderData ? (
          <Pie data={pieChartData} options={pieChartOptions} plugins={[ChartDataLabels]} />
        ) : (
          <p className="text-center text-gray-600 text-xs">No data available</p>
        )}
      </div>
    </div>
  );
};

export default GenderPieChart;
