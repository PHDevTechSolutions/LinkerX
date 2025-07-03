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

// Custom Tooltip
const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="shadow-md text-[12px] bg-white rounded p-2">
        <p className="font-semibold">{payload[0].name}</p>
        <p className="text-gray-700">Value: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

// Custom Legend Renderer
const renderCustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className="flex justify-center mt-2">
      <ul className="flex flex-wrap justify-center gap-3">
        {payload.map((entry: any, index: number) => (
          <li
            key={`legend-${index}`}
            className="flex items-center space-x-1 bg-white rounded px-2 py-1 text-[12px] shadow-sm"
          >
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const AreaDistributionChart: React.FC<AreaDistributionChartProps> = ({ data }) => {
  return (
    <div className="w-full h-80 flex flex-col">
      <div className="flex-grow">
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
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2">{renderCustomLegend({ payload: data.map((item, index) => ({ value: item.name, color: COLORS[index % COLORS.length] })) })}</div>
    </div>
  );
};

export default AreaDistributionChart;
