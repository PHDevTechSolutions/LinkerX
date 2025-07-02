import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AreaDistributionChartProps {
  data: { name: string; value: number }[];
}

const COLORS = [
  "#6366f1",
  "#f97316",
  "#10b981",
  "#ef4444",
  "#3b82f6",
  "#eab308",
  "#14b8a6",
  "#8b5cf6",
];

const AreaDistributionChart: React.FC<AreaDistributionChartProps> = ({ data }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaDistributionChart;
