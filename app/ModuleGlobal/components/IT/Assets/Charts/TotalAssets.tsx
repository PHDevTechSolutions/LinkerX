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

interface TotalAssetsProps {
  data: { brand: string; total: number }[];
}

const TotalAssets: React.FC<TotalAssetsProps> = ({ data }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white text-[12px]">
      <h3 className="text-sm font-semibold mb-2">Total Asset Value by Brand</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="brand"
            style={{ fontSize: "12px", textTransform: "capitalize" }}
            tickFormatter={(value) => String(value).toUpperCase()}
          />
          <YAxis
            style={{ fontSize: "12px" }}
            tickFormatter={(value) => value.toString().toUpperCase()}
          />
          <Tooltip
            contentStyle={{
              fontSize: "12px",
              borderRadius: "0.375rem",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
              backgroundColor: "#ffffff",
            }}
            labelStyle={{ fontSize: "12px", textTransform: "capitalize" }}
            itemStyle={{ fontSize: "12px", textTransform: "capitalize" }}
            formatter={(value: any, name: any) => [
              `₱${value.toLocaleString()}`,
              String(name).toUpperCase(),
            ]}
            labelFormatter={(label: any) => String(label).toUpperCase()}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", textTransform: "capitalize" }}
            iconType="circle"
            formatter={(value) => value.toUpperCase()}
          />
          <Bar dataKey="total" fill="#8884d8" name="Total Value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TotalAssets;
