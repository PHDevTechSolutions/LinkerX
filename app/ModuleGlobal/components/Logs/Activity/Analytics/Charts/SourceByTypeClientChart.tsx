import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface SourceByTypeClientChartProps {
  data: {
    source: string;
    [typeClient: string]: string | number;
  }[];
  typeClients: string[];
}

const colors = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

// Custom Tooltip
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="shadow-md text-[12px] bg-white rounded p-2">
        <p className="font-semibold">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-gray-700">
            {entry.name}: {entry.value}
          </p>
        ))}
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

const SourceByTypeClientChart: React.FC<SourceByTypeClientChartProps> = ({ data, typeClients }) => {
  return (
    <div className="w-full h-80 flex flex-col">
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="source" fontSize={10} />
            <YAxis allowDecimals={false} fontSize={10} />
            <Tooltip content={<CustomTooltip />} />
            {typeClients.map((type, index) => (
              <Bar
                key={type}
                dataKey={type}
                stackId="a"
                fill={colors[index % colors.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2">{renderCustomLegend({ payload: typeClients.map((type, index) => ({ value: type, color: colors[index % colors.length] })) })}</div>
    </div>
  );
};

export default SourceByTypeClientChart;
