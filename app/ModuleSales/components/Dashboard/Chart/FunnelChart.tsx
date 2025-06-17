// ./Chart/FunnelChart.tsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface FunnelChartProps {
  data: { name: string; value: number }[];
}

const FunnelChart: React.FC<FunnelChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <XAxis type="number" hide domain={[0, "dataMax"]} />
        <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 14 }} />
        <Tooltip formatter={(value: number) => value.toLocaleString()} />
        <Bar dataKey="value" fill="#4F46E5" barSize={40} radius={[10, 10, 10, 10]}>
          <LabelList
            dataKey="value"
            position="right"
            formatter={(value: number) => value.toLocaleString()}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FunnelChart;
