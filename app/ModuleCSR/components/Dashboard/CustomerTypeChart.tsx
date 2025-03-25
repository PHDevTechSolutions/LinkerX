"use client";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from "chart.js";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

interface CustomerTypeChartProps {
  ReferenceID: string;
  Role: string;
}

const CustomerTypeChart: React.FC<CustomerTypeChartProps> = ({ ReferenceID, Role }) => {
  const [customerTypeData, setCustomerTypeData] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(`${new Date().getMonth() + 1}`);
  const [selectedYear, setSelectedYear] = useState<string>(`${new Date().getFullYear()}`);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch data with month and year filters
  useEffect(() => {
    const fetchCustomerTypeData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/ModuleCSR/Dashboard/CustomerType?ReferenceID=${ReferenceID}&Role=${Role}&month=${selectedMonth}&year=${selectedYear}`
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
  }, [selectedMonth, selectedYear, ReferenceID, Role]);

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
      {/* ✅ Month and Year Filters */}
      <div className="flex space-x-4 mb-2">
        {/* Month Filter */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border p-2 rounded text-xs bg-white"
        >
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>

        {/* Year Filter */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border p-2 rounded text-xs bg-white"
        >
          {Array.from({ length: 5 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>

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
