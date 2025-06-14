import React, { useMemo, useRef, useState, useEffect } from "react";

export interface SalesRecord {
  callback: string; // minutes as string number
  date_created: string;
}

interface LeadTimeResponseAnalysisProps {
  records: SalesRecord[];
}

const margin = { top: 30, right: 30, bottom: 70, left: 50 };
const height = 300;
const barColor = "#8884d8";

const buckets = [
  { label: "0-15 mins", min: 0, max: 15 },
  { label: "16-30 mins", min: 16, max: 30 },
  { label: "31-60 mins", min: 31, max: 60 },
  { label: "1-4 hrs", min: 61, max: 240 },
  { label: ">4 hrs", min: 241, max: Infinity },
];

const LeadTimeResponseAnalysis: React.FC<LeadTimeResponseAnalysisProps> = ({
  records,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(700);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) setWidth(containerRef.current.offsetWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Group records into buckets
  const bucketData = useMemo(() => {
    const counts = buckets.map(() => 0);

    records.forEach(({ callback }) => {
      const time = Number(callback);
      if (isNaN(time)) return;

      for (let i = 0; i < buckets.length; i++) {
        if (time >= buckets[i].min && time <= buckets[i].max) {
          counts[i]++;
          break;
        }
      }
    });

    return buckets.map((bucket, i) => ({
      label: bucket.label,
      count: counts[i],
    }));
  }, [records]);

  const maxCount = Math.max(...bucketData.map((d) => d.count), 5);

  const chartWidth = width - margin.left - margin.right;
  const barWidth = chartWidth / bucketData.length / 2;
  const gap = (chartWidth / bucketData.length) * 0.5;

  const mapY = (value: number) =>
    margin.top + ((maxCount - value) / maxCount) * (height - margin.top - margin.bottom);

  // Handler for mouse enter
  const handleMouseEnter = (
    e: React.MouseEvent<SVGRectElement, MouseEvent>,
    i: number
  ) => {
    setHoveredIndex(i);
    // Get SVG rect position relative to container for tooltip positioning
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const svgRect = e.currentTarget.getBoundingClientRect();
      setTooltipPos({
        x: svgRect.left - containerRect.left + svgRect.width / 2,
        y: svgRect.top - containerRect.top - 10,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setTooltipPos(null);
  };

  return (
    <section className="border p-4 rounded-md shadow-md">
      <h2 className="text-sm font-semibold mb-4">Lead Response Time Analysis</h2>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 12,
          userSelect: "none",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <svg width={width} height={height}>
          {/* Y axis */}
          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={height - margin.bottom}
            stroke="#999"
          />
          {/* X axis */}
          <line
            x1={margin.left}
            y1={height - margin.bottom}
            x2={width - margin.right}
            y2={height - margin.bottom}
            stroke="#999"
          />

          {/* Y ticks and labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const y = margin.top + t * (height - margin.top - margin.bottom);
            const val = Math.round(maxCount - t * maxCount);
            return (
              <g key={t}>
                <line x1={margin.left - 5} y1={y} x2={margin.left} y2={y} stroke="#999" />
                <text
                  x={margin.left - 10}
                  y={y + 4}
                  fontSize={12}
                  fill="#555"
                  textAnchor="end"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {bucketData.map((d, i) => {
            const x = margin.left + i * (barWidth * 2 + gap) + gap;
            const y = mapY(d.count);
            const barHeight = height - margin.bottom - y;
            return (
              <rect
                key={d.label}
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={barColor}
                rx={4}
                ry={4}
                onMouseEnter={(e) => handleMouseEnter(e, i)}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: "pointer" }}
              />
            );
          })}

          {/* X axis labels */}
          {bucketData.map((d, i) => {
            const x = margin.left + i * (barWidth * 2 + gap) + gap + barWidth / 2;
            return (
              <text
                key={d.label}
                x={x}
                y={height - margin.bottom + 20}
                fontSize={12}
                fill="#555"
                textAnchor="middle"
                style={{ userSelect: "none" }}
              >
                {d.label}
              </text>
            );
          })}

          {/* Y axis label */}
          <text
            transform={`translate(${margin.left - 40}, ${height / 2}) rotate(-90)`}
            textAnchor="middle"
            fill="#555"
            fontSize={14}
            style={{ userSelect: "none" }}
          >
            Number of Leads
          </text>

          {/* Legend centered */}
          <g transform={`translate(${width / 2 - 70}, ${height - margin.bottom + 50})`}>
            <rect width={15} height={15} fill={barColor} rx={3} ry={3} />
            <text x={20} y={12} fontSize={12} fill="#333">
              Leads Count
            </text>
          </g>
        </svg>

        {/* Tooltip */}
        {hoveredIndex !== null && tooltipPos && (
          <div
            className="absolute bg-white border border-gray-200 rounded-md shadow-md p-2 text-xs z-50 pointer-events-none"
            style={{
              position: "absolute",
              left: tooltipPos.x,
              top: tooltipPos.y,
              transform: "translate(-50%, -100%)",
              fontSize: 12,
              whiteSpace: "nowrap",
              userSelect: "none",
              zIndex: 10,
            }}
          >
            <div>
              <strong className="text-cyan-600">{bucketData[hoveredIndex].label}</strong>
            </div>
            <div className="text-green-600">Leads: {bucketData[hoveredIndex].count}</div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LeadTimeResponseAnalysis;
