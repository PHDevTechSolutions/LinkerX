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

interface ConversionRatesProps {
  data: { name: string; conversion: number }[];
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
        <p className="text-gray-700">
          Conversion Rate: {payload[0].value.toFixed(2)}%
        </p>
      </div>
    );
  }
  return null;
};

const ConversionRates: React.FC<ConversionRatesProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-[12px] font-semibold mb-2">
        Conversion Rate by CSR Agent (%)
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
          <YAxis
            domain={[0, 100]}
            tickFormatter={(tick) => `${tick}%`}
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="conversion" fill="#ff7f50" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConversionRates;
