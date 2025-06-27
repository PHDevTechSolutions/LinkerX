import React, { useEffect, useRef, useState } from "react";

interface ChartsProps {
  viewMode: "line" | "table";
  dates: string[];
  values: number[];
  targetQuota: number;
  averageSales: number;
  maxVal: number;
  maxValIndex: number;
  formatDate: (date: Date) => string;
}

const Charts: React.FC<ChartsProps> = ({
  viewMode,
  dates,
  values,
  targetQuota,
  averageSales,
  maxVal,
  maxValIndex,
  formatDate,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const chartHeight = 300;

  useEffect(() => {
    const resize = () => {
      if (chartRef.current) {
        setContainerWidth(chartRef.current.offsetWidth);
      }
    };
    resize();

    const observer = new ResizeObserver(resize);
    if (chartRef.current) observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, []);

  const filteredData = dates
    .map((date, i) => ({ date, value: values[i], index: i }))
    .filter((item) => item.value > 0);

  const stepX = containerWidth / Math.max(filteredData.length, 1);
  const yScale = (val: number) =>
    chartHeight - (val / maxVal) * (chartHeight - 40);

  const toggleLabel = (i: number) =>
    setSelectedLabel((prev) => (prev === i ? null : i));

  const renderTable = () => (
    <div className="overflow-x-auto mt-4">
      <table className="w-full text-xs border border-gray-300 rounded shadow">
        <thead className="bg-neutral-100">
          <tr>
            <th className="text-left px-4 py-2 border">Date</th>
            <th className="text-right px-4 py-2 border">Sales</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(({ date, value }, i) => (
            <tr
              key={i}
              onClick={() => toggleLabel(i)}
              className={`cursor-pointer transition-colors ${selectedLabel === i ? "bg-yellow-100" : "hover:bg-neutral-50"
                }`}
            >
              <td className="px-4 py-2 border whitespace-nowrap">
                {formatDate(new Date(date))}
              </td>
              <td className="px-4 py-2 border text-right">{value.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderChart = () => {
    const linePath = filteredData
      .map(({ value }, i) => {
        const x = i * stepX;
        const y = yScale(value);
        return `${i === 0 ? "M" : "L"}${x} ${y}`;
      })
      .join(" ");

    return (
      <div className="relative bg-white p-4 mt-4 w-full overflow-x-auto" ref={chartRef}>
        <svg
          viewBox={`0 0 ${containerWidth} ${chartHeight}`}
          width="100%"
          height={chartHeight}
          className="block"
        >
          {[0.25, 0.5, 0.75, 1].map((p, i) => (
            <line
              key={i}
              x1={0}
              x2={containerWidth}
              y1={yScale(maxVal * p)}
              y2={yScale(maxVal * p)}
              stroke="#e5e7eb"
              strokeDasharray="4 4"
            />
          ))}

          <line
            x1={0}
            x2={containerWidth}
            y1={yScale(targetQuota)}
            y2={yScale(targetQuota)}
            stroke="#3b82f6"
            strokeWidth={1.5}
          />
          <line
            x1={0}
            x2={containerWidth}
            y1={yScale(averageSales)}
            y2={yScale(averageSales)}
            stroke="#10b981"
            strokeWidth={1.5}
          />

          <path d={linePath} fill="none" stroke="#f59e0b" strokeWidth={2} />

          {filteredData.map(({ value }, i) => (
            <g key={i}>
              <circle
                cx={i * stepX}
                cy={yScale(value)}
                r={selectedLabel === i ? 6 : 4}
                fill={i === maxValIndex ? "#dc2626" : "#f59e0b"}
                onClick={() => toggleLabel(i)}
                onMouseEnter={() => {
                  setHoverIndex(i);
                  setTooltipPos({ x: i * stepX, y: yScale(value) });
                }}
                onMouseLeave={() => {
                  setHoverIndex(null);
                  setTooltipPos(null);
                }}
              />
            </g>
          ))}
        </svg>

        {/* ✅ Custom Tooltip */}
        {hoverIndex !== null && tooltipPos && (
          <div
            className="absolute bg-white border border-gray-200 rounded-md shadow-md p-2 text-xs z-50 pointer-events-none"
            style={{
              left: tooltipPos.x + 12,
              top: tooltipPos.y,
              transform: "translateY(-100%)",
            }}
          >
            <div>{formatDate(new Date(filteredData[hoverIndex].date))}</div>
            <div className="text-green-600">Sales: {filteredData[hoverIndex].value.toFixed(2)}</div>
          </div>
        )}

        <div
          className="flex mt-2 text-xs text-gray-700 overflow-x-auto select-none"
          style={{ width: containerWidth }}
        >
          {filteredData.map(({ date }, i) => (
            <div
              key={i}
              className={`text-center truncate cursor-pointer ${selectedLabel === i
                ? "bg-orange-200 font-semibold"
                : "hover:bg-orange-100"
                }`}
              onClick={() => toggleLabel(i)}
              style={{ width: stepX, minWidth: stepX }}
            >
              {formatDate(new Date(date))}
            </div>
          ))}
        </div>

        <div className="flex gap-6 text-xs mt-4 text-gray-600">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded" /> Sales
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded" /> Average
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded" /> Target
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded" /> Highest
          </span>
        </div>
      </div>
    );
  };

  return viewMode === "table" ? renderTable() : renderChart();
};

export default Charts;
