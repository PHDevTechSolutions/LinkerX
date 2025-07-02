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
      <h2 className="text-sm font-semibold mb-2">
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
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActualSales;
