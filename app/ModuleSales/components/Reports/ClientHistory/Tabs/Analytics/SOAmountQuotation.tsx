import React, { useMemo, useState, useRef, useEffect } from "react";

export interface SalesRecord {
  date_created: string;
  quotationamount: number;
  soamount: number;
}

interface SOAmountQuotationProps {
  records: SalesRecord[];
}

interface DataPoint {
  month: string;
  quotationTotal: number;
  soAmountTotal: number;
  conversionRate: number;
}

const margin = { top: 30, right: 30, bottom: 70, left: 60 };
const height = 300;

const COLORS = {
  quotationTotal: "#8884d8",
  soAmountTotal: "#82ca9d",
  conversionRate: "#ffc658",
};

// Helper to create smooth Bezier curve path (monotone-like)
function getCurvePath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";

  const linePath = [`M${points[0].x},${points[0].y}`];

  // Calculate control points for smooth curve
  // Using Catmull-Rom to Bezier spline conversion
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;

    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    linePath.push(
      `C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`
    );
  }

  return linePath.join(" ");
}

const SOAmountQuotation: React.FC<SOAmountQuotationProps> = ({ records }) => {
  const data: DataPoint[] = useMemo(() => {
    const grouped: Record<string, Omit<DataPoint, "month">> = {};
    records.forEach(({ date_created, quotationamount, soamount }) => {
      if (!date_created) return;
      const month = new Date(date_created).toISOString().slice(0, 7);
      if (!grouped[month]) grouped[month] = { quotationTotal: 0, soAmountTotal: 0, conversionRate: 0 };
      grouped[month].quotationTotal += quotationamount;
      grouped[month].soAmountTotal += soamount;
    });
    Object.entries(grouped).forEach(([month, vals]) => {
      vals.conversionRate = vals.quotationTotal ? vals.soAmountTotal / vals.quotationTotal : 0;
    });
    return Object.entries(grouped)
      .map(([month, vals]) => ({ month, ...vals }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [records]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(500);
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) setWidth(containerRef.current.offsetWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const maxLeft = Math.max(
    ...data.flatMap((d) => [d.quotationTotal, d.soAmountTotal]),
    100
  );
  const maxRight = Math.max(...data.map((d) => d.conversionRate), 1);

  const yScaleLeft = (val: number) => height - margin.bottom - (val / maxLeft) * (height - margin.top - margin.bottom);
  const yScaleRight = (val: number) => height - margin.bottom - (val / maxRight) * (height - margin.top - margin.bottom);

  const xStep = (width - margin.left - margin.right) / (data.length - 1 || 1);

  const formatMonth = (month: string) => {
    const d = new Date(month + "-01");
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
  };

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Prepare points for each line for the curve path function
  const getPoints = (key: keyof DataPoint, scale: (v: number) => number) =>
    data.map((d, i) => ({ x: margin.left + i * xStep, y: scale(d[key] as number) }));

  return (
    <section className="border p-4 rounded-md shadow-md">
      <h2 className="text-sm font-semibold mb-4">Conversion Rate (SO Amount vs Quotation)</h2>
      <div ref={containerRef} style={{ width: "100%" }}>
        <svg width={width} height={height} style={{ borderRadius: 4, background: "#fff" }}>
          {/* Axes */}
          <line x1={margin.left} y1={margin.top} x2={margin.left} y2={height - margin.bottom} stroke="#333" />
          <line x1={width - margin.right} y1={margin.top} x2={width - margin.right} y2={height - margin.bottom} stroke="#333" />
          <line x1={margin.left} y1={height - margin.bottom} x2={width - margin.right} y2={height - margin.bottom} stroke="#333" />

          {/* Y left ticks and labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const y = yScaleLeft(t * maxLeft);
            const val = Math.round(t * maxLeft).toLocaleString();
            return (
              <g key={`left-tick-${t}`}>
                <text x={margin.left - 10} y={y + 5} fontSize={10} textAnchor="end" fill="#333">{val}</text>
                <line x1={margin.left - 5} y1={y} x2={margin.left} y2={y} stroke="#333" />
                <line x1={margin.left} y1={y} x2={width - margin.right} y2={y} stroke="#ddd" strokeDasharray="3 3" />
              </g>
            );
          })}

          {/* Y right ticks and labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const y = yScaleRight(t * maxRight);
            const val = `${Math.round(t * maxRight * 100)}%`;
            return (
              <g key={`right-tick-${t}`}>
                <text x={width - margin.right + 10} y={y + 5} fontSize={10} textAnchor="start" fill="#333">{val}</text>
                <line x1={width - margin.right} y1={y} x2={width - margin.right + 5} y2={y} stroke="#333" />
              </g>
            );
          })}

          {/* X axis labels */}
          {data.map((d, i) => {
            const x = margin.left + i * xStep;
            return (
              <text key={d.month} x={x} y={height - margin.bottom + 20} fontSize={11} textAnchor="middle" fill="#333">
                {formatMonth(d.month)}
              </text>
            );
          })}

          {/* Lines with curves */}
          <path d={getCurvePath(getPoints("quotationTotal", yScaleLeft))} fill="none" stroke={COLORS.quotationTotal} strokeWidth={2} />
          <path d={getCurvePath(getPoints("soAmountTotal", yScaleLeft))} fill="none" stroke={COLORS.soAmountTotal} strokeWidth={2} />
          <path d={getCurvePath(getPoints("conversionRate", yScaleRight))} fill="none" stroke={COLORS.conversionRate} strokeWidth={2} strokeDasharray="6 3" />

          {/* Dots & Hover */}
          {data.map((d, i) => {
            const x = margin.left + i * xStep;
            return (
              <g key={`dots-${d.month}`}>
                <circle
                  cx={x}
                  cy={yScaleLeft(d.quotationTotal)}
                  r={6}
                  fill={COLORS.quotationTotal}
                  stroke="#fff"
                  strokeWidth={2}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ cursor: "pointer" }}
                />
                <circle
                  cx={x}
                  cy={yScaleLeft(d.soAmountTotal)}
                  r={6}
                  fill={COLORS.soAmountTotal}
                  stroke="#fff"
                  strokeWidth={2}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ cursor: "pointer" }}
                />
                <circle
                  cx={x}
                  cy={yScaleRight(d.conversionRate)}
                  r={6}
                  fill={COLORS.conversionRate}
                  stroke="#fff"
                  strokeWidth={2}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ cursor: "pointer" }}
                />
              </g>
            );
          })}

          {/* Tooltip */}
          {hoveredIndex !== null && (() => {
            const tooltipWidth = 300;
            const tooltipHeight = 150;
            // Compute dot x pos based on hovered index
            const dotX = margin.left + hoveredIndex * xStep;

            // Clamp tooltip x so hindi lumalabas sa left or right edge ng chart
            let tooltipX = dotX - tooltipWidth / 2;
            if (tooltipX < margin.left) tooltipX = margin.left;
            if (tooltipX + tooltipWidth > width - margin.right) tooltipX = width - margin.right - tooltipWidth;

            // Y pos ng tooltip sa itaas ng chart area, pwede i-adjust depende sa gusto mo
            const tooltipY = margin.top;

            return (
              <foreignObject
                x={tooltipX}
                y={tooltipY}
                width={tooltipWidth}
                height={tooltipHeight}
                pointerEvents="none"
              >
                <div className="absolute bg-white border border-gray-200 rounded-md shadow-md p-2 text-xs z-50 pointer-events-none">
                  <strong>{formatMonth(data[hoveredIndex].month)}</strong>
                  <p className="text-indigo-600">
                    Quotation Total: {data[hoveredIndex].quotationTotal.toLocaleString()}
                  </p>
                  <p className="text-orange-600">
                    SO Amount Total: {data[hoveredIndex].soAmountTotal.toLocaleString()}
                  </p>
                  <p className="text-green-600">
                    Conversion Rate: {(data[hoveredIndex].conversionRate * 100).toFixed(2)}%
                  </p>
                </div>
              </foreignObject>
            );
          })()}


          {/* Legend centered */}
          <g transform={`translate(${width / 2}, ${height - margin.bottom + 40})`}>
            {Object.entries(COLORS).map(([key, color], idx, arr) => (
              <g
                key={key}
                transform={`translate(${(idx - (arr.length - 1) / 2) * 150}, 0)`}
              >
                <rect width={15} height={15} fill={color} rx={3} ry={3} />
                <text
                  x={20}
                  y={12}
                  fontSize={12}
                  fill="#333"
                  textAnchor="start"
                  style={{ userSelect: "none" }}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </section>
  );
};

export default SOAmountQuotation;
