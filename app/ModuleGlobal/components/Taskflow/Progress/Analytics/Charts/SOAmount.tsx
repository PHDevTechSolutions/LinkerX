"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SOAmountProps {
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
        <p className="text-gray-700">SO Amount: ₱{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const SOAmount: React.FC<SOAmountProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-[12px] font-semibold mb-2">
        SO Amount by CSR Agent
      </h2>
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
          <Bar dataKey="value" fill="#ffc658" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SOAmount;
