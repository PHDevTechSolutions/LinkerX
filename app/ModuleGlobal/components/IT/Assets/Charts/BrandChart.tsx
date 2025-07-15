"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

interface BrandChartProps {
  data: { name: string; value: number }[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="text-xs bg-white rounded shadow-md p-2" style={{ fontSize: "12px" }}>
        <p className="font-semibold">{payload[0].name.toUpperCase()}</p>
        <p>Count: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const renderLegend = (props: any) => {
  const { payload } = props;
  return (
    <ul className="flex flex-wrap justify-center gap-2 text-xs mt-2" style={{ fontSize: "12px" }}>
      {payload.map((entry: any, index: number) => (
        <li key={`legend-${index}`} className="flex items-center gap-1">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          {entry.value.toUpperCase()}
        </li>
      ))}
    </ul>
  );
};

const BrandChart: React.FC<BrandChartProps> = ({ data }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white text-xs" style={{ fontSize: "12px" }}>
      <h3 className="text-sm font-semibold mb-2">Brand Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            innerRadius={50} // gives 3D doughnut effect
            label={({ name }) => name.toUpperCase()}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-brand-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BrandChart;
