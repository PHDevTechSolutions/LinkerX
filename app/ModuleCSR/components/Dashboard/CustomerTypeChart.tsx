"use client";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from "chart.js";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

interface CustomerTypeChartProps {
  startDate?: string;
  endDate?: string;
  ReferenceID: string;
  Role: string;
}

const CustomerTypeChart: React.FC<CustomerTypeChartProps> = ({ startDate, endDate, ReferenceID, Role }) => {
  const [genderData, setCustomerType] = useState<any>(null);

  const getCurrentMonthRange = () => {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    return { startOfMonth, endOfMonth };
  };

  useEffect(() => {
    const fetchGenderData = async () => {
      const { startOfMonth, endOfMonth } = getCurrentMonthRange();
      const finalStartDate = startDate || startOfMonth.toISOString(); // Fallback to current month if no startDate
      const finalEndDate = endDate || endOfMonth.toISOString(); // Fallback to current month if no endDate
      
      const res = await fetch(`/api/ModuleCSR/Dashboard/CustomerType?startDate=${finalStartDate}&endDate=${finalEndDate}&ReferenceID=${ReferenceID}&Role=${Role}`);
      const data = await res.json();
      if (res.ok) {
        setCustomerType(data);
      }
    };

    fetchGenderData();
  }, [startDate, endDate, ReferenceID, Role]); // Depend on startDate and endDate

  const doughnutChartData = {
    labels: genderData ? genderData.map((item: any) => item._id) : [],
    datasets: [
      {
        data: genderData ? genderData.map((item: any) => item.count) : [],
        backgroundColor: ["#3A7D44", "#FBA518", "#F5F5F5", "F9CB43", "#3674B5"], // Customer types color scheme
        borderColor: "#fff", // Border color for better contrast
        borderWidth: 2,
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true,
    },
    plugins: {
      title: {
        display: true,
        text: "Inbound Traffic Per Customer Type",
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
      padding: 30, // Added padding for better view
    },
    elements: {
      arc: {
        borderWidth: 6, // Add border width to the arcs
      },
    },
    cutout: '70%', // Doughnut hole
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="w-full h-full">
        {genderData ? (
          <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
        ) : (
          <p className="text-center text-gray-600 text-xs">Loading data...</p>
        )}
      </div>
    </div>
  );
};

export default CustomerTypeChart;
