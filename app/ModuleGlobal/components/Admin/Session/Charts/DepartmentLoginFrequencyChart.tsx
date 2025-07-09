import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border shadow-md rounded px-3 py-2 text-[12px]">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-gray-700">
            <span
              className="inline-block w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom centered legend component for Legend's content prop
const RenderLegend = (props: any) => {
  const { payload } = props;
  if (!payload) return null;
  return (
    <div className="w-full flex justify-center mt-2 text-[12px] capitalize">
      <ul className="flex gap-4">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center gap-1">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            {entry.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

interface Props {
  data: { department: string; logins: number }[];
}

const DepartmentLoginFrequencyChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-80 mt-8 text-[12px] border p-4 rounded-md shadow-md">
      <h2 className="text-sm font-semibold mb-2">Login Frequency by Department</h2>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 0, bottom: 50 }} // increased bottom margin
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              dataKey="department"
              type="category"
              width={80}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={5}
              content={RenderLegend}
            />
            <Bar dataKey="logins" fill="#2563eb" radius={[6, 6, 6, 6]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center text-gray-500">No department login data available</div>
      )}
    </div>
  );
};

export default DepartmentLoginFrequencyChart;
