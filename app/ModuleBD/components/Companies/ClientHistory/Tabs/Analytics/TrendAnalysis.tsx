import React, { useMemo, useState } from "react";

export interface SalesRecord {
  date_created: string;
  actualsales: number;
  quotationamount: number;
}

interface TrendAnalysisProps {
  records: SalesRecord[];
}

interface DataPoint {
  month: string;
  actualsales: number;
  quotationamount: number;
}

const margin = { top: 30, right: 30, bottom: 70, left: 60 };
const height = 350;

const COLORS = {
  actualsales: "#8884d8",
  quotationamount: "#ffc658",
};

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ records }) => {
  const data: DataPoint[] = useMemo(() => {
    const grouped: Record<string, Omit<DataPoint, "month">> = {};
    records.forEach(({ date_created, actualsales, quotationamount }) => {
      if (!date_created) return;
      const month = new Date(date_created).toISOString().slice(0, 7);
      if (!grouped[month]) grouped[month] = { actualsales: 0, quotationamount: 0 };
      grouped[month].actualsales += actualsales;
      grouped[month].quotationamount += quotationamount;
    });
    return Object.entries(grouped)
      .map(([month, vals]) => ({ month, ...vals }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [records]);

  const [width, setWidth] = React.useState(800);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) setWidth(containerRef.current.offsetWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const barWidth = (width - margin.left - margin.right) / (data.length * 3);
  const maxVal = Math.max(...data.flatMap((d) => [d.actualsales, d.quotationamount]), 100);
  const yScale = (val: number) =>
    height - margin.bottom - (val / maxVal) * (height - margin.top - margin.bottom);

  const [hovered, setHovered] = useState<{ index: number; key: keyof DataPoint } | null>(null);

  const formatMonth = (month: string) => {
    const d = new Date(month + "-01");
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
  };

  const legendItemWidth = 130;
  const totalLegendWidth = Object.keys(COLORS).length * legendItemWidth;

  return (
    <section className="border p-4 rounded-md shadow-md">
      <h2 className="text-sm font-semibold mb-4">Trend Analysis (Monthly)</h2>
      <div ref={containerRef} style={{ width: "100%" }}>
        <svg width={width} height={height} style={{ borderRadius: 4 }}>
          {/* Axes */}
          <line x1={margin.left} y1={margin.top} x2={margin.left} y2={height - margin.bottom} stroke="#333" />
          <line x1={margin.left} y1={height - margin.bottom} x2={width - margin.right} y2={height - margin.bottom} stroke="#333" />

          {/* Y axis */}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const y = yScale(t * maxVal);
            const val = Math.round(t * maxVal).toLocaleString();
            return (
              <g key={t}>
                <text x={margin.left - 10} y={y + 5} fontSize={10} textAnchor="end" fill="#333">
                  {val}
                </text>
                <line x1={margin.left - 5} y1={y} x2={margin.left} y2={y} stroke="#333" />
                <line x1={margin.left} y1={y} x2={width - margin.right} y2={y} stroke="#ddd" strokeDasharray="3 3" />
              </g>
            );
          })}

          {/* X axis */}
          {data.map((d, i) => {
            const x = margin.left + i * barWidth * 3 + barWidth;
            return (
              <text key={d.month} x={x} y={height - margin.bottom + 15} fontSize={11} textAnchor="middle" fill="#333">
                {formatMonth(d.month)}
              </text>
            );
          })}

          {/* Bars */}
          {data.map((d, i) => {
            const baseX = margin.left + i * barWidth * 3;
            const radius = 4;
            return (
              <g key={d.month}>
                {/* actualsales */}
                <rect
                  x={baseX}
                  y={yScale(d.actualsales)}
                  width={barWidth}
                  height={height - margin.bottom - yScale(d.actualsales)}
                  fill={COLORS.actualsales}
                  rx={radius}
                  ry={radius}
                  onMouseEnter={() => setHovered({ index: i, key: "actualsales" })}
                  onMouseLeave={() => setHovered(null)}
                  cursor="pointer"
                />
                {/* quotationamount */}
                <rect
                  x={baseX + barWidth}
                  y={yScale(d.quotationamount)}
                  width={barWidth}
                  height={height - margin.bottom - yScale(d.quotationamount)}
                  fill={COLORS.quotationamount}
                  rx={radius}
                  ry={radius}
                  onMouseEnter={() => setHovered({ index: i, key: "quotationamount" })}
                  onMouseLeave={() => setHovered(null)}
                  cursor="pointer"
                />
              </g>
            );
          })}

          {/* Legend */}
          <g transform={`translate(${(width - totalLegendWidth) / 2}, ${height - margin.bottom + 40})`}>
            {Object.entries(COLORS).map(([key, color], idx) => (
              <g key={key} transform={`translate(${idx * legendItemWidth}, 0)`}>
                <rect width={15} height={15} fill={color} rx={3} ry={3} />
                <text x={20} y={12} fontSize={12} fill="#333" textAnchor="start" style={{ userSelect: "none" }}>
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                </text>
              </g>
            ))}
          </g>

          {/* Tooltip */}
          {hovered && (
            <foreignObject
              x={
                margin.left +
                hovered.index * barWidth * 3 +
                (hovered.key === "actualsales" ? 0 : barWidth)
              }
              y={50}
              width={200}
              height={150}
            >
              <div className="absolute bg-white border border-gray-200 rounded-md shadow-md p-2 text-xs z-50 pointer-events-none">
                <strong>{formatMonth(data[hovered.index].month)}</strong>
                <p className="text-green-600">
                  {hovered.key.charAt(0).toUpperCase() +
                    hovered.key.slice(1).replace(/([A-Z])/g, " $1")}
                  : {data[hovered.index][hovered.key].toLocaleString()}
                </p>
              </div>
            </foreignObject>
          )}
        </svg>
      </div>
    </section>
  );
};

export default TrendAnalysis;
