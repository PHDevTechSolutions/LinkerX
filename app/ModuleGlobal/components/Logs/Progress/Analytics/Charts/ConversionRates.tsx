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

const ConversionRates: React.FC<ConversionRatesProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-sm font-semibold mb-2">
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
          <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
          <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
          <Bar dataKey="conversion" fill="#ff7f50" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConversionRates;
