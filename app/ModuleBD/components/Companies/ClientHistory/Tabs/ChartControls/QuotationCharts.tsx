// ChartControls/QuotationCharts.tsx
import React from "react";

interface QuotationChartsProps {
    chartWidth: number;
    CHART_HEIGHT: number;
    MARGIN: { top: number; right: number; bottom: number; left: number };
    dates: string[];
    quotationAmounts: number[];
    soAmounts: number[];
    tooltip: {
        visible: boolean;
        x: number;
        y: number;
        date: string;
        quotationAmount?: number;
        soAmount?: number;
    };
    sX: (index: number) => number;
    sY: (value: number) => number;
    maxY: number;
    handleMouseEnter: (
        e: React.MouseEvent<SVGCircleElement>,
        date: string,
        qAmount: number,
        sAmount: number
    ) => void;
    handleMouseLeave: () => void;
}

const QuotationCharts: React.FC<QuotationChartsProps> = ({
    chartWidth,
    CHART_HEIGHT,
    MARGIN,
    dates,
    quotationAmounts,
    soAmounts,
    tooltip,
    sX,
    sY,
    maxY,
    handleMouseEnter,
    handleMouseLeave,
}) => {
    const buildSmoothPath = (values: number[]) => {
        if (values.length === 0) return "";
        const points = values.map((val, i) => [sX(i), sY(val)]);
        let path = `M${points[0][0]},${points[0][1]}`;
        for (let i = 0; i < points.length - 1; i++) {
            const [x0, y0] = points[i];
            const [x1, y1] = points[i + 1];
            const cpX = (x0 + x1) / 2;
            path += ` Q${cpX},${y0} ${x1},${y1}`;
        }
        return path;
    };

    const yLabels = [];
    for (let i = 0; i <= 5; i++) {
        yLabels.push(((maxY / 5) * i).toFixed(0));
    }

    return (
        <>
            <svg width={chartWidth} height={CHART_HEIGHT} style={{ marginTop: 20, borderRadius: 8 }}>
                {yLabels.map((label, i) => {
                    const y = sY((parseFloat(label) / maxY) * maxY);
                    return (
                        <g key={i}>
                            <line
                                x1={MARGIN.left}
                                x2={chartWidth - MARGIN.right}
                                y1={y}
                                y2={y}
                                stroke="#ddd"
                                strokeDasharray="2 4"
                            />
                            <text x={MARGIN.left - 10} y={y + 4} textAnchor="end" fontSize={10} fill="#666">
                                {label}
                            </text>
                        </g>
                    );
                })}

                {dates.map((date, i) => {
                    const x = sX(i);
                    return (
                        <g key={date}>
                            <line
                                x1={x}
                                x2={x}
                                y1={CHART_HEIGHT - MARGIN.bottom}
                                y2={CHART_HEIGHT - MARGIN.bottom + 5}
                                stroke="#666"
                            />
                            <text
                                x={x}
                                y={CHART_HEIGHT - MARGIN.bottom + 20}
                                textAnchor="middle"
                                fontSize={10}
                                fill="#666"
                            >
                                {new Date(date).toLocaleDateString()}
                            </text>
                        </g>
                    );
                })}

                <line
                    x1={MARGIN.left}
                    x2={chartWidth - MARGIN.right}
                    y1={CHART_HEIGHT - MARGIN.bottom}
                    y2={CHART_HEIGHT - MARGIN.bottom}
                    stroke="#666"
                />
                <line
                    x1={MARGIN.left}
                    x2={MARGIN.left}
                    y1={MARGIN.top}
                    y2={CHART_HEIGHT - MARGIN.bottom}
                    stroke="#666"
                />

                <path d={buildSmoothPath(quotationAmounts)} fill="none" stroke="#2563eb" strokeWidth={2} />
                <path d={buildSmoothPath(soAmounts)} fill="none" stroke="#f97316" strokeWidth={2} />

                {quotationAmounts.map((val, i) => (
                    <circle
                        key={`q-${i}`}
                        cx={sX(i)}
                        cy={sY(val)}
                        r={6}
                        fill="#2563eb"
                        style={{ cursor: "pointer", transition: "r 0.3s ease" }}
                        onMouseEnter={(e) => handleMouseEnter(e, dates[i], val, soAmounts[i])}
                        onMouseLeave={handleMouseLeave}
                    />
                ))}

                {soAmounts.map((val, i) => (
                    <circle
                        key={`so-${i}`}
                        cx={sX(i)}
                        cy={sY(val)}
                        r={6}
                        fill="#f97316"
                        style={{ cursor: "pointer", transition: "r 0.3s ease" }}
                        onMouseEnter={(e) => handleMouseEnter(e, dates[i], quotationAmounts[i], val)}
                        onMouseLeave={handleMouseLeave}
                    />
                ))}

                <rect x={chartWidth - MARGIN.right - 150} y={MARGIN.top} width={140} height={40} fill="#fff" stroke="#ccc" rx={5} />
                <circle cx={chartWidth - MARGIN.right - 130} cy={MARGIN.top + 15} r={6} fill="#2563eb" />
                <text x={chartWidth - MARGIN.right - 115} y={MARGIN.top + 20} fontSize={12} fill="#333">Quotation Amount</text>
                <circle cx={chartWidth - MARGIN.right - 130} cy={MARGIN.top + 30} r={6} fill="#f97316" />
                <text x={chartWidth - MARGIN.right - 115} y={MARGIN.top + 35} fontSize={12} fill="#333">SO Amount</text>
            </svg>

            {tooltip.visible && (
                <div
                    className="absolute bg-white border border-gray-200 rounded-md shadow-md p-2 text-xs z-50 pointer-events-none"
                    style={{
                        position: "absolute",
                        left: Math.min(tooltip.x, chartWidth - 160), // prevent overflow on right
                        top: tooltip.y,
                    }}>

                    <div><strong>Date:</strong> {new Date(tooltip.date).toLocaleDateString()}</div>
                    <div className="text-indigo-600">Quotation Amount: {tooltip.quotationAmount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div className="text-orange-600">SO Amount: {tooltip.soAmount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
            )}
        </>
    );
};

export default QuotationCharts;
