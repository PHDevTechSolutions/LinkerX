"use client";

import React, { useState } from "react";

interface Post {
  companyname: string;
  source: string;
}

interface SourceProps {
  filteredAccounts: Post[];
}

interface DataItem {
  source: string;
  count: number;
  color: string;
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
  "#ec4899",
  "#22d3ee",
  "#eab308",
];

const CustomTooltip = ({
  visible,
  x,
  y,
  source,
  count,
}: {
  visible: boolean;
  x: number;
  y: number;
  source: string;
  count: number;
}) => {
  if (!visible) return null;
  return (
    <div
      className="bg-white border border-gray-200 rounded-md shadow-md p-2 text-xs z-50 pointer-events-none"
      style={{
        position: "fixed",
        top: y - 50,
        left: x + 20,
      }}
    >
      <p className="font-semibold text-gray-800 text-xs">{source}</p>
      <p className="text-cyan-500 font-semibold text-xs">Count: {count}</p>
    </div>
  );
};

const Source: React.FC<SourceProps> = ({ filteredAccounts }) => {
  // Filter valid accounts
  const validAccounts = filteredAccounts.filter(
    (post) =>
      post.source &&
      post.source.toLowerCase() !== "n/a" &&
      post.source.toLowerCase() !== "none"
  );

  // Group by source and count
  const sourceCount: Record<string, number> = {};
  validAccounts.forEach(({ source }) => {
    sourceCount[source] = (sourceCount[source] || 0) + 1;
  });

  // Transform to array and assign colors
  const data: DataItem[] = Object.entries(sourceCount).map(([source, count], i) => ({
    source,
    count,
    color: COLORS[i % COLORS.length],
  }));

  // Max count for bar width scaling
  const maxCount = Math.max(...data.map((d) => d.count), 0);

  // Total count of all sources
  const totalCount = data.reduce((acc, cur) => acc + cur.count, 0);

  // Tooltip state
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    source: string;
    count: number;
  }>({ visible: false, x: 0, y: 0, source: "", count: 0 });

  return (
    <section className="bg-white shadow-md rounded-lg overflow-hidden p-6 select-none">
      {/* Header / Title */}
      <h2 className="text-sm font-bold text-gray-800 mb-4">Source Breakdown</h2>

      <div className="flex gap-8">
        {/* Chart area */}
        <div className="flex-1 relative" style={{ minWidth: 0, height: 400 }}>
          {/* Y-axis label */}
          <div
            className="absolute font-semibold text-gray-700 text-xs"
            style={{
              top: "50%",
              left: -40,
              transform: "translate(-100%, -50%) rotate(-90deg)",
              userSelect: "none",
            }}
          >
            Count
          </div>

          {/* Bars */}
          <div className="h-full flex flex-col gap-3 overflow-auto">
            {data.map(({ source, count, color }) => {
              const widthPercent = maxCount ? (count / maxCount) * 100 : 0;

              return (
                <div
                  key={source}
                  className="flex items-center"
                  style={{ cursor: "pointer" }}
                  onMouseMove={(e) =>
                    setTooltip({
                      visible: true,
                      x: e.clientX,
                      y: e.clientY,
                      source,
                      count,
                    })
                  }
                  onMouseLeave={() =>
                    setTooltip((t) => ({ ...t, visible: false }))
                  }
                >
                  {/* Bar */}
                  <div
                    style={{
                      flexGrow: 1,
                      height: 30,
                      backgroundColor: "#E5E7EB", // Tailwind gray-200
                      borderRadius: 6,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${widthPercent}%`,
                        height: "100%",
                        backgroundColor: color,
                        transition: "width 0.5s ease",
                      }}
                    />
                    {/* Count label inside bar if wide enough */}
                    {widthPercent > 15 && (
                      <span
                        style={{
                          position: "absolute",
                          left: 8,
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "white",
                          fontWeight: 600,
                          userSelect: "none",
                          pointerEvents: "none",
                          fontSize: 12,
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </div>

                  {/* Count label outside bar if bar too small */}
                  {widthPercent <= 15 && (
                    <div
                      style={{
                        marginLeft: 8,
                        minWidth: 24,
                        color: "#374151",
                        fontWeight: 600,
                        fontSize: 12,
                        userSelect: "none",
                      }}
                    >
                      {count}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Tooltip */}
          <CustomTooltip {...tooltip} />
        </div>

        {/* Legend */}
        <div
          className="flex flex-col gap-3"
          style={{ minWidth: 160, userSelect: "none" }}
        >
          <h3 className="text-xs font-semibold mb-2">Legend</h3>
          {data.map(({ source, color }) => (
            <div
              key={source}
              className="flex items-center gap-2 text-xs text-gray-700"
            >
              <div
                className="w-5 h-5 rounded"
                style={{ backgroundColor: color }}
              />
              <span>{source}</span>
            </div>
          ))}

          {/* Total Count */}
          <div className="mt-4 pt-4 border-t border-gray-300 text-gray-900 font-semibold text-sm">
            Total Count: {totalCount}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Source;
