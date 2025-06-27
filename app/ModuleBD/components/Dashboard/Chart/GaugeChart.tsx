import React from "react";

interface GaugeChartProps {
  value: number; // from 0 to 100
  label: string;
  size?: number; // optional width/height in px
}

const GaugeChart: React.FC<GaugeChartProps> = ({ value, label, size = 120 }) => {
  const radius = size / 2;
  const strokeWidth = 10;
  const center = size / 2;
  const circumference = Math.PI * radius;
  const offset = circumference * (1 - value / 100);

  return (
    <div style={{ width: size, textAlign: "center" }}>
      <svg width={size} height={size / 2} viewBox={`0 0 ${size} ${radius}`} preserveAspectRatio="xMidYMid meet">
        <g transform={`rotate(-180 ${center} ${radius})`}>
          {/* Background semi-circle */}
          <path
            d={describeArc(center, radius, radius - strokeWidth / 2, 0, 180)}
            fill="none"
            stroke="#E0E0E0"
            strokeWidth={strokeWidth}
          />

          {/* Foreground (progress) arc */}
          <path
            d={describeArc(center, radius, radius - strokeWidth / 2, 0, (value / 100) * 180)}
            fill="none"
            stroke="#00C49F"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* Percentage + Label */}
      <div style={{ marginTop: -8 }}>
        <div style={{ fontSize: 20, fontWeight: "bold" }}>{value.toFixed(2)}%</div>
        <div style={{ fontSize: 12, color: "#666" }}>{label}</div>
      </div>
    </div>
  );
};

// Helper to create arc path (semi-circle)
function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
  ].join(" ");
}

function polarToCartesian(cx: number, cy: number, r: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}

export default GaugeChart;
