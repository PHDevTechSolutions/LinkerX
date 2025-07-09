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

// Custom tooltip
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
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

// Custom legend (centered)
const renderLegend = (props: any) => {
  const { payload } = props;
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

interface AnalyticsProps {
  data: { date: string; Login: number; Logout: number }[];
}

const Analytics: React.FC<AnalyticsProps> = ({ data }) => {
  return (
    <div className="h-96 mt-4 text-[12px] border p-4 rounded-md shadow-md">
      <h2 className="text-sm font-semibold mb-2">Sessions Chart</h2>
      {data.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Login" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Logout" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          {renderLegend({ payload: [
            { value: "Login", color: "#4f46e5" },
            { value: "Logout", color: "#f59e0b" }
          ] })}
        </>
      ) : (
        <div className="text-center text-gray-500">No report data available</div>
      )}
    </div>
  );
};

export default Analytics;
