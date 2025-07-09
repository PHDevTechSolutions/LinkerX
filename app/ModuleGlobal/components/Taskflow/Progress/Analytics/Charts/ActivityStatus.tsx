"use client";

import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

interface ActivityStatusProps {
  statusDistribution: { name: string; value: number }[];
  colors: string[];
}

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
        <p className="font-semibold mb-1">{payload[0].name}</p>
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

const ActivityStatus: React.FC<ActivityStatusProps> = ({ statusDistribution, colors }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-[12px] font-semibold mb-2">Activity Status Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={statusDistribution}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {statusDistribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderCustomLegend} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityStatus;
