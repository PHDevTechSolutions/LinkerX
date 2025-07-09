"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface Props {
  updatedUser: any[];
}

// Custom Tooltip with styling
const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="shadow-md text-[12px] bg-white rounded p-2">
        <p className="font-semibold mb-1">{payload[0].name}</p>
        <p className="text-gray-700">Sales: ₱{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const ActualSales: React.FC<Props> = ({ updatedUser }) => {
  const salesPerAgent = useMemo(() => {
    const agentMap: Record<string, number> = {};
    updatedUser.forEach((post) => {
      const agent = post.csragent || "Unassigned";
      const sales = Number(post.actualsales) || 0;
      agentMap[agent] = (agentMap[agent] || 0) + sales;
    });
    return Object.entries(agentMap).map(([name, value]) => ({ name, value }));
  }, [updatedUser]);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-[12px] font-semibold mb-2">
        Actual Sales by CSR Agent
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={salesPerAgent}>
          <XAxis
            dataKey="name"
            fontSize={10}
            interval={0}
            angle={-30}
            textAnchor="end"
          />
          <YAxis fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActualSales;
