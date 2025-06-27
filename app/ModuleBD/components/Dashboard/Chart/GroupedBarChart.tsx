import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface GroupedBarChartProps {
  data: {
    name: string;
    SO_Done: number;
    Delivered: number;
  }[];
}

const GroupedBarChart: React.FC<GroupedBarChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[320px] p-4 bg-white rounded-lg">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
          barCategoryGap={16}
        >
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: "#ccc" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10 }}
            axisLine={{ stroke: "#ccc" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              padding: 10,
              fontSize: 12,
            }}
            cursor={{ fill: "rgba(0,0,0,0.05)" }}
          />
          <Bar
            dataKey="SO_Done"
            fill="#3b82f6" // blue
            name="SO-Done"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="Delivered"
            fill="#10b981" // green
            name="Delivered"
            radius={[4, 4, 0, 0]}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            wrapperStyle={{ bottom: 0, fontSize: 12 }}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GroupedBarChart;
