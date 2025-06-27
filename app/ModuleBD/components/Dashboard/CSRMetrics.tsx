"use client";

import React, { useMemo, useState } from "react";

interface CSRMetricsProps {
    filteredAccounts: any[];
}

function formatInterval(start: string, end: string) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return "-";
    const diff = Math.max(0, endDate.getTime() - startDate.getTime());
    const totalSeconds = Math.floor(diff / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
}

function formatTotalSeconds(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
}

function formatSecondsForYAxis(sec: number) {
    if (sec >= 3600) return `${Math.floor(sec / 3600)}h`;
    if (sec >= 60) return `${Math.floor(sec / 60)}m`;
    return `${sec}s`;
}

const COLORS = {
    responseTimeSec: "#8884d8",
    rfqHandlingTimeSec: "#82ca9d",
    nonRFQHandlingTimeSec: "#ffc658",
};

const LABELS = {
    responseTimeSec: "Response Time",
    rfqHandlingTimeSec: "RFQ Handling Time",
    nonRFQHandlingTimeSec: "Non-RFQ Handling Time",
};

const SEC_KEY_MAP: Record<keyof typeof COLORS, "responseTime" | "rfqHandlingTime" | "nonRFQHandlingTime"> = {
    responseTimeSec: "responseTime",
    rfqHandlingTimeSec: "rfqHandlingTime",
    nonRFQHandlingTimeSec: "nonRFQHandlingTime",
};

const CSRMetrics: React.FC<CSRMetricsProps> = ({ filteredAccounts }) => {
    const data = useMemo(() => {
        const grouped: Record<string, any> = {};

        filteredAccounts.forEach((account) => {
            const dateKey = account.date_created
                ? new Date(account.date_created).toLocaleDateString()
                : "-";

            const start = new Date(account.startdate);
            const end = new Date(account.enddate);
            if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

            const responseTimeSec = Math.max(0, Math.floor((end.getTime() - start.getTime()) / 1000));
            const responseTime = formatInterval(account.startdate, account.enddate);

            const isRFQ = account.activitystatus === "Quote-Done";
            const isNonRFQ = account.activitystatus === "Assisted";

            const rfqHandlingTimeSec = isRFQ ? responseTimeSec : 0;
            const nonRFQHandlingTimeSec = isNonRFQ ? responseTimeSec : 0;

            if (!grouped[dateKey]) {
                grouped[dateKey] = {
                    responseTimeSec: 0,
                    rfqHandlingTimeSec: 0,
                    nonRFQHandlingTimeSec: 0,
                };
            }

            grouped[dateKey].responseTimeSec += responseTimeSec;
            grouped[dateKey].rfqHandlingTimeSec += rfqHandlingTimeSec;
            grouped[dateKey].nonRFQHandlingTimeSec += nonRFQHandlingTimeSec;
        });

        return Object.entries(grouped).map(([name, values]) => ({
            name,
            ...values,
            responseTime: formatTotalSeconds(values.responseTimeSec),
            rfqHandlingTime: formatTotalSeconds(values.rfqHandlingTimeSec),
            nonRFQHandlingTime: formatTotalSeconds(values.nonRFQHandlingTimeSec),
        }));
    }, [filteredAccounts]);

    const [activeKeys, setActiveKeys] = useState<Set<keyof typeof COLORS>>(
        new Set(["responseTimeSec", "rfqHandlingTimeSec", "nonRFQHandlingTimeSec"])
    );

    const chartWidth = Math.max(800, data.length * 100);
    const height = 320;
    const margin = { top: 20, right: 60, bottom: 20, left: 20 };

    const maxY = Math.max(
        ...data.flatMap((d) =>
            Array.from(activeKeys).map((key) => d[key] ?? 0)
        ),
        0
    );

    const xStep = data.length > 1
        ? (chartWidth - margin.left - margin.right) / (data.length - 1)
        : 0;

    const yScale = (val: number) =>
        maxY === 0
            ? height - margin.bottom
            : height - margin.bottom - (val / maxY) * (height - margin.top - margin.bottom);

    const xPos = (i: number) => margin.left + i * xStep;

    const [tooltip, setTooltip] = useState<{
        visible: boolean;
        x: number;
        y: number;
        content: { label: string; value: string };
    }>({ visible: false, x: 0, y: 0, content: { label: "", value: "" } });

    const buildCurvePath = (key: keyof typeof COLORS) => {
        if (!activeKeys.has(key)) return "";

        let d = "";

        for (let i = 0; i < data.length - 1; i++) {
            const x0 = xPos(i);
            const y0 = yScale(data[i][key]);
            const x1 = xPos(i + 1);
            const y1 = yScale(data[i + 1][key]);
            const cx = (x0 + x1) / 2;

            if (i === 0) d += `M${x0},${y0}`;
            d += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`;
        }

        return d;
    };

    const renderPoints = (key: keyof typeof COLORS, color: string) => {
        if (!activeKeys.has(key)) return null;

        return data.map((d, i) => {
            if (d[key] === 0) return null;
            const x = xPos(i);
            const y = yScale(d[key]);
            const label = LABELS[key];
            const valueKey = SEC_KEY_MAP[key];
            const value = d[valueKey];

            return (
                <circle
                    key={`${key}-${i}`}
                    cx={x}
                    cy={y}
                    r={5}
                    fill={color}
                    stroke="#fff"
                    strokeWidth={2}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={(e) => {
                        setTooltip({
                            visible: true,
                            x: e.clientX,
                            y: e.clientY,
                            content: { label, value },
                        });
                    }}
                    onMouseLeave={() =>
                        setTooltip({ visible: false, x: 0, y: 0, content: { label: "", value: "" } })
                    }
                />
            );
        });
    };

    const toggleKey = (key: keyof typeof COLORS) => {
        setActiveKeys((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                if (newSet.size === 1) return newSet;
                newSet.delete(key);
            } else {
                newSet.add(key);
            }
            return newSet;
        });
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 font-sans overflow-x-auto text-black">
            <h2 className="text-sm font-bold mb-2">CSR Metrics</h2>

            {data.length === 0 ? (
                <p className="text-center text-gray-500 text-xs">No CSR metrics available.</p>
            ) : (
                <svg width={chartWidth} height={height} style={{ overflow: "visible" }}>
                    {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
                        const yVal = frac * maxY;
                        const y = yScale(yVal);
                        return (
                            <g key={frac}>
                                <line
                                    x1={margin.left}
                                    x2={chartWidth - margin.right}
                                    y1={y}
                                    y2={y}
                                    stroke="#ccc"
                                    strokeDasharray="4 2"
                                />
                                <text
                                    x={margin.left - 10}
                                    y={y + 4}
                                    fontSize={10}
                                    fill="#666"
                                    textAnchor="end"
                                >
                                    {formatSecondsForYAxis(Math.round(yVal))}
                                </text>
                            </g>
                        );
                    })}

                    {data.map((d, i) => {
                        const x = xPos(i);
                        return (
                            <text
                                key={i}
                                x={x}
                                y={height - margin.bottom + 20}
                                fontSize={10}
                                fill="#444"
                                textAnchor="middle"
                            >
                                {d.name}
                            </text>
                        );
                    })}

                    {Array.from(activeKeys).map((key) => (
                        <path
                            key={key}
                            d={buildCurvePath(key)}
                            fill="none"
                            stroke={COLORS[key]}
                            strokeWidth={2}
                        />
                    ))}

                    {Array.from(activeKeys).map((key) =>
                        renderPoints(key, COLORS[key])
                    )}

                    <line
                        x1={margin.left}
                        x2={margin.left}
                        y1={margin.top}
                        y2={height - margin.bottom}
                        stroke="#000"
                    />
                    <line
                        x1={margin.left}
                        x2={chartWidth - margin.right}
                        y1={height - margin.bottom}
                        y2={height - margin.bottom}
                        stroke="#000"
                    />
                </svg>
            )}

            <div className="flex justify-center gap-8 mt-6 select-none flex-wrap">
                {(Object.keys(COLORS) as (keyof typeof COLORS)[]).map((key) => {
                    const total = data.reduce((sum, d) => sum + (d[key] ?? 0), 0);
                    const formattedTotal = formatTotalSeconds(total);
                    return (
                        <div
                            key={key}
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => toggleKey(key)}
                            style={{ opacity: activeKeys.has(key) ? 1 : 0.4 }}
                        >
                            <div className="rounded-full w-4 h-4" style={{ backgroundColor: COLORS[key] }} />
                            <div className="text-xs text-black flex flex-col leading-tight">
                                <span>{LABELS[key]}</span>
                                <span className="text-gray-500 text-[11px]">{formattedTotal}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {tooltip.visible && (
                <div className="fixed border rounded-lg p-2 bg-white shadow-md text-xs z-50 whitespace-nowrap pointer-events-none"
                    style={{ top: tooltip.y - 40, left: tooltip.x + 10, }}>
                    <strong>{tooltip.content.label}</strong>
                    <div>{tooltip.content.value}</div>
                </div>
            )}
        </div>
    );
};

export default CSRMetrics;
