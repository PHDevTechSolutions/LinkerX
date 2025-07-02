import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface SourceByTypeClientChartProps {
  data: {
    source: string;
    [typeClient: string]: string | number;
  }[];
  typeClients: string[];
}

const colors = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

const SourceByTypeClientChart: React.FC<SourceByTypeClientChartProps> = ({ data, typeClients }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="source" fontSize={10} />
          <YAxis allowDecimals={false} fontSize={10} />
          <Tooltip />
          <Legend />
          {typeClients.map((type, index) => (
            <Bar key={type} dataKey={type} stackId="a" fill={colors[index % colors.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SourceByTypeClientChart;
