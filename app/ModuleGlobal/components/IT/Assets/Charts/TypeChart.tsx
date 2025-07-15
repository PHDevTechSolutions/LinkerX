"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface TypeChartProps {
  data: { name: string; value: number }[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="text-xs bg-white rounded shadow-md p-2" style={{ fontSize: "12px" }}>
        <p className="font-semibold">{payload[0].name}</p>
        <p>Count: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};


const TypeChart: React.FC<TypeChartProps> = ({ data }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white text-xs" style={{ fontSize: "12px" }}>
      <h3 className="text-sm font-semibold mb-2">Asset Type Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" style={{ fontSize: "12px" }} />
          <YAxis style={{ fontSize: "12px" }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill="#0088FE" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TypeChart;
