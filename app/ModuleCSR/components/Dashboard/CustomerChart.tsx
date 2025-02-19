"use client";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from "chart.js";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

interface CustomerChartProps {
  startDate?: string;
  endDate?: string;
}

const CustomerChart: React.FC<CustomerChartProps> = ({ startDate, endDate }) => {
  const [genderData, setGenderData] = useState<any>(null);
  
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

      const res = await fetch(`/api/ModuleCSR/Dashboard/Customer?startDate=${finalStartDate}&endDate=${finalEndDate}`);
      const data = await res.json();
      if (res.ok) {
        setGenderData(data);
      }
    };

    fetchGenderData();
  }, []);

  const pieChartData = {
    labels: genderData ? genderData.map((item: any) => item._id) : [],
    datasets: [
      {
        data: genderData ? genderData.map((item: any) => item.count) : [],
        backgroundColor: ["#FBA518", "#3A7D44", "#F5F5F5", "#3674B5"],
        borderColor: "#fff",
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
        text: "Inbound Traffic Per Customer Status",
        font: {
          size: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
    layout: {
      padding: 30, // Added padding for a better view
    },
    elements: {
      arc: {
        borderWidth: 6, // Add border width to the arcs for a more distinct look
      },
    },
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="w-full h-full">
        {genderData ? (
          <Pie data={pieChartData} options={pieChartOptions} />
        ) : (
          <p className="text-center text-gray-600 text-xs">Loading data...</p>
        )}
      </div>
    </div>
  );
};

export default CustomerChart;
