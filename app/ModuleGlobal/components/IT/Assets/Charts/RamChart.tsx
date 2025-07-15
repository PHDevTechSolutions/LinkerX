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

interface RamChartProps {
  rawData: { brand: string; model?: string; ram?: string; type?: string }[];
}

const RamChart: React.FC<RamChartProps> = ({ rawData }) => {
  const groupedData: Record<string, number> = {};

  rawData.forEach((item) => {
    const isValidType = item.type === "Laptop" || item.type === "Desktop";
    if (!isValidType || !item.model) return;

    const key = `${item.brand} ${item.model}`.toUpperCase();
    const ram = parseInt(item.ram || "0");
    if (!isNaN(ram)) {
      groupedData[key] = (groupedData[key] || 0) + ram;
    }
  });

  const chartData = Object.entries(groupedData).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white text-[12px]">
      <h3 className="text-sm font-semibold mb-2">RAM BY BRAND + MODEL (LAPTOP/DESKTOP ONLY)</h3>
      <ResponsiveContainer width="100%" height={Math.max(300, chartData.length * 40)}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            style={{ fontSize: "12px" }}
            tickFormatter={(value) => String(value).toUpperCase()}
          />
          <YAxis
            dataKey="name"
            type="category"
            style={{ fontSize: "12px", textTransform: "uppercase" }}
            tickFormatter={(value) => String(value).toUpperCase()}
            width={160}
          />
          <Tooltip
            contentStyle={{
              fontSize: "12px",
              borderRadius: "0.375rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              backgroundColor: "#ffffff",
            }}
            labelStyle={{ fontSize: "12px", textTransform: "uppercase" }}
            itemStyle={{ fontSize: "12px", textTransform: "uppercase" }}
            formatter={(value: any, name: any) => [value, String(name).toUpperCase()]}
            labelFormatter={(label: any) => String(label).toUpperCase()}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", textTransform: "uppercase" }}
            iconType="circle"
            formatter={(value) => value.toUpperCase()}
          />
          <Bar dataKey="value" fill="#FF8042" name="RAM (GB)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RamChart;
