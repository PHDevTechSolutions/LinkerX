import React, { useMemo, useRef, useState, useEffect } from "react";

interface SalesRecord {
  projectname?: string;
  startdate?: string;
  enddate?: string;
  callstatus: string;
  actualsales: number;
}

interface SalesPipelineProps {
  records: SalesRecord[];
}

const COLORS = {
  time: "#8884d8",
  conversion: "#82ca9d",
};

const CHART_HEIGHT = 300;
const Y_AXIS_WIDTH = 40; // space for y-axis labels
const GAP_RATIO = 0.3; // Gap as ratio to bar width

const SalesPipeline: React.FC<SalesPipelineProps> = ({ records }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800); // default width
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    visible: boolean;
    data: any;
  }>({ x: 0, y: 0, visible: false, data: null });

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const pipelineData = useMemo(() => {
    const stages: Record<string, { deals: number; totalTimeToClose: number; totalSales: number }> = {};

    records.forEach(({ callstatus, startdate, enddate, actualsales }) => {
      if (!callstatus) return;

      if (!stages[callstatus]) {
        stages[callstatus] = { deals: 0, totalTimeToClose: 0, totalSales: 0 };
      }

      stages[callstatus].deals += 1;
      stages[callstatus].totalSales += actualsales || 0;

      // Calculate time to close only if both dates exist and valid
      if (startdate && enddate) {
        const start = new Date(startdate);
        const end = new Date(enddate);
        const days = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
        if (days >= 0) stages[callstatus].totalTimeToClose += days;
      }
    });

    const raw = Object.entries(stages).map(([status, data]) => ({
      callstatus: status,
      deals: data.deals,
      avgTimeToClose: data.deals > 0 ? +(data.totalTimeToClose / data.deals).toFixed(2) : 0,
      avgSales: data.deals > 0 ? +(data.totalSales / data.deals).toFixed(2) : 0,
    }));

    return raw.map((item, i) => {
      const prev = raw[i - 1];
      const conversionRate = i === 0 || !prev ? 100 : +(item.deals / prev.deals * 100).toFixed(2);
      return { ...item, conversionRate };
    });
  }, [records]);


  const maxTime = Math.max(...pipelineData.map(d => d.avgTimeToClose), 1);
  const maxRate = 100;
  const barCount = pipelineData.length;

  const totalUnits = 2 * barCount + (barCount + 1) * GAP_RATIO;
  const barWidth = (containerWidth - Y_AXIS_WIDTH) / totalUnits;
  const gap = barWidth * GAP_RATIO;

  // Prepare Y-axis ticks (5 steps)
  const yTicksTime = 5;
  const yTicksRate = 5;

  const yTickValuesTime = Array.from({ length: yTicksTime + 1 }, (_, i) =>
    +(maxTime * (i / yTicksTime)).toFixed(1)
  );
  const yTickValuesRate = Array.from({ length: yTicksRate + 1 }, (_, i) =>
    +(maxRate * (i / yTicksRate)).toFixed(0)
  );

  return (
    <section className="border p-4 rounded-md shadow-md">
      <h2 className="text-sm font-semibold mb-4">Sales Pipeline Velocity</h2>
      <div
        ref={containerRef}
        className="relative bg-white"
        style={{ width: "100%" }}
      >
        <svg
          width="100%"
          height={CHART_HEIGHT}
          viewBox={`0 0 ${containerWidth} ${CHART_HEIGHT}`}
          preserveAspectRatio="none"
        >
          {/* Y axis lines and labels for Avg Time to Close (left) */}
          {yTickValuesTime.map((val, i) => {
            const y = CHART_HEIGHT - 20 - (val / maxTime) * (CHART_HEIGHT - 60);
            return (
              <g key={"left-tick-" + i}>
                {/* grid line */}
                <line
                  x1={Y_AXIS_WIDTH}
                  y1={y}
                  x2={containerWidth}
                  y2={y}
                  stroke="#eee"
                  strokeWidth={1}
                />
                {/* tick label */}
                <text
                  x={Y_AXIS_WIDTH - 5}
                  y={y + 4}
                  fontSize="10"
                  fill="#666"
                  textAnchor="end"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Y axis lines and labels for Conversion Rate % (right) */}
          {yTickValuesRate.map((val, i) => {
            const y = CHART_HEIGHT - 20 - (val / maxRate) * (CHART_HEIGHT - 60);
            return (
              <g key={"right-tick-" + i}>
                {/* tick label */}
                <text
                  x={containerWidth - 5}
                  y={y + 4}
                  fontSize="10"
                  fill="#666"
                  textAnchor="end"
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Y axis lines */}
          <line
            x1={Y_AXIS_WIDTH}
            y1={20}
            x2={Y_AXIS_WIDTH}
            y2={CHART_HEIGHT - 20}
            stroke="#bbb"
            strokeWidth={1.5}
          />
          <line
            x1={containerWidth - 25}
            y1={20}
            x2={containerWidth - 25}
            y2={CHART_HEIGHT - 20}
            stroke="#bbb"
            strokeWidth={1.5}
          />

          {/* Bars and X-axis labels */}
          {pipelineData.map((item, index) => {
            const xBase = Y_AXIS_WIDTH + gap + index * (2 * barWidth + gap * 2);
            const timeBarHeight = (item.avgTimeToClose / maxTime) * (CHART_HEIGHT - 60);
            const rateBarHeight = (item.conversionRate / maxRate) * (CHART_HEIGHT - 60);

            return (
              <g
                key={index}
                onMouseEnter={(e) => {
                  const bounds = containerRef.current?.getBoundingClientRect();
                  if (!bounds) return;

                  let x = e.clientX - bounds.left + 10;
                  let y = e.clientY - bounds.top - 20;

                  // Clamp tooltip X/Y so it stays within container
                  const tooltipWidth = 160;
                  if (x + tooltipWidth > bounds.width) {
                    x = bounds.width - tooltipWidth - 10;
                  }
                  if (x < 0) x = 0;
                  if (y < 0) y = 0;

                  setTooltip({
                    x,
                    y,
                    data: item,
                    visible: true,
                  });
                }}
                onMouseMove={(e) => {
                  const bounds = containerRef.current?.getBoundingClientRect();
                  if (!bounds) return;

                  let x = e.clientX - bounds.left + 10;
                  let y = e.clientY - bounds.top - 20;

                  if (x + 160 > bounds.width) {
                    x = bounds.width - 160 - 10;
                  }
                  if (x < 0) x = 0;
                  if (y < 0) y = 0;

                  setTooltip(prev => ({
                    ...prev,
                    x,
                    y,
                  }));
                }}
                onMouseLeave={() => setTooltip(prev => ({ ...prev, visible: false }))}
              >
                {/* Time bar */}
                <rect
                  x={xBase}
                  y={CHART_HEIGHT - timeBarHeight - 20}
                  width={barWidth}
                  height={timeBarHeight}
                  fill={COLORS.time}
                  rx={4}
                />
                {/* Rate bar */}
                <rect
                  x={xBase + barWidth + 5}
                  y={CHART_HEIGHT - rateBarHeight - 20}
                  width={barWidth}
                  height={rateBarHeight}
                  fill={COLORS.conversion}
                  rx={4}
                />
                {/* X-axis label */}
                <text
                  x={xBase + barWidth}
                  y={CHART_HEIGHT - 4}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#374151"
                >
                  {item.callstatus}
                </text>
              </g>
            );
          })}

        </svg>

        {/* Tooltip */}
        {tooltip.visible && (
          <div
            className="absolute bg-white border border-gray-200 rounded-md shadow-md p-2 text-xs z-50 pointer-events-none"
            style={{ top: tooltip.y, left: tooltip.x, minWidth: 160 }}
          >
            <div className="font-semibold text-gray-800 mb-1">{tooltip.data.callstatus}</div>
            <div className="text-indigo-600">
              Avg Time to Close: {tooltip.data.avgTimeToClose} days
            </div>
            <div className="text-green-600">
              Conversion Rate: {tooltip.data.conversionRate}%
            </div>
          </div>
        )}
      </div>

      {/* Legends */}
      <div className="flex justify-center gap-6 mt-3 text-xs text-gray-700">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-4 h-4 rounded-sm"
            style={{ backgroundColor: COLORS.time }}
          />
          Avg Time to Close (days)
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-4 h-4 rounded-sm"
            style={{ backgroundColor: COLORS.conversion }}
          />
          Conversion Rate (%)
        </div>
      </div>
    </section>
  );
};

export default SalesPipeline;
