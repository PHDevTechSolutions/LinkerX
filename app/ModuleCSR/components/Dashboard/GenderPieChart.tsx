"use client";

import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, ChartDataLabels);

interface GenderCount {
  _id: "Male" | "Female" | string;
  count: number;
}

interface GenderPieChartProps {
  ReferenceID: string;
  Role: string;
  month: number;
  year: number;
}

const GenderPieChart: React.FC<GenderPieChartProps> = ({
  ReferenceID,
  Role,
  month,
  year,
}) => {
  const [genderData, setGenderData] = useState<GenderCount[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch gender data
  useEffect(() => {
    const fetchGenderData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/ModuleCSR/Dashboard/Monitoring?ReferenceID=${ReferenceID}&Role=${Role}&month=${month}&year=${year}`
        );
        const data = await res.json();
        if (res.ok) {
          setGenderData(Array.isArray(data) ? data : []);
        } else {
          console.error("Failed to fetch gender data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching gender data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenderData();
  }, [month, year, ReferenceID, Role]);

  const pieChartData = {
    labels: genderData.map((item) => item._id),
    datasets: [
      {
        data: genderData.map((item) => item.count),
        backgroundColor: ["#B8742C", "#162F0B"],
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
        text: "Inbound Traffic Per Gender",
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
        color: "#fff",
        font: {
          weight: "bold" as const,
          size: 14,
        },
        formatter: (value: any) => value,
      },
    },
    layout: {
      padding: 2,
    },
    elements: {
      arc: {
        borderWidth: 6,
      },
    },
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full p-4">
      <div className="w-full h-full">
        {loading ? (
          <p className="text-center text-gray-600 text-xs">Loading data...</p>
        ) : genderData.length > 0 ? (
          <Pie data={pieChartData} options={pieChartOptions} />
        ) : (
          <p className="text-center text-gray-600 text-xs">No data available</p>
        )}
      </div>
    </div>
  );
};

export default GenderPieChart;
