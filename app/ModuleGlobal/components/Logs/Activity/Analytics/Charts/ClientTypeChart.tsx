// ./Charts/ClientTypeChart.tsx
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

const ClientTypeChart: React.FC<ClientTypeChartProps> = ({ data }) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" fontSize={10} />
          <YAxis allowDecimals={false} fontSize={10} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#10b981" name="TypeClient Count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClientTypeChart;
