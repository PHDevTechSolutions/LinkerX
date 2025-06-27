import React, { useMemo, useState, useRef } from "react";

export interface SalesRecord {
  projectname: string;
  quotationamount: number;
  actualsales: number;
}

interface ProjectAnalysisProps {
  records: SalesRecord[];
}

const COLORS = {
  actual: "#82ca9d",
  quotation: "#8884d8",
};

const BAR_HEIGHT = 24;
const BAR_GAP = 10;
const NAME_WIDTH = 200;

const ProjectAnalysis: React.FC<ProjectAnalysisProps> = ({ records }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    data: any;
    visible: boolean;
  }>({ x: 0, y: 0, data: null, visible: false });

  const aggregatedData = useMemo(() => {
    const map: Record<string, { totalQuotation: number; totalActualSales: number }> = {};
    records.forEach(({ projectname, quotationamount, actualsales }) => {
      if (!projectname) return;
      if (!map[projectname]) {
        map[projectname] = { totalQuotation: 0, totalActualSales: 0 };
      }
      map[projectname].totalQuotation += quotationamount;
      map[projectname].totalActualSales += actualsales;
    });
    return Object.entries(map)
      .map(([projectname, data]) => ({
        projectname,
        totalQuotation: data.totalQuotation,
        totalActualSales: data.totalActualSales,
      }))
      .sort((a, b) => b.totalActualSales - a.totalActualSales);
  }, [records]);

  const maxValue =
    Math.max(...aggregatedData.flatMap((d) => [d.totalActualSales, d.totalQuotation])) || 1;

  const totalHeight = aggregatedData.length * (BAR_HEIGHT + BAR_GAP) + 40;

  return (
    <section className="border p-4 rounded-md shadow-md">
      <h2 className="text-sm font-semibold mb-4 text-gray-800">Top Projects by Sales</h2>
      <div ref={containerRef} className="relative w-full bg-white">
        <svg width="100%" height={totalHeight}>
          {aggregatedData.map((data, index) => {
            const y = index * (BAR_HEIGHT + BAR_GAP) + 20;
            const actualWidth = (data.totalActualSales / maxValue) * 100;
            const quotationWidth = (data.totalQuotation / maxValue) * 100;

            return (
              <g
                key={index}
                transform={`translate(0, ${y})`}
                onMouseEnter={(e) => {
                  const containerRect = containerRef.current?.getBoundingClientRect();
                  setTooltip({
                    x: e.clientX - (containerRect?.left || 0) + 10,
                    y: e.clientY - (containerRect?.top || 0) - 10,
                    data,
                    visible: true,
                  });
                }}
                onMouseMove={(e) => {
                  const containerRect = containerRef.current?.getBoundingClientRect();
                  setTooltip((prev) => ({
                    ...prev,
                    x: e.clientX - (containerRect?.left || 0) + 10,
                    y: e.clientY - (containerRect?.top || 0) - 10,
                  }));
                }}
                onMouseLeave={() => setTooltip({ ...tooltip, visible: false })}
              >
                {/* Row */}
                <foreignObject x={0} y={0} width="100%" height={BAR_HEIGHT}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: BAR_HEIGHT,
                      paddingLeft: "8px",
                      fontSize: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: NAME_WIDTH,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        marginRight: "8px",
                        color: "#374151",
                      }}
                    >
                      {data.projectname}
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
                      <div
                        style={{
                          width: `${actualWidth}%`,
                          height: "8px",
                          backgroundColor: COLORS.actual,
                          borderRadius: "4px",
                        }}
                      />
                      <div
                        style={{
                          width: `${quotationWidth}%`,
                          height: "8px",
                          backgroundColor: COLORS.quotation,
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {tooltip.visible && (
          <div
            className="absolute bg-white border border-gray-200 rounded-md shadow-md p-2 text-xs z-50 pointer-events-none"
            style={{
              top: tooltip.y,
              left: tooltip.x,
              minWidth: "180px",
            }}
          >
            <div className="font-semibold text-gray-800 mb-1">{tooltip.data.projectname}</div>
            <div className="text-green-600">
              Actual Sales: {tooltip.data.totalActualSales.toLocaleString()}
            </div>
            <div className="text-purple-600">
              Quotation: {tooltip.data.totalQuotation.toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-3 text-xs text-gray-700">
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded-sm" style={{ backgroundColor: COLORS.actual }} />
          Actual Sales
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded-sm" style={{ backgroundColor: COLORS.quotation }} />
          Quotation Amount
        </div>
      </div>
    </section>
  );
};

export default ProjectAnalysis;
