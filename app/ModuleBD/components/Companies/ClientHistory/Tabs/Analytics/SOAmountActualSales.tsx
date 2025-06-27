import React, { useMemo, useState, useRef, useEffect } from "react";

export interface SalesRecord {
  date_created: string;
  soamount: number;
  actualsales: number;
}

interface SOAmountActualSalesProps {
  records: SalesRecord[];
}

const margin = { top: 30, right: 30, bottom: 70, left: 60 };
const height = 300;
const barWidth = 20;
const barGap = 15;

const COLORS = {
  soAmountTotal: "#8884d8",
  actualsalesTotal: "#82ca9d",
};

const SOAmountActualSales: React.FC<SOAmountActualSalesProps> = ({ records }) => {
  const data = useMemo(() => {
    const grouped: Record<string, { soAmountTotal: number; actualsalesTotal: number }> = {};

    records.forEach(({ date_created, soamount, actualsales }) => {
      if (!date_created) return;
      const month = new Date(date_created).toISOString().slice(0, 7);
      if (!grouped[month]) grouped[month] = { soAmountTotal: 0, actualsalesTotal: 0 };
      grouped[month].soAmountTotal += soamount;
      grouped[month].actualsalesTotal += actualsales;
    });

    return Object.entries(grouped)
      .map(([month, vals]) => ({
        month,
        soAmountTotal: vals.soAmountTotal,
        actualsalesTotal: vals.actualsalesTotal,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [records]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(100);
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) setWidth(containerRef.current.offsetWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const maxValue = Math.max(
    ...data.flatMap((d) => [d.soAmountTotal, d.actualsalesTotal]),
    100
  );

  // scales y values to svg coords
  const yScale = (val: number) => height - margin.bottom - (val / maxValue) * (height - margin.top - margin.bottom);

  // calculate total width needed for bars per month (2 bars + gap)
  const totalBarsWidth = data.length * (barWidth * 2 + barGap);

  const formatMonth = (month: string) => {
    const d = new Date(month + "-01");
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
  };

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="border p-4 rounded-md shadow-md">
      <h2 className="text-sm font-semibold mb-4">SO Amount vs Actual Sales</h2>
      <div ref={containerRef} style={{ width: "100%", overflowX: "auto" }}>
        <svg width={Math.max(width, totalBarsWidth + margin.left + margin.right)} height={height} style={{ background: "#fff", borderRadius: 4 }}>
          {/* Y Axis line */}
          <line x1={margin.left} y1={margin.top} x2={margin.left} y2={height - margin.bottom} stroke="#333" />
          {/* X Axis line */}
          <line x1={margin.left} y1={height - margin.bottom} x2={Math.max(width, totalBarsWidth + margin.left + margin.right) - margin.right} y2={height - margin.bottom} stroke="#333" />

          {/* Y axis ticks & labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const y = yScale(t * maxValue);
            const val = Math.round(t * maxValue).toLocaleString();
            return (
              <g key={t}>
                <text x={margin.left - 10} y={y + 4} fontSize={10} textAnchor="end" fill="#333">{val}</text>
                <line x1={margin.left - 5} y1={y} x2={margin.left} y2={y} stroke="#333" />
                <line x1={margin.left} y1={y} x2={Math.max(width, totalBarsWidth + margin.left + margin.right) - margin.right} y2={y} stroke="#ddd" strokeDasharray="3 3" />
              </g>
            );
          })}

          {/* Bars */}
          {data.map((d, i) => {
            const xBase = margin.left + i * (barWidth * 2 + barGap);

            const soAmountHeight = height - margin.bottom - yScale(d.soAmountTotal);
            const actualSalesHeight = height - margin.bottom - yScale(d.actualsalesTotal);

            return (
              <g
                key={d.month}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: "pointer" }}
              >
                {/* SO Amount bar */}
                <rect
                  x={xBase}
                  y={yScale(d.soAmountTotal)}
                  width={barWidth}
                  height={soAmountHeight}
                  fill={COLORS.soAmountTotal}
                  opacity={hoveredIndex !== null && hoveredIndex !== i ? 0.5 : 1}
                />
                {/* Actual Sales bar */}
                <rect
                  x={xBase + barWidth}
                  y={yScale(d.actualsalesTotal)}
                  width={barWidth}
                  height={actualSalesHeight}
                  fill={COLORS.actualsalesTotal}
                  opacity={hoveredIndex !== null && hoveredIndex !== i ? 0.5 : 1}
                />
                {/* Month label */}
                <text
                  x={xBase + barWidth}
                  y={height - margin.bottom + 15}
                  fontSize={11}
                  textAnchor="middle"
                  fill="#333"
                >
                  {formatMonth(d.month)}
                </text>
              </g>
            );
          })}

          {/* Tooltip */}
          {hoveredIndex !== null && (
            <foreignObject
              x={margin.left + hoveredIndex * (barWidth * 2 + barGap)}
              y={margin.top}
              width={150}
              height={150}
              pointerEvents="none"
            >
              <div className="absolute bg-white border border-gray-200 rounded-md shadow-md p-2 text-xs z-50 pointer-events-none">
                <strong>{formatMonth(data[hoveredIndex].month)}</strong>
                <p className="text-yellow-600">SO Amount: {data[hoveredIndex].soAmountTotal.toLocaleString()}</p>
                <p className="text-green-600">Actual Sales: {data[hoveredIndex].actualsalesTotal.toLocaleString()}</p>
              </div>
            </foreignObject>
          )}

          {/* Legend - centered */}
          <g transform={`translate(${(Math.max(width, totalBarsWidth + margin.left + margin.right) / 2)}, ${height - margin.bottom + 50})`}>
            {Object.entries(COLORS).map(([key, color], idx, arr) => (
              <g key={key} transform={`translate(${(idx - (arr.length - 1) / 2) * 150}, 0)`}>
                <rect width={15} height={15} fill={color} rx={3} ry={3} />
                <text
                  x={20}
                  y={12}
                  fontSize={12}
                  fill="#333"
                  textAnchor="start"
                  style={{ userSelect: "none" }}
                >
                  {key === "soAmountTotal" ? "SO Amount" : "Actual Sales"}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </section>
  );
};

export default SOAmountActualSales;
