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
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

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
  const [genderData, setGenderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch gender data based on passed month and year
  useEffect(() => {
    const fetchGenderData = async () => {
      try {
        const res = await fetch(
          `/api/ModuleCSR/Dashboard/Monitoring?ReferenceID=${ReferenceID}&Role=${Role}&month=${month}&year=${year}`
        );
        const data = await res.json();
        if (res.ok) {
          setGenderData(data);
        }
      } catch (error) {
        console.error("Error fetching gender data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenderData();
  }, [month, year, ReferenceID, Role]);

  // Pie chart data
  const pieChartData = {
    labels: genderData ? genderData.map((item: any) => item._id) : [],
    datasets: [
      {
        data: genderData ? genderData.map((item: any) => item.count) : [],
        backgroundColor: ["#B8742C", "#162F0B"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  // Pie chart options
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
        formatter: function (value: any) {
          return value;
        },
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
      {/* Chart Display */}
      <div className="w-full h-full">
        {loading ? (
          <p className="text-center text-gray-600 text-xs">Loading data...</p>
        ) : genderData && genderData.length > 0 ? (
          <Pie
            data={pieChartData}
            options={pieChartOptions}
            plugins={[ChartDataLabels]}
          />
        ) : (
          <p className="text-center text-gray-600 text-xs">No data available</p>
        )}
      </div>
    </div>
  );
};

export default GenderPieChart;
