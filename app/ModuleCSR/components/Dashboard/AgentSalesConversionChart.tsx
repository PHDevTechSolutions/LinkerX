import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2"; // Using Bar chart
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Metric {
  userName: string;
  ReferenceID: string;
  Traffic: string;
  Amount: any;
  QtySold: any;
  Status: string;
  createdAt: string;
}

interface AgentSalesConversionProps {
  ReferenceID: string;
  Role: string;
  month: number;
  year: number;
}

const AgentSalesConversion: React.FC<AgentSalesConversionProps> = ({
  ReferenceID,
  Role,
  month,
  year,
}) => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  const referenceIdToNameMap: Record<string, string> = {
    "MQ-CSR-170039": "Quinto, Myra",
    "LM-CSR-809795": "Miguel, Lester",
    "RP-CSR-451122": "Paje, Rikki",
    "SA-CSR-517304": "Almoite, Sharmaine",
    "AA-CSR-785895": "Arendain, Armando",
    "GL-CSR-586725": "Lumabao, Grace",
    "MD-CSR-152985": "Dungso, Mary Grace",
    "LR-CSR-849432": "Leroux Y Xchire",
    "MC-CSR-947264": "Capin, Mark Vincent",
  };

  // Predefined colors for each agent (fixed color set)
  const colorPalette = [
    "#3A7D44", "#27445D", "#71BBB2", "#578FCA", "#9966FF", "#FF9F40",
    "#C9CBCF", "#8B0000", "#008080",
  ];

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(
          `/api/ModuleCSR/Dashboard/AgentSalesConversion?ReferenceID=${ReferenceID}&Role=${Role}&month=${month}&year=${year}`
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();

        // ✅ Filter by month and year
        const filteredData = data.filter((item: Metric) => {
          const createdAtDate = new Date(item.createdAt);
          return (
            createdAtDate.getMonth() + 1 === month &&
            createdAtDate.getFullYear() === year
          );
        });

        setMetrics(filteredData);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [ReferenceID, Role, month, year]);

  // ✅ Group by ReferenceID
  const groupedMetrics: Record<string, Metric[]> = metrics.reduce(
    (acc, metric) => {
      if (!acc[metric.ReferenceID]) {
        acc[metric.ReferenceID] = [];
      }
      acc[metric.ReferenceID].push(metric);
      return acc;
    },
    {} as Record<string, Metric[]>
  );

  // ✅ Calculate totals per agent
  const calculateAgentTotals = (agentMetrics: Metric[]) => {
    const totals = agentMetrics.reduce(
      (acc, metric) => {
        const amount = parseFloat(metric.Amount) || 0;
        acc.totalAmount += amount;
        return acc;
      },
      {
        totalAmount: 0,
      }
    );
    return totals;
  };

  // Prepare data for the bar chart
  const chartData = {
    labels: Object.keys(groupedMetrics).map((refId) => referenceIdToNameMap[refId] || "Unknown"),
    datasets: [
      {
        label: "Amount",
        data: Object.keys(groupedMetrics).map((refId) => {
          const agentMetrics = groupedMetrics[refId];
          const totals = calculateAgentTotals(agentMetrics);
          return totals.totalAmount;
        }),
        backgroundColor: Object.keys(groupedMetrics).map((refId, index) => colorPalette[index % colorPalette.length]), // Assign fixed colors
        borderColor: "#1C4E80", // Customize border color
        borderRadius: 10,
      },
    ],
  };

  return (
    <div className="overflow-x-auto max-h-screen overflow-y-auto">
      {loading ? (
        <p className="text-xs">Loading...</p>
      ) : (
        <div className="max-w-4xl mx-auto">
          {/* Bar chart with horizontal bars */}
          <Bar
            data={chartData}
            options={{
              indexAxis: "y", // Horizontal bar chart
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                datalabels: {
                    color: 'black', // White text color for data labels
                    font: {
                      weight: 'bold' as const, // Use "as const" to explicitly type this as a valid option for font weight
                      size: 8, // Font size for data labels
                    },
                    formatter: function (value: any) {
                      return value; // Display the value directly inside the chart
                    },
                    backgroundColor: 'white', // Set background color of the label
                    borderRadius: 50, // Make the background circular
                    padding: 4, // Add padding inside the circle
                    align: 'center', // Center the label within the circle
                    anchor: 'center', // Anchor the label to the center of the bar
                  },
              },
              scales: {
                x: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Agents Sales Conversion",
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: "Agent Name",
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AgentSalesConversion;
