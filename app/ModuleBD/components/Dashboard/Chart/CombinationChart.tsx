import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface CombinationChartProps {
  data: {
    date: string;
    soCount: number;
    soAmount: number;
    deliveredCount: number;
    deliveredAmount: number;
    conversionRate: number;
    pesoValueRate: number;
  }[];
}

const CombinationChart: React.FC<CombinationChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[350px] p-4 bg-white rounded-lg">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, bottom: 5, left: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: "#ccc" }}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: "#ccc" }}
            tickLine={false}
            // Optional: format ticks (e.g., number format)
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: "#ccc" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              padding: 10,
              fontSize: 12,
            }}
            cursor={{ stroke: "rgba(0,0,0,0.1)", strokeWidth: 2 }}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            wrapperStyle={{ fontSize: 12 }}
          />

          {/* Bars (left Y-axis) */}
          <Bar
            yAxisId="left"
            dataKey="soCount"
            name="SO Count"
            fill="#3B82F6"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            yAxisId="left"
            dataKey="soAmount"
            name="SO Amount"
            fill="#60A5FA"
            radius={[4, 4, 0, 0]}
          />

          {/* Lines (right Y-axis) */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="conversionRate"
            name="Conversion Rate (%)"
            stroke="#10B981"
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="pesoValueRate"
            name="Peso Value Rate (%)"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CombinationChart;
