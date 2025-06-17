import React, { useState, useEffect, useRef } from "react";

interface HistogramProps {
  data: number[];
  bins?: number;
  color?: string;
  barGap?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  logScale?: boolean;
  height?: number; // optional fixed height, will fallback to responsive height if not provided
  onBarClick?: (binIndex: number) => void;
}

const Histogram: React.FC<HistogramProps> = ({
  data,
  bins = 10,
  color = "#3B82F6", // blue-500
  barGap = 2,
  xAxisLabel,
  yAxisLabel,
  logScale = false,
  height,
  onBarClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const handleResize = () => {
      setContainerWidth(containerRef.current?.clientWidth || 0);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (data.length === 0)
    return <p className="text-gray-500 text-xs">No data available.</p>;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const binSize = range / bins;

  const counts = new Array(bins).fill(0);
  data.forEach((val) => {
    let binIndex = Math.floor((val - min) / binSize);
    if (binIndex === bins) binIndex = bins - 1;
    counts[binIndex]++;
  });

  const maxCount = Math.max(...counts);

  // Use responsive height if not provided, 40% of container width
  const computedHeight = height ?? Math.floor(containerWidth * 0.4);

  const scaleY = (count: number) => {
    if (logScale) {
      const logMax = Math.log10(maxCount + 1);
      return ((Math.log10(count + 1) / logMax) || 0) * computedHeight;
    } else {
      return (count / maxCount) * computedHeight;
    }
  };

  // Format milliseconds simplified to seconds (if < 1000 ms, show ms)
  const formatInterval = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    const totalSeconds = Math.floor(ms / 1000);
    return `${totalSeconds}s`;
  };

  const getTooltip = (binIndex: number) => {
    const startVal = min + binIndex * binSize;
    const endVal = startVal + binSize;
    const count = counts[binIndex];
    return `${formatInterval(startVal)} - ${formatInterval(endVal)}: ${count}`;
  };

  const barWidth =
    containerWidth > 0 ? (containerWidth - barGap * (bins - 1)) / bins : 0;

  return (
    <div ref={containerRef} className="relative select-none w-full">
      <svg
        width={containerWidth}
        height={computedHeight + 40}
        role="img"
        aria-label="Histogram chart"
      >
        {yAxisLabel && (
          <text
            x={-computedHeight / 2}
            y={15}
            transform="rotate(-90)"
            textAnchor="middle"
            fontSize={12}
            fill="#444"
          >
            {yAxisLabel}
          </text>
        )}

        {counts.map((count, i) => {
          const barHeight = scaleY(count);
          const x = i * (barWidth + barGap);
          const y = computedHeight - barHeight;

          // Dynamic color on hover
          const fillColor = hoveredIndex === i ? "#2563EB" : color;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={fillColor}
                rx={3}
                ry={3}
                style={{
                  cursor: "pointer",
                  transition: "fill 0.3s, height 0.5s ease",
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onBarClick?.(i)}
                aria-label={getTooltip(i)}
                role="img"
              />
              {hoveredIndex === i && (
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  fontSize={11}
                  fill="#000"
                  fontWeight="600"
                >
                  {counts[i]}
                </text>
              )}
            </g>
          );
        })}

        {/* X axis baseline */}
        <line
          x1={0}
          y1={computedHeight}
          x2={containerWidth}
          y2={computedHeight}
          stroke="#aaa"
          strokeWidth={1}
        />

        {/* X axis labels */}
        {counts.map((_, i) => {
          const x = i * (barWidth + barGap) + barWidth / 2;
          const labelVal = min + i * binSize;
          return (
            <text
              key={i}
              x={x}
              y={computedHeight + 15}
              textAnchor="middle"
              fontSize={10}
              fill="#666"
            >
              {formatInterval(labelVal)}
            </text>
          );
        })}

        <text
          x={containerWidth}
          y={computedHeight + 15}
          textAnchor="end"
          fontSize={10}
          fill="#666"
        >
          {formatInterval(max)}
        </text>

        {xAxisLabel && (
          <text
            x={containerWidth / 2}
            y={computedHeight + 35}
            textAnchor="middle"
            fontSize={12}
            fill="#444"
          >
            {xAxisLabel}
          </text>
        )}

        {/* Y axis grid lines and labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = computedHeight - ratio * computedHeight;
          const countVal = logScale
            ? Math.round(Math.pow(10, ratio * Math.log10(maxCount + 1)) - 1)
            : Math.round(ratio * maxCount);

          return (
            <g key={ratio}>
              <line x1={-5} y1={y} x2={0} y2={y} stroke="#aaa" strokeWidth={1} />
              <text x={-7} y={y + 4} textAnchor="end" fontSize={10} fill="#666">
                {countVal}
              </text>
              <line
                x1={0}
                y1={y}
                x2={containerWidth}
                y2={y}
                stroke="#eee"
                strokeWidth={1}
              />
            </g>
          );
        })}
      </svg>

      {hoveredIndex !== null && barWidth > 0 && (
        <div
          role="tooltip"
          style={{
            position: "absolute",
            pointerEvents: "none",
            top: computedHeight - scaleY(counts[hoveredIndex]) - 35,
            left: hoveredIndex * (barWidth + barGap) + barWidth / 2 - 40,
            width: 80,
            backgroundColor: "#1e40af",
            color: "#fff",
            padding: "6px 10px",
            borderRadius: 8,
            fontSize: 12,
            textAlign: "center",
            userSelect: "none",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          {getTooltip(hoveredIndex)}
        </div>
      )}
    </div>
  );
};

export default Histogram;
