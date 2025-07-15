"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface PurchaseTrendsProps {
  data: { month: string; count: number }[];
}

const PurchaseTrends: React.FC<PurchaseTrendsProps> = ({ data }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white text-[12px]">
      <h3 className="text-sm font-semibold mb-2">Purchase Trends Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            style={{ fontSize: "12px" }}
            tickFormatter={(value) => value.toUpperCase()}
          />
          <YAxis style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              fontSize: "12px",
              borderRadius: "0.375rem",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
              backgroundColor: "#ffffff",
            }}
            labelStyle={{ fontSize: "12px", textTransform: "capitalize" }}
            itemStyle={{ fontSize: "12px", textTransform: "capitalize" }}
            formatter={(value: any, name: any) => [value, String(name).toUpperCase()]}
            labelFormatter={(label: any) => String(label).toUpperCase()}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px" }}
            iconType="circle"
            formatter={(value) => value.toUpperCase()}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#00C49F"
            name="Purchase Count"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PurchaseTrends;
