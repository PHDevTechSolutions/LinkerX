import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border shadow-md rounded px-3 py-2 text-[12px]">
        <p className="font-semibold mb-1">Hour: {label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-gray-700">
            <span
              className="inline-block w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            Logins: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom centered legend component for Legend content prop
const RenderLegend = (props: any) => {
  const { payload } = props;
  if (!payload) return null;
  return (
    <div className="w-full flex justify-center mt-2 text-[12px]">
      <ul className="flex gap-4">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center gap-1">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            {entry.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

interface Props {
  data: { hour: string; logins: number }[];
}

const PeakLoginTimeChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-96 mt-8 text-[12px] border p-4 rounded-md shadow-md">
      <h2 className="text-sm font-semibold mb-2">Peak Login Times (Hour of Day)</h2>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 40 }} // increased bottom margin for legend
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              content={RenderLegend}
            />
            <Line
              type="monotone"
              dataKey="logins"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Logins"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center text-gray-500">No peak login data available</div>
      )}
    </div>
  );
};

export default PeakLoginTimeChart;
