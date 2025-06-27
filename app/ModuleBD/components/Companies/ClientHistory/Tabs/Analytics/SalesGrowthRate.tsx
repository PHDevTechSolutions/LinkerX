import React, { useMemo, useState, useRef, useEffect } from "react";

export interface SalesRecord {
  date_created: string;
  quotationamount: number;
  actualsales: number;
}

interface SalesGrowthRateProps {
  records: SalesRecord[];
}

const margin = { top: 30, right: 30, bottom: 70, left: 50 }; // more bottom for legend
const height = 300;

const COLORS = {
  quotationGrowth: "#4f46e5", // Indigo
  actualsalesGrowth: "#10b981", // Green
};

const formatMonth = (month: string) => {
  const d = new Date(month + "-01");
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
};

const SalesGrowthRate: React.FC<SalesGrowthRateProps> = ({ records }) => {
  // Same calculation logic as original
  const monthlyTotals = useMemo(() => {
    const totals: Record<
      string,
      { quotationTotal: number; actualsalesTotal: number }
    > = {};

    records.forEach(({ date_created, quotationamount, actualsales }) => {
      if (!date_created) return;
      const month = new Date(date_created).toISOString().slice(0, 7); // "YYYY-MM"

      if (!totals[month]) {
        totals[month] = { quotationTotal: 0, actualsalesTotal: 0 };
      }
      totals[month].quotationTotal += quotationamount;
      totals[month].actualsalesTotal += actualsales;
    });

    const sortedMonths = Object.keys(totals).sort();

    return sortedMonths.map((month) => ({
      month,
      quotationTotal: totals[month].quotationTotal,
      actualsalesTotal: totals[month].actualsalesTotal,
    }));
  }, [records]);

  const growthRateData = useMemo(() => {
    const data = [];
    for (let i = 0; i < monthlyTotals.length; i++) {
      const current = monthlyTotals[i];
      const prev = i > 0 ? monthlyTotals[i - 1] : null;

      const quotationGrowth =
        prev && prev.quotationTotal !== 0
          ? ((current.quotationTotal - prev.quotationTotal) / prev.quotationTotal) * 100
          : 0;

      const actualsalesGrowth =
        prev && prev.actualsalesTotal !== 0
          ? ((current.actualsalesTotal - prev.actualsalesTotal) / prev.actualsalesTotal) * 100
          : 0;

      data.push({
        month: current.month,
        quotationGrowth: Number(quotationGrowth.toFixed(2)),
        actualsalesGrowth: Number(actualsalesGrowth.toFixed(2)),
      });
    }
    return data;
  }, [monthlyTotals]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(700);
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) setWidth(containerRef.current.offsetWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const values = growthRateData.flatMap((d) => [d.quotationGrowth, d.actualsalesGrowth]);
  const minY = Math.min(...values, -10);
  const maxY = Math.max(...values, 10);

  const xStep = (width - margin.left - margin.right) / (growthRateData.length - 1 || 1);

  const mapX = (i: number) => margin.left + i * xStep;
  const mapY = (val: number) =>
    margin.top + ((maxY - val) / (maxY - minY)) * (height - margin.top - margin.bottom);

  // Function to create smooth SVG path with cubic Bezier curves
  const createSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p = points[i];
      const p2 = points[i + 1];
      const cp1x = p.x + (p2.x - p.x) / 2;
      const cp1y = p.y;
      const cp2x = p.x + (p2.x - p.x) / 2;
      const cp2y = p2.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const quotationPoints = growthRateData.map((d, i) => ({
    x: mapX(i),
    y: mapY(d.quotationGrowth),
  }));
  const actualsalesPoints = growthRateData.map((d, i) => ({
    x: mapX(i),
    y: mapY(d.actualsalesGrowth),
  }));

  // Tooltip
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Legend position centered
  const legendWidth = 320;
  const legendX = margin.left + (width - margin.left - margin.right) / 2 - legendWidth / 2;
  const legendY = height - margin.bottom + 40;

  return (
    <section className="border p-4 rounded-md shadow-md">
      <h2 className="text-sm font-semibold mb-4">
        Sales Growth Rate (Month-over-Month %)
      </h2>
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          overflowX: "auto",
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 12,
          fontFamily: "sans-serif",
          userSelect: "none",
        }}
      >
        <svg
          width={Math.max(width, margin.left + margin.right + growthRateData.length * xStep)}
          height={height}
        >
          {/* Axes */}
          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={height - margin.bottom}
            stroke="#999"
          />
          <line
            x1={margin.left}
            y1={height - margin.bottom}
            x2={Math.max(width, margin.left + margin.right + growthRateData.length * xStep)}
            y2={height - margin.bottom}
            stroke="#999"
          />

          {/* Y ticks */}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const y = margin.top + t * (height - margin.top - margin.bottom);
            const val = Math.round(maxY - t * (maxY - minY));
            return (
              <g key={t}>
                <line x1={margin.left - 5} y1={y} x2={margin.left} y2={y} stroke="#999" />
                <text
                  x={margin.left - 10}
                  y={y + 4}
                  fontSize={11}
                  fill="#555"
                  textAnchor="end"
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* X axis labels */}
          {growthRateData.map((d, i) => (
            <text
              key={d.month}
              x={mapX(i)}
              y={height - margin.bottom + 20}
              fontSize={11}
              fill="#555"
              textAnchor="middle"
            >
              {formatMonth(d.month)}
            </text>
          ))}

          {/* Areas */}
          <path d={createSmoothPath(quotationPoints) + `L ${quotationPoints[quotationPoints.length-1].x} ${height - margin.bottom} L ${quotationPoints[0].x} ${height - margin.bottom} Z`} fill={COLORS.quotationGrowth} fillOpacity={0.3} />
          <path d={createSmoothPath(actualsalesPoints) + `L ${actualsalesPoints[actualsalesPoints.length-1].x} ${height - margin.bottom} L ${actualsalesPoints[0].x} ${height - margin.bottom} Z`} fill={COLORS.actualsalesGrowth} fillOpacity={0.3} />

          {/* Curved Lines */}
          <path
            d={createSmoothPath(quotationPoints)}
            fill="none"
            stroke={COLORS.quotationGrowth}
            strokeWidth={2}
          />
          <path
            d={createSmoothPath(actualsalesPoints)}
            fill="none"
            stroke={COLORS.actualsalesGrowth}
            strokeWidth={2}
          />

          {/* Dots */}
          {growthRateData.map((d, i) => {
            const x = mapX(i);
            const yQ = mapY(d.quotationGrowth);
            const yA = mapY(d.actualsalesGrowth);
            return (
              <g key={d.month}>
                <circle
                  cx={x}
                  cy={yQ}
                  r={5}
                  fill={COLORS.quotationGrowth}
                  stroke="#fff"
                  strokeWidth={1}
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                  style={{ cursor: "pointer" }}
                />
                <circle
                  cx={x}
                  cy={yA}
                  r={5}
                  fill={COLORS.actualsalesGrowth}
                  stroke="#fff"
                  strokeWidth={1}
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                  style={{ cursor: "pointer" }}
                />
              </g>
            );
          })}

          {/* Legend - centered */}
          <g transform={`translate(${legendX}, ${legendY})`} fontSize={13} fill="#333">
            <rect width={15} height={15} fill={COLORS.quotationGrowth} rx={3} ry={3} />
            <text x={20} y={12} fontSize={12}>Quotation Growth</text>

            <rect x={160} width={15} height={15} fill={COLORS.actualsalesGrowth} rx={3} ry={3} />
            <text x={185} y={12} fontSize={12}>Actual Sales Growth</text>
          </g>
        </svg>

        {/* Tooltip */}
        {hoverIndex !== null && (
          <div
            style={{
              position: "absolute",
              top: margin.top - 60,
              left: mapX(hoverIndex) - 60,
              backgroundColor: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              borderRadius: 6,
              padding: "8px 12px",
              fontSize: 12,
              pointerEvents: "none",
              userSelect: "none",
              whiteSpace: "nowrap",
              color: "#222",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: 4 }}>
              {formatMonth(growthRateData[hoverIndex].month)}
            </div>
            <div style={{ color: COLORS.quotationGrowth }}>
              Quotation: {growthRateData[hoverIndex].quotationGrowth}%
            </div>
            <div style={{ color: COLORS.actualsalesGrowth }}>
              Actual Sales: {growthRateData[hoverIndex].actualsalesGrowth}%
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SalesGrowthRate;
