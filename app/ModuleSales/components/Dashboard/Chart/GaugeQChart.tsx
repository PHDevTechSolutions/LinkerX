import React from "react";

interface GaugeChartProps {
  value: number; 
  label: string;
  size?: number; 
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  label,
  size = 120,
  strokeWidth = 10,
  color = "#00C49F",
  backgroundColor = "#E0E0E0",
}) => {
  const radius = size / 2;
  const center = radius;
  const clampedValue = Math.min(100, Math.max(0, value));
  
  // Arc radius adjusted to account for strokeWidth so it fits inside svg viewbox
  const arcRadius = radius - strokeWidth / 2;

  return (
    <div style={{ width: size, textAlign: "center" }}>
      <svg
        width={size}
        height={size / 2}
        viewBox={`0 0 ${size} ${radius}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform={`rotate(-180 ${center} ${radius})`}>
          {/* Background semicircle */}
          <path
            d={describeArc(center, radius, arcRadius, 0, 180)}
            fill="none"
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <path
            d={describeArc(center, radius, arcRadius, 0, (clampedValue / 100) * 180)}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* Percentage and label */}
      <div style={{ marginTop: -8 }}>
        <div style={{ fontSize: 20, fontWeight: "bold" }}>{clampedValue.toFixed(1)}%</div>
        <div style={{ fontSize: 12, color: "#666" }}>{label}</div>
      </div>
    </div>
  );
};

// Helper to create arc path (semi-circle)
function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
  ].join(" ");
}

// Convert polar coordinates to cartesian for SVG path
function polarToCartesian(cx: number, cy: number, r: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}

export default GaugeChart;
