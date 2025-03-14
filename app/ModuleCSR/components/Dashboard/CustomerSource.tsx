"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, } from "chart.js";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface CustomerSourceProps {
  startDate?: string;
  endDate?: string;
  ReferenceID: string;
  Role: string;
}

const CustomerSource: React.FC<CustomerSourceProps> = ({ startDate, endDate, ReferenceID, Role }) => {
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
        const res = await fetch(`/api/ModuleCSR/Dashboard/CustomerSource?startDate=${finalStartDate}&endDate=${finalEndDate}&ReferenceID=${ReferenceID}&Role=${Role}`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setGenderData(data || []);
      } catch (error) {
        
      }
    };

    fetchGenderData();
  }, [startDate, endDate, ReferenceID, Role]); // Now depends on startDate and endDate

  const colors = [
    "#A64D79", "#452A00", "#275214", "#578FCA", "#9966FF", "#FF9F40",
    "#C9CBCF", "#8B0000", "#008080", "#FFD700", "#DC143C", "#20B2AA",
    "#8A2BE2", "#FF4500", "#00CED1", "#2E8B57", "#4682B4", "#D2691E"
  ];

  const labels = [
    "FB Ads", "Viber Community / Viber", "Whatsapp Community / Whatsapp", "SMS",
    "Website", "Word of Mouth", "Quotation Docs", "Google Search", "Email Blast",
    "Agent Call", "Catalogue", "Shopee", "Lazada", "Tiktok", "Worldbex",
    "PhilConstruct", "Calendar", "Product Demo"
  ];

  const barChartData = {
    labels: labels,
    datasets: [
      {
        label: "Customer Count",
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
              position: "bottom", // Position the legend at the bottom
              labels: {
                generateLabels: function (chart: ChartJS) { // Add typing here
                  const labels = chart.data.labels as string[]; // Typecasting for labels
                  const datasets = chart.data.datasets as any[]; // Typecasting for datasets
                  return labels.map((label, index) => {
                    const dataset = datasets[0]; // Assuming one dataset, adjust if more
                    const dataValue = dataset.data[index]; // Get the data value for the current label
                    return {
                      text: `${label}: ${dataValue}`, // Modify legend text to include value
                      fillStyle: dataset.backgroundColor[index], // Set the legend color
                      strokeStyle: dataset.borderColor[index], // Set the border color
                      lineWidth: dataset.borderWidth,
                    };
                  });
                },
              },
            },
      title: {
        display: true,
        text: "Where Customers Found Us",
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
        color: '#fff', // White text color for data labels
        font: {
          weight: 'bold' as const, // Use "as const" to explicitly type this as a valid option for font weight
          size: 10, // Font size for data labels
        },
        formatter: function (value: any) {
          return value; // Display the value directly inside the chart
        },
        backgroundColor: 'black', // Set background color of the label
        borderRadius: 50, // Make the background circular
        padding: 4, // Add padding inside the circle
        align: 'center', // Center the label within the circle
        anchor: 'center', // Anchor the label to the center of the bar
      },
    },
    layout: {
      padding: 0,
    },
    scales: {
      x: {
        beginAtZero: true,
        barThickness: 20, // Increase bar thickness for wider bars (adjust value)
        categoryPercentage: 1.0, // Full width for each bar (set to 1 for maximum width)
        barPercentage: 0.8, // Controls the proportion of each category width
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

export default CustomerSource;
