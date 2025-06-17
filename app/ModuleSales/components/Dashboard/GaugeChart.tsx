import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface GaugeChartProps {
  value: number; // percentage 0-100
  label: string;
  size?: number;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ value, label, size = 150 }) => {
  const data = [
    { name: "progress", value: value },
    { name: "remaining", value: 100 - value },
  ];

  const COLORS = ["#00C49F", "#E0E0E0"]; // green progress, gray background

  return (
    <div style={{ width: size, height: size, textAlign: "center", margin: "0 auto" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            startAngle={180}
            endAngle={0}
            data={data}
            innerRadius={size * 0.4}
            outerRadius={size * 0.5}
            paddingAngle={5}
            dataKey="value"
            cornerRadius={10}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div style={{ marginTop: -size * 0.25 }}>
        <div style={{ fontSize: 24, fontWeight: "bold" }}>{value.toFixed(2)}%</div>
        <div style={{ fontSize: 14, color: "#666" }}>{label}</div>
      </div>
    </div>
  );
};
