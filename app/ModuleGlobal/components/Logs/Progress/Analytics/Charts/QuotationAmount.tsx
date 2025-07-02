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

interface QuotationAmountProps {
  quotationPerAgent: { name: string; value: number }[];
}

const QuotationAmount: React.FC<QuotationAmountProps> = ({ quotationPerAgent }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-sm font-semibold mb-2">Quotation Amount by CSR Agent</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={quotationPerAgent}>
          <XAxis
            dataKey="name"
            fontSize={10}
            interval={0}
            angle={-30}
            textAnchor="end"
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default QuotationAmount;
