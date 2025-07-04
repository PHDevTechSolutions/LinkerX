import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border shadow-md rounded px-3 py-2 text-[12px]">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-gray-700">
            <span
              className="inline-block w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            {entry.name}: {entry.value} hrs
          </p>
        ))}
      </div>
    );
  }

  return null;
};

// Custom legend (inside chart container, centered)
const RenderLegend = ({ payload }: { payload?: any[] }) => {
  if (!payload || payload.length === 0) return null;
  return (
    <div className="w-full flex justify-center text-[12px]">
      <ul className="flex gap-4">
        {payload.map((entry, index) => (
          <li key={index} className="flex items-center gap-1">
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
  data: { email: string; hours: number }[];
}

const LoginDurationChart: React.FC<Props> = ({ data }) => {
  const legendPayload = [{ value: "Hours", color: "#10b981" }];

  return (
    <div className="h-96 mt-8 text-[12px] border p-4 rounded-md shadow-md flex flex-col">
      <h2 className="text-sm font-semibold mb-2">Total Hours Per User</h2>
      {data.length > 0 ? (
        <>
          <div style={{ flex: "1 1 auto" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 40 }} // extra bottom margin for legend
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="email" />
                <YAxis unit="h" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="hours" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend inside chart container but below the chart */}
          <RenderLegend payload={legendPayload} />
        </>
      ) : (
        <div className="text-center text-gray-500">No duration data available</div>
      )}
    </div>
  );
};

export default LoginDurationChart;
