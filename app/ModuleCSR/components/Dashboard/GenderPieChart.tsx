"use client";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from "chart.js";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

interface GenderPieChartProps {
  startDate?: string;
  endDate?: string;
}

const GenderPieChart: React.FC<GenderPieChartProps> = ({ startDate, endDate }) => {
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
        const res = await fetch(`/api/ModuleCSR/Dashboard/Monitoring?startDate=${finalStartDate}&endDate=${finalEndDate}`);
        const data = await res.json();
        if (res.ok) {
          setGenderData(data);
        } else {
          
        }
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    };

    fetchGenderData();
  }, [startDate, endDate]); // Re-fetch data when startDate or endDate change

  const pieChartData = {
    labels: genderData ? genderData.map((item: any) => item._id) : [], // Gender status
    datasets: [
      {
        data: genderData ? genderData.map((item: any) => item.count) : [], // Count of each gender
        backgroundColor: ["#3A7D44", "#FBA518"], // Custom colors for gender
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
    },
    layout: {
      padding: 30, // Added padding for better view
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
        {loading ? (
          <p className="text-center text-gray-600 text-xs">Loading data...</p>
        ) : genderData ? (
          <Pie data={pieChartData} options={pieChartOptions} />
        ) : (
          <p className="text-center text-gray-600 text-xs">No data available</p>
        )}
      </div>
    </div>
  );
};

export default GenderPieChart;
