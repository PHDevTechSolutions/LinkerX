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
  startDate?: string;
  endDate?: string;
}

const Wrapup: React.FC<WrapupProps> = ({ startDate, endDate }) => {
  const [genderData, setGenderData] = useState<{ _id: string; count: number }[]>([]);

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

      try {
        const res = await fetch(`/api/ModuleCSR/Dashboard/Wrapup?startDate=${finalStartDate}&endDate=${finalEndDate}`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setGenderData(data || []);
      } catch (error) {
        console.error("Error fetching gender data:", error);
      }
    };

    fetchGenderData();
  }, [startDate, endDate]); // Now depends on startDate and endDate

  const colors = [
    "#3A7D44", "#27445D", "#71BBB2", "#578FCA", "#9966FF", "#FF9F40",
    "#C9CBCF", "#8B0000", "#008080", "#FFD700", "#DC143C", "#20B2AA",
    "#8A2BE2", "#FF4500", "#00CED1", "#2E8B57", "#4682B4"
  ];

  const labels = [
    "Customer Order", "Customer Inquiry Sales", "Customer Inquiry Non-Sales", "Follow Up Sales",
    "After Sales", "Customer Complaint", "Customer Feedback/Recommendation", "Job Inquiry", "Job Applicants",
    "Supplier/Vendor Product Offer", "Follow Up Non-Sales", "Internal Whistle Blower", "Threats/Extortion/Intimidation", "Prank Call", "Supplier Accreditation Request",
    "Internal Concern", "Others"
  ];

  const barChartData = {
    labels: labels,
    datasets: [
      {
        label: "Wrap Up Count",
        data: labels.map(label => {
          const item = genderData.find(entry => entry._id === label);
          return item ? item.count : 0;
        }),
        backgroundColor: colors,
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const barChartOptions: any = {
    indexAxis: "y", // Horizontal bar chart
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: "Wrap Up",
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
      padding: 30,
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="w-full h-full">
        {genderData.length > 0 ? (
          <Bar data={barChartData} options={barChartOptions} />
        ) : (
          <p className="text-center text-gray-600 text-xs">No data available</p>
        )}
      </div>
    </div>
  );
};

export default Wrapup;
