import React, { useMemo, useRef, useState, useEffect } from "react";

interface SalesRecord {
  date_created: string;
  quotationamount: number;
  actualsales: number;
}

interface SeasonalityProps {
  records: SalesRecord[];
}

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const margin = { top: 30, right: 30, bottom: 60, left: 60 };
const height = 400;
const barColors = ["#8884d8", "#82ca9d"];

const Seasonality: React.FC<SeasonalityProps> = ({ records }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(100);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    month: string;
    quotation: number;
    actual: number;
  } | null>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) setWidth(containerRef.current.offsetWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const monthlyData = useMemo(() => {
    const totals = Array(12).fill(null).map(() => ({
      quotation: 0,
      actual: 0,
      count: 0,
    }));

    records.forEach(({ date_created, quotationamount, actualsales }) => {
      if (!date_created) return;
      const monthIndex = new Date(date_created).getMonth();
      totals[monthIndex].quotation += quotationamount;
      totals[monthIndex].actual += actualsales;
      totals[monthIndex].count += 1;
    });

    return totals.map((tot, idx) => ({
      month: monthNames[idx],
      quotation: tot.quotation,
      actual: tot.actual,
    }));
  }, [records]);

  const maxVal = Math.max(
    ...monthlyData.map((d) => Math.max(d.quotation, d.actual)),
    1
  );

  const barWidth = (width - margin.left - margin.right) / 12 - 10;
  const scaleY = (val: number) => ((height - margin.top - margin.bottom) * val) / maxVal;

  return (
    <section className="border p-4 rounded-md shadow-md">
      <h2 className="text-sm font-semibold mb-4">Seasonality / Monthly Sales Patterns</h2>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: 8,
          userSelect: "none",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <svg width={width} height={height}>
          {/* Bars */}
          {monthlyData.map((d, i) => {
            const x = margin.left + i * (barWidth + 10);
            const quoteHeight = scaleY(d.quotation);
            const actualHeight = scaleY(d.actual);
            const baseY = height - margin.bottom;

            return (
              <g key={d.month}>
                {/* Quotation Bar */}
                <rect
                  x={x}
                  y={baseY - quoteHeight}
                  width={barWidth}
                  height={quoteHeight}
                  fill={barColors[0]}
                  rx={3}
                  ry={3}
                  onMouseEnter={(e) =>
                    setTooltip({
                      x: x + barWidth / 2,
                      y: baseY - quoteHeight - 10,
                      month: d.month,
                      quotation: d.quotation,
                      actual: d.actual,
                    })
                  }
                  onMouseLeave={() => setTooltip(null)}
                />
                {/* Actual Bar */}
                <rect
                  x={x + barWidth / 2}
                  y={baseY - actualHeight}
                  width={barWidth}
                  height={actualHeight}
                  fill={barColors[1]}
                  rx={3}
                  ry={3}
                  onMouseEnter={(e) =>
                    setTooltip({
                      x: x + barWidth,
                      y: baseY - actualHeight - 10,
                      month: d.month,
                      quotation: d.quotation,
                      actual: d.actual,
                    })
                  }
                  onMouseLeave={() => setTooltip(null)}
                />

                {/* X Axis Label */}
                <text
                  x={x + barWidth / 2}
                  y={baseY + 20}
                  textAnchor="middle"
                  fontSize={12}
                  fill="#555"
                >
                  {d.month}
                </text>
              </g>
            );
          })}

          {/* Y Axis line */}
          <line
            x1={margin.left}
            y1={height - margin.bottom}
            x2={width - margin.right}
            y2={height - margin.bottom}
            stroke="#ccc"
          />

          {/* Y Axis ticks */}
          {[0.25, 0.5, 0.75, 1].map((t, i) => {
            const y = height - margin.bottom - t * (height - margin.top - margin.bottom);
            const val = Math.round(maxVal * t);
            return (
              <g key={i}>
                <line
                  x1={margin.left - 5}
                  x2={margin.left}
                  y1={y}
                  y2={y}
                  stroke="#999"
                />
                <text
                  x={margin.left - 10}
                  y={y}
                  fontSize={11}
                  textAnchor="end"
                  alignmentBaseline="middle"
                  fill="#555"
                >
                  {val.toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* Legend */}
          <g transform={`translate(${width / 2 - 80}, ${height - 20})`}>
            <rect width={15} height={15} fill={barColors[0]} rx={3} ry={3} />
            <text x={20} y={12} fontSize={12} fill="#333">
              Quotation
            </text>
            <rect x={110} width={15} height={15} fill={barColors[1]} rx={3} ry={3} />
            <text x={135} y={12} fontSize={12} fill="#333">
              Actual Sales
            </text>
          </g>
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute bg-white border border-gray-200 rounded-md shadow-md p-2 text-xs z-50 pointer-events-none"
            style={{ top: tooltip.y, left: tooltip.x, minWidth: 160 }}
          >
            <div><strong>{tooltip.month}</strong></div>
            <div className="text-indigo-600">Quotation: {tooltip.quotation.toLocaleString()}</div>
            <div className="text-green-600">Actual: {tooltip.actual.toLocaleString()}</div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Seasonality;
