import React, { useMemo, useState, useRef, useEffect } from "react";

const margin = { top: 30, right: 30, bottom: 60, left: 80 };
const height = 300;
const barColors = ["#8884d8", "#82ca9d"];

const CallStatusBreakDown: React.FC<{ records: { callstatus: string }[] }> = ({ records }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(100);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [tooltipContent, setTooltipContent] = useState<{ status: string; count: number; percent: number } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    records.forEach(({ callstatus }) => {
      if (!callstatus) return;
      counts[callstatus] = (counts[callstatus] || 0) + 1;
    });
    const total = records.length;
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      percent: total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0,
    }));
  }, [records]);

  const maxCount = Math.max(...statusData.map((d) => d.count), 5);
  const maxPercent = 100;

  const rowHeight = (height - margin.top - margin.bottom) / statusData.length;
  const barHeight = rowHeight / 3;

  const mapCountWidth = (val: number) => ((width - margin.left - margin.right) * val) / maxCount;
  const mapPercentWidth = (val: number) => ((width - margin.left - margin.right) * val) / maxPercent;

  const handleMouseEnter = (
    e: React.MouseEvent<SVGRectElement, MouseEvent>,
    i: number
  ) => {
    setHoveredIndex(i);

    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const svgRect = e.currentTarget.getBoundingClientRect();
      setTooltipPos({
        x: svgRect.left - containerRect.left + svgRect.width / 2,
        y: svgRect.top - containerRect.top - 10,
      });
    }

    const d = statusData[i];
    setTooltipContent({
      status: d.status,
      count: d.count,
      percent: d.percent,
    });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setTooltipPos(null);
    setTooltipContent(null);
  };

  return (
    <section className="border p-4 rounded-md shadow-md">
      <h2 className="text-sm font-semibold mb-4">Call Status Breakdown</h2>
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
          {statusData.map((d, i) => {
            const y = margin.top + i * rowHeight + rowHeight / 2 + 5;
            return (
              <text
                key={d.status}
                x={margin.left - 10}
                y={y}
                fontSize={12}
                fill="#555"
                textAnchor="end"
                alignmentBaseline="middle"
                style={{ userSelect: "none" }}
              >
                {d.status}
              </text>
            );
          })}

          {statusData.map((d, i) => {
            const y = margin.top + i * rowHeight;
            const countWidth = mapCountWidth(d.count);
            const percentWidth = mapPercentWidth(d.percent);

            return (
              <g key={d.status}>
                <rect
                  x={margin.left}
                  y={y + rowHeight / 4 - barHeight / 2}
                  width={countWidth}
                  height={barHeight}
                  fill={barColors[0]}
                  rx={3}
                  ry={3}
                  style={{ cursor: "pointer", transition: "width 0.3s ease" }}
                  onMouseEnter={(e) => handleMouseEnter(e, i)}
                  onMouseLeave={handleMouseLeave}
                />
                <rect
                  x={margin.left}
                  y={y + (3 * rowHeight) / 4 - barHeight / 2}
                  width={percentWidth}
                  height={barHeight}
                  fill={barColors[1]}
                  rx={3}
                  ry={3}
                  style={{ cursor: "pointer", transition: "width 0.3s ease" }}
                  onMouseEnter={(e) => handleMouseEnter(e, i)}
                  onMouseLeave={handleMouseLeave}
                />
              </g>
            );
          })}

          <line
            x1={margin.left}
            y1={height - margin.bottom}
            x2={width - margin.right}
            y2={height - margin.bottom}
            stroke="#999"
          />

          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const x = margin.left + t * (width - margin.left - margin.right);
            const val = Math.round(t * maxCount);
            return (
              <g key={t}>
                <line
                  x1={x}
                  y1={height - margin.bottom}
                  x2={x}
                  y2={height - margin.bottom + 5}
                  stroke="#999"
                />
                <text
                  x={x}
                  y={height - margin.bottom + 20}
                  fontSize={12}
                  fill="#555"
                  textAnchor="middle"
                  style={{ userSelect: "none" }}
                >
                  {val}
                </text>
              </g>
            );
          })}

          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const x = margin.left + t * (width - margin.left - margin.right);
            const val = Math.round(t * 100);
            return (
              <g key={"p" + t}>
                <line
                  x1={x}
                  y1={height - margin.bottom + 30}
                  x2={x}
                  y2={height - margin.bottom + 25}
                  stroke="#999"
                />
                <text
                  x={x}
                  y={height - margin.bottom + 45}
                  fontSize={12}
                  fill="#555"
                  textAnchor="middle"
                  style={{ userSelect: "none" }}
                >
                  {val}%
                </text>
              </g>
            );
          })}

          <g transform={`translate(${width / 2 - 100}, ${height - margin.bottom + 60})`}>
            <rect width={15} height={15} fill={barColors[0]} rx={3} ry={3} />
            <text x={20} y={12} fontSize={14} fill="#333">
              Count
            </text>

            <rect x={100} width={15} height={15} fill={barColors[1]} rx={3} ry={3} />
            <text x={120} y={12} fontSize={14} fill="#333">
              Percent (%)
            </text>
          </g>
        </svg>

        {hoveredIndex !== null && tooltipPos && tooltipContent && (
          <div
            className="absolute bg-white border border-gray-200 rounded-md shadow-md p-2 text-xs z-50 pointer-events-none"
            style={{
              position: "absolute",
              left: tooltipPos.x,
              top: tooltipPos.y,
              transform: "translate(-50%, -100%)",
              whiteSpace: "nowrap",
              userSelect: "none",
              zIndex: 10,
            }}
          >
            <div>
              <strong>{tooltipContent.status}</strong>
            </div>
            <div className="text-indigo-600">Count: {tooltipContent.count}</div>
            <div className="text-green-600">Percent: {tooltipContent.percent}%</div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CallStatusBreakDown;
