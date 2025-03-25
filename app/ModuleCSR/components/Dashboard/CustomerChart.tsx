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

interface CustomerChartProps {
  ReferenceID: string;
  Role: string;
  month: number;
  year: number;
}

const CustomerChart: React.FC<CustomerChartProps> = ({
  ReferenceID,
  Role,
  month,
  year,
}) => {
  const [customerData, setCustomerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch data on component load and when month/year change
  useEffect(() => {
    const fetchCustomerData = async () => {
      setLoading(true);
      try {
        // Build start and end date based on month and year
        const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
        const endDate = new Date(year, month, 0).toISOString().split("T")[0];

        // ✅ Corrected API call with new endpoint and parameters
        const res = await fetch(
          `/api/ModuleCSR/Dashboard/Customer?ReferenceID=${ReferenceID}&Role=${Role}&startDate=${startDate}&endDate=${endDate}`
        );
        const data = await res.json();

        if (res.ok) {
          setCustomerData(data);
        } else {
          setCustomerData(null);
        }
      } catch (error) {
        console.error("❌ Error fetching customer data:", error);
        setCustomerData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [ReferenceID, Role, month, year]);

  // ✅ Prepare chart data
  const pieChartData = {
    labels: customerData ? customerData.map((item: any) => item._id) : [],
    datasets: [
      {
        data: customerData ? customerData.map((item: any) => item.count) : [],
        backgroundColor: ["#0B293F", "#332753", "#4C0000", "#1B360D", "#6D214F"],
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
        text: "Customer Status Distribution",
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
    <div className="flex flex-col justify-center items-center w-full h-full space-y-4">
      {/* Pie Chart */}
      <div className="w-full h-full">
        {loading ? (
          <p className="text-center text-gray-600 text-xs">Loading data...</p>
        ) : customerData && customerData.length > 0 ? (
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

export default CustomerChart;
