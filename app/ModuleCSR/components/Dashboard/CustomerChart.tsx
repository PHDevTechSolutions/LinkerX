"use client";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from "chart.js";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);
import ChartDataLabels from 'chartjs-plugin-datalabels';

interface CustomerChartProps {
  startDate?: string;
  endDate?: string;
  ReferenceID: string;
  Role: string;
}

const CustomerChart: React.FC<CustomerChartProps> = ({ startDate, endDate, ReferenceID, Role }) => {
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
      const finalStartDate = startDate || startOfMonth.toISOString();
      const finalEndDate = endDate || endOfMonth.toISOString();

      const res = await fetch(
        `/api/ModuleCSR/Dashboard/Customer?startDate=${finalStartDate}&endDate=${finalEndDate}&ReferenceID=${ReferenceID}&Role=${Role}`
      );
      const data = await res.json();
      if (res.ok) {
        setGenderData(data);
      }
    };

    fetchGenderData();
  }, [startDate, endDate, ReferenceID, Role]); // Added dependencies

  const pieChartData = {
    labels: genderData ? genderData.map((item: any) => item._id) : [],
    datasets: [
      {
        data: genderData ? genderData.map((item: any) => item.count) : [],
        backgroundColor: ["#0B293F", "#332753", "#4C0000", "#1B360D"],
        borderColor: "#fff",
        borderWidth: 1,
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
          <strong>Pie chart</strong> showing the count of <strong>customer statuses</strong> in the dataset. It updates
          dynamically based on <strong>start</strong> and <strong>end dates</strong>. "Loading data..." is shown during fetch,
          and "No data available" appears if there's no data.
        </p>

        {genderData ? (
          <Pie data={pieChartData} options={pieChartOptions} plugins={[ChartDataLabels]} />
        ) : (
          <p className="text-center text-white text-xs">Loading data...</p>
        )}
      </div>
    </div>
  );
};

export default CustomerChart;
