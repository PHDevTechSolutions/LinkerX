"use client";

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface SummaryCardsProps {
  totalQuotation: number;
  totalSOAmount: number;
  totalActualSales: number;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-300 shadow-lg text-[12px] p-3 rounded">
        <p className="font-semibold mb-1">Summarys</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-gray-700">
            {entry.name}: ₱{entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalQuotation,
  totalSOAmount,
  totalActualSales,
}) => {
  const data = useMemo(
    () => [
      {
        name: "Totals",
        Quotation: totalQuotation,
        SOAmount: totalSOAmount,
        ActualSales: totalActualSales,
      },
    ],
    [totalQuotation, totalSOAmount, totalActualSales]
  );

  return (
    <div className="bg-white shadow rounded-xl p-4 mb-8">
      <h3 className="text-[12px] font-semibold text-center mb-4">
        Sales Summary Overview
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="name" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="Quotation"
            stroke="#34d399"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="SOAmount"
            stroke="#60a5fa"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="ActualSales"
            stroke="#a78bfa"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SummaryCards;
