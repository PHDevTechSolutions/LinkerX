import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ClientTypeChartProps {
  data: { type: string; count: number }[];
}

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
        <p className="text-gray-700">Count: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

// Custom Legend Renderer
const renderCustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className="flex justify-center items-center w-full">
      <ul className="flex space-x-4">
        {payload.map((entry: any, index: number) => (
          <li
            key={`item-${index}`}
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

const ClientTypeChart: React.FC<ClientTypeChartProps> = ({ data }) => {
  return (
    <div className="w-full h-72 flex flex-col">
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" fontSize={10} />
            <YAxis allowDecimals={false} fontSize={10} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              fill="#10b981"
              name="TypeClient Count"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2">{renderCustomLegend({ payload: [{ value: 'TypeClient Count', color: '#10b981' }] })}</div>
    </div>
  );
};

export default ClientTypeChart;
