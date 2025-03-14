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
        backgroundColor: ["#1B360D", "#744700", "#A64D79"], // Customer types color scheme
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
        borderWidth: 6, // Add border width to the arcs
      },
    },
    cutout: '70%', // Doughnut hole
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="w-full h-full">
      <p className="text-xs">
          <strong>Doughnut chart</strong> showing the count of <strong>customer type</strong> in the dataset. It updates
          dynamically based on <strong>start</strong> and <strong>end dates</strong>. "Loading data..." is shown during fetch,
          and "No data available" appears if there's no data.
        </p>
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
