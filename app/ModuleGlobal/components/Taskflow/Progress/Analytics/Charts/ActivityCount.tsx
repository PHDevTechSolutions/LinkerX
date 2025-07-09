"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ActivityCountProps {
  data: { name: string; value: number }[];
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

const renderCustomLegend = (props: any) => {
  const { payload, data } = props;
  if (!payload || payload.length === 0) {
    return (
      <div className="flex justify-center mt-2 flex-wrap gap-3">
        {data.map((entry: any, index: number) => (
          <div
            key={`legend-${index}`}
            className="flex items-center space-x-1 bg-white rounded px-2 py-1 text-[12px] shadow-sm"
          >
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: "#00c49f" }}
            />
            <span>{entry.name}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex justify-center mt-2 flex-wrap gap-3">
      {payload.map((entry: any, index: number) => (
        <div
          key={`legend-${index}`}
          className="flex items-center space-x-1 bg-white rounded px-2 py-1 text-[12px] shadow-sm"
        >
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const ActivityCount: React.FC<ActivityCountProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-[12px] font-semibold mb-2">Activity Count per Type</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            fontSize={10}
            interval={0}
            angle={-30}
            textAnchor="end"
          />
          <YAxis fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={(props) => renderCustomLegend({ ...props, data })} />
          <Bar dataKey="value" fill="#00c49f" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityCount;
