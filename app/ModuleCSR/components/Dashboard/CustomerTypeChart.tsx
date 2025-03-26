"use client";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

interface CustomerTypeChartProps {
  ReferenceID: string;
  Role: string;
  month: number;
  year: number;
}

const CustomerTypeChart: React.FC<CustomerTypeChartProps> = ({
  ReferenceID,
  Role,
  month,
  year,
}) => {
  const [customerTypeData, setCustomerTypeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch data with month and year filters
  useEffect(() => {
    const fetchCustomerTypeData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/ModuleCSR/Dashboard/CustomerType?ReferenceID=${ReferenceID}&Role=${Role}&month=${month}&year=${year}`
        );
        const data = await res.json();
        if (res.ok) {
          setCustomerTypeData(data);
        } else {
          setCustomerTypeData(null);
        }
      } catch (error) {
        console.error("Error fetching customer type data:", error);
        setCustomerTypeData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerTypeData();
  }, [month, year, ReferenceID, Role]);

  // ✅ Prepare chart data
  const doughnutChartData = {
    labels: customerTypeData ? customerTypeData.map((item: any) => item._id) : [],
    datasets: [
      {
        data: customerTypeData ? customerTypeData.map((item: any) => item.count) : [],
        backgroundColor: ["#1B360D", "#744700", "#A64D79", "#332753", "#4C0000"],
        borderColor: "#fff",
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
    cutout: "70%",
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full space-y-4">
      {/* ✅ Doughnut Chart */}
      <div className="w-full h-full">
        {loading ? (
          <p className="text-center text-gray-600 text-xs">Loading data...</p>
        ) : customerTypeData && customerTypeData.length > 0 ? (
          <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
        ) : (
          <p className="text-center text-gray-600 text-xs">No data available</p>
        )}
      </div>
    </div>
  );
};

export default CustomerTypeChart;
