import React, { useMemo, useState, useRef } from "react";

interface Call {
    callstatus: string;
    typecall: string;
    callback: string;
    wrapup: string;
    inquiries: string;
    csragent: string;
    remarks: string;
    startdate: string;
    enddate: string;
}

interface TimelineProgressProps {
    calls: Call[];
}

const TimelineProgress: React.FC<TimelineProgressProps> = ({ calls }) => {
    const groupedByHour = useMemo(() => {
        const map: Record<string, number> = {};

        calls.forEach((call) => {
            if (call.callback) {
                const date = new Date(call.callback);
                const hourStr = date.toISOString().slice(0, 13) + ":00";
                map[hourStr] = (map[hourStr] || 0) + 1;
            }
        });

        return map;
    }, [calls]);

    const sortedHours = Object.keys(groupedByHour).sort();
    const maxY = Math.max(...Object.values(groupedByHour), 1);

    const width = 1000;
    const height = 150;
    const padding = 40;
    const pointCount = sortedHours.length;
    const stepX = pointCount > 1 ? (width - padding * 2) / (pointCount - 1) : 0;

    // Create points array for easier handling
    const points = sortedHours.map((hour, idx) => {
        const count = groupedByHour[hour];
        const x = padding + idx * stepX;
        const y = height - padding - (count / maxY) * (height - padding * 2);
        return { x, y };
    });

    // Helper to create a smooth SVG path from points (cubic Bezier curve)
    // This uses a simple smoothing approach averaging control points.
    const createSmoothPath = (pts: { x: number; y: number }[]) => {
        if (pts.length === 0) return "";
        if (pts.length === 1) return `M${pts[0].x},${pts[0].y}`;

        let d = `M${pts[0].x},${pts[0].y}`;

        for (let i = 0; i < pts.length - 1; i++) {
            const p0 = pts[i === 0 ? i : i - 1];
            const p1 = pts[i];
            const p2 = pts[i + 1];
            const p3 = pts[i + 2 ? Math.min(i + 2, pts.length - 1) : i + 1];

            const controlPoint1X = p1.x + (p2.x - p0.x) / 6;
            const controlPoint1Y = p1.y + (p2.y - p0.y) / 6;

            const controlPoint2X = p2.x - (p3.x - p1.x) / 6;
            const controlPoint2Y = p2.y - (p3.y - p1.y) / 6;

            d += ` C${controlPoint1X},${controlPoint1Y} ${controlPoint2X},${controlPoint2Y} ${p2.x},${p2.y}`;
        }

        return d;
    };

    const pathData = createSmoothPath(points);

    const [tooltip, setTooltip] = useState<{
        visible: boolean;
        x: number;
        y: number;
        content: string;
    }>({ visible: false, x: 0, y: 0, content: "" });

    const containerRef = useRef<HTMLDivElement>(null);

    const parseHourStr = (hourStr: string) => new Date(hourStr);

    const format12Hour = (date: Date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        if (hours === 0) hours = 12;
        return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    };

    const formatTimeDiff = (d1: Date, d2: Date) => {
        let diffMs = Math.abs(d2.getTime() - d1.getTime());

        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        diffMs -= hours * 1000 * 60 * 60;

        const minutes = Math.floor(diffMs / (1000 * 60));
        diffMs -= minutes * 1000 * 60;

        const seconds = Math.floor(diffMs / 1000);

        return `${hours}h ${minutes}m ${seconds}s`;
    };

    const handleMouseEnter = (
        event: React.MouseEvent,
        hour: string,
        count: number,
        idx: number
    ) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        const date = parseHourStr(hour);
        const timeStr = format12Hour(date);

        let diffStr = "N/A";
        if (idx > 0) {
            const prevDate = parseHourStr(sortedHours[idx - 1]);
            diffStr = formatTimeDiff(prevDate, date);
        }

        setTooltip({
            visible: true,
            x: offsetX + 10,
            y: offsetY - 30,
            content: `${timeStr} - ${count} callback${count > 1 ? "s" : ""} - ${diffStr} since previous`,
        });
    };

    const handleMouseLeave = () => {
        setTooltip((t) => ({ ...t, visible: false }));
    };

    return (
        <div
            className="border rounded-md shadow-md bg-white p-4 overflow-x-auto relative"
            ref={containerRef}
        >
            <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .blink {
          animation: blink 1.5s infinite;
        }
      `}</style>

            {pointCount === 0 ? (
                <p className="text-xs text-gray-500">No callback data available.</p>
            ) : (
                <>
                    <svg
                        width={Math.max(width, pointCount * 20)}
                        height={height}
                        className="text-sm text-gray-500"
                    >
                        {/* Axes */}
                        <line
                            x1={padding}
                            y1={height - padding}
                            x2={width - padding}
                            y2={height - padding}
                            stroke="#ccc"
                        />
                        <line
                            x1={padding}
                            y1={padding}
                            x2={padding}
                            y2={height - padding}
                            stroke="#ccc"
                        />

                        {/* Y-axis labels */}
                        {[0, maxY].map((val) => (
                            <text
                                key={val}
                                x={padding - 10}
                                y={height - padding - (val / maxY) * (height - padding * 2)}
                                fontSize={10}
                                textAnchor="end"
                                alignmentBaseline="middle"
                            >
                                {val}
                            </text>
                        ))}

                        {/* X-axis labels */}
                        {sortedHours
                            .filter((_, idx) => idx % Math.ceil(pointCount / 6) === 0)
                            .map((hour) => {
                                const idx = sortedHours.indexOf(hour);
                                const x = padding + idx * stepX;
                                const date = parseHourStr(hour);
                                const label = `${date.toLocaleDateString()} ${format12Hour(date)}`;
                                return (
                                    <text
                                        key={hour}
                                        x={x}
                                        y={height - padding + 15}
                                        fontSize={10}
                                        textAnchor="middle"
                                        fill="#333"
                                    >
                                        {label}
                                    </text>
                                );
                            })}

                        {/* Curved Path in orange-600 */}
                        <path
                            fill="none"
                            stroke="#f97316"
                            strokeWidth={2}
                            d={pathData}
                        />

                        {/* Circles in orange-600 */}
                        {points.map(({ x, y }, idx) => {
                            const hour = sortedHours[idx];
                            const count = groupedByHour[hour];
                            const isLatest = idx === points.length - 1;
                            return (
                                <circle
                                    key={hour}
                                    cx={x}
                                    cy={y}
                                    r={5}
                                    fill="#f97316"
                                    className={isLatest ? "blink" : ""}
                                    style={{ cursor: "pointer" }}
                                    onMouseEnter={(e) => handleMouseEnter(e, hour, count, idx)}
                                    onMouseLeave={handleMouseLeave}
                                />
                            );
                        })}
                    </svg>

                    {tooltip.visible && (
                        <div
                            className="absolute bg-white border border-gray-200 rounded-md shadow-md p-2 text-xs z-50 pointer-events-none capitalize"
                            style={{ top: tooltip.y, left: tooltip.x, whiteSpace: "nowrap" }}
                        >
                            {tooltip.content}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TimelineProgress;
