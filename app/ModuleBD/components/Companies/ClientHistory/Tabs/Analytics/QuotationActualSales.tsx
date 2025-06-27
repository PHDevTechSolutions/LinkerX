import React, { useMemo, useState, useRef, useEffect } from "react";

export interface SalesRecord {
  date_created: string;
  quotationamount: number;
  actualsales: number;
}

interface QuotationActualSalesProps {
  records: SalesRecord[];
}

interface DataPoint {
  month: string;
  quotationTotal: number;
  actualTotal: number;
  conversionRate: number;
}

const height = 300;
const margin = { top: 20, right: 70, bottom: 60, left: 60 };

const QuotationActualSales: React.FC<QuotationActualSalesProps> = ({ records }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prepare data grouped by month
  const data: DataPoint[] = useMemo(() => {
    const grouped: Record<
      string,
      { quotationTotal: number; actualTotal: number; conversionRate: number }
    > = {};

    records.forEach(({ date_created, quotationamount, actualsales }) => {
      if (!date_created) return;
      const month = new Date(date_created).toISOString().slice(0, 7); // YYYY-MM
      if (!grouped[month])
        grouped[month] = { quotationTotal: 0, actualTotal: 0, conversionRate: 0 };
      grouped[month].quotationTotal += quotationamount;
      grouped[month].actualTotal += actualsales;
    });

    Object.entries(grouped).forEach(([month, vals]) => {
      vals.conversionRate = vals.quotationTotal
        ? vals.actualTotal / vals.quotationTotal
        : 0;
    });

    return Object.entries(grouped)
      .map(([month, vals]) => ({
        month,
        quotationTotal: vals.quotationTotal,
        actualTotal: vals.actualTotal,
        conversionRate: vals.conversionRate,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [records]);

  // Scales
  const xScale = (index: number) =>
    margin.left + (index * (width - margin.left - margin.right)) / (data.length - 1 || 1);

  const maxAmount = Math.max(
    ...data.map((d) => Math.max(d.quotationTotal, d.actualTotal)),
    100
  );

  const yScaleAmount = (val: number) =>
    margin.top + ((maxAmount - val) * (height - margin.top - margin.bottom)) / maxAmount;

  const yScaleConv = (val: number) =>
    margin.top + ((1 - val) * (height - margin.top - margin.bottom));

  const getSmoothLinePath = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return "";
    let d = `M${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const cp1x = (p0.x + p1.x) / 2;
      const cp1y = p0.y;
      const cp2x = (p0.x + p1.x) / 2;
      const cp2y = p1.y;
      d += ` C${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const linePath = (key: keyof DataPoint, yScale: (v: number) => number) => {
    if (data.length === 0) return "";
    const points = data.map((d, i) => ({
      x: xScale(i),
      y: yScale(d[key] as number),
    }));
    return getSmoothLinePath(points);
  };

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const formatMonth = (monthStr: string) => {
    const d = new Date(monthStr + "-01");
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
  };

  // Legend data
  const legendItems = [
    { color: "#8884d8", label: "Quotation Total" },
    { color: "#82ca9d", label: "Actual Sales" },
    { color: "#ffc658", label: "Conversion Rate" },
  ];

  return (
    <section ref={containerRef} style={{ width: "100%" }} className="border p-4 rounded-md shadow-md">
      <h2 className="text-sm font-semibold mb-4">
        Conversion Rate (Quotation vs Actual Sales)
      </h2>
      <svg
        width={width}
        height={height}
        style={{ overflow: "visible" }}
      >
        {/* Axes */}
        <line
          x1={margin.left}
          y1={height - margin.bottom}
          x2={width - margin.right}
          y2={height - margin.bottom}
          stroke="#333"
        />
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={height - margin.bottom}
          stroke="#333"
        />
        <line
          x1={width - margin.right}
          y1={margin.top}
          x2={width - margin.right}
          y2={height - margin.bottom}
          stroke="#333"
        />

        {/* X axis labels */}
        {data.map((d, i) => {
          const x = xScale(i);
          return (
            <text
              key={d.month}
              x={x}
              y={height - margin.bottom + 20}
              textAnchor="middle"
              fontSize={12}
              fill="#333"
              style={{ userSelect: "none" }}
            >
              {formatMonth(d.month)}
            </text>
          );
        })}

        {/* Y axis left labels (amount) */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const val = t * maxAmount;
          const y = yScaleAmount(val);
          return (
            <g key={t}>
              <text
                x={margin.left - 10}
                y={y + 4}
                fontSize={11}
                textAnchor="end"
                fill="#333"
                style={{ userSelect: "none" }}
              >
                {Math.round(val).toLocaleString()}
              </text>
              <line
                x1={margin.left - 5}
                y1={y}
                x2={margin.left}
                y2={y}
                stroke="#333"
              />
            </g>
          );
        })}

        {/* Y axis right labels (conversion rate %) */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = yScaleConv(t);
          return (
            <g key={t}>
              <text
                x={width - margin.right + 10}
                y={y + 4}
                fontSize={11}
                textAnchor="start"
                fill="#333"
                style={{ userSelect: "none" }}
              >
                {(t * 100).toFixed(0)}%
              </text>
              <line
                x1={width - margin.right}
                y1={y}
                x2={width - margin.right + 5}
                y2={y}
                stroke="#333"
              />
            </g>
          );
        })}

        {/* Lines */}
        <path
          d={linePath("quotationTotal", yScaleAmount)}
          fill="none"
          stroke="#8884d8"
          strokeWidth={2}
        />
        <path
          d={linePath("actualTotal", yScaleAmount)}
          fill="none"
          stroke="#82ca9d"
          strokeWidth={2}
        />
        <path
          d={linePath("conversionRate", yScaleConv)}
          fill="none"
          stroke="#ffc658"
          strokeWidth={2}
          strokeDasharray="6 3"
        />

        {/* Circles and tooltips */}
        {data.map((d, i) => {
          const x = xScale(i);
          const yQuotation = yScaleAmount(d.quotationTotal);
          const yActual = yScaleAmount(d.actualTotal);
          const yConv = yScaleConv(d.conversionRate);

          // Tooltip positioning logic: place to right, but if near right edge, place to left
          const tooltipWidth = 160;
          let tooltipX = x + 10;
          if (x + tooltipWidth + 20 > width) {
            tooltipX = x - tooltipWidth - 10;
          }
          // Tooltip vertical position - above highest circle
          const tooltipY = Math.min(yQuotation, yActual, yConv) - 65;

          return (
            <g key={d.month}>
              <circle
                cx={x}
                cy={yQuotation}
                r={hoverIndex === i ? 6 : 4}
                fill="#8884d8"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
              />
              <circle
                cx={x}
                cy={yActual}
                r={hoverIndex === i ? 6 : 4}
                fill="#82ca9d"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
              />
              <circle
                cx={x}
                cy={yConv}
                r={hoverIndex === i ? 6 : 4}
                fill="#ffc658"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
              />

              {hoverIndex === i && (
                <foreignObject
                  x={tooltipX}
                  y={tooltipY}
                  width={tooltipWidth}
                  height={150}
                  pointerEvents="none"
                >
                  <div className="absolute bg-white border border-gray-200 rounded-md shadow-md p-2 text-xs z-50 pointer-events-none">
                    <strong>{formatMonth(d.month)}</strong>
                    <p className="text-indigo-600">Quotation: {d.quotationTotal.toLocaleString()}</p>
                    <p className="text-green-600">Actual Sales: {d.actualTotal.toLocaleString()}</p>
                    <p className="text-yellow-600">Conversion: {(d.conversionRate * 100).toFixed(2)}%</p>
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div
        style={{
          marginTop: 10,
          display: "flex",
          justifyContent: "center",
          gap: 25,
          userSelect: "none",
          fontSize: 12,
        }}
      >
        {legendItems.map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 16,
                height: 16,
                backgroundColor: color,
                borderRadius: label === "Conversion Rate" ? "50%" : 3,
                border: label === "Conversion Rate" ? "2px dashed" : "none",
              }}
            />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuotationActualSales;
