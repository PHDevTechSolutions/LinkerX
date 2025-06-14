import React, { useState, useMemo } from "react";
import Filters from "./ChartControls/Filters";
import Charts from "./ChartControls/SalesCharts";

interface Post {
    companyname: string;
    actualsales: string;
    targetquota: string;
    paymentterm: string;
    startdate: string;
    enddate: string;
}

interface SalesProps {
    groupedPosts: Record<string, Post[]>;
}

type ViewMode = "line" | "table";

const Sales: React.FC<SalesProps> = ({ groupedPosts }) => {
    const [viewMode, setViewMode] = useState<ViewMode>("line");
    const [customStartDate, setCustomStartDate] = useState<string>(""); // YYYY-MM-DD
    const [customEndDate, setCustomEndDate] = useState<string>("");

    const isDateInRange = (dateStr: string) => {
        const date = new Date(dateStr);
        const start = customStartDate ? new Date(customStartDate) : null;
        const end = customEndDate ? new Date(customEndDate) : null;
        return (!start || date >= start) && (!end || date <= end);
    };

    const exportCSV = (companyname: string, dates: string[], values: number[]) => {
        const header = "Date,Actual Sales\n";
        const rows = dates.map((d, i) => `${d},${values[i].toFixed(2)}`).join("\n");
        const csvContent = header + rows;
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${companyname}_sales.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-4 max-w-full">
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4">
                <Filters
                    customStartDate={customStartDate}
                    setCustomStartDate={setCustomStartDate}
                    customEndDate={customEndDate}
                    setCustomEndDate={setCustomEndDate}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                />
            </div>

            {/* Companies */}
            {Object.entries(groupedPosts).map(([companyname, posts]) => {
                const dateMap: Record<string, number> = {};

                posts.forEach((post) => {
                    const dateKey = new Date(post.startdate).toISOString().slice(0, 10);
                    if (!isDateInRange(dateKey)) return;
                    const sale = parseFloat(post.actualsales || "0");
                    dateMap[dateKey] = (dateMap[dateKey] || 0) + sale;
                });

                let dates = Object.keys(dateMap).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
                const values = dates.map((date) => dateMap[date]);

                const targetQuota = parseFloat(posts[0].targetquota || "0");
                const totalActualSales = values.reduce((a, b) => a + b, 0);
                const averageSales = values.length ? totalActualSales / values.length : 0;
                const maxVal = Math.max(targetQuota, averageSales, ...values, 1);
                const maxValIndex = values.indexOf(Math.max(...values));
                const isOnTrack = totalActualSales >= targetQuota;

                return (
                    <div
                        key={companyname}
                        className="p-4 border rounded-lg shadow-md max-w-full overflow-x-auto"
                        style={{ minWidth: "500px" }}
                    >
                        <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                            <p className="text-xs font-semibold text-gray-800 truncate max-w-[70%]">
                                Company: <span className="font-normal">{companyname}</span>
                            </p>
                            <span
                                className={`px-3 py-1 text-[10px] rounded-full font-semibold ${isOnTrack ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {isOnTrack ? "On Track" : "Below Target"}
                            </span>
                        </div>
                        <p className="text-xs text-orange-700">
                            Actual Sales Total: {totalActualSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-blue-700">Target Quota: {targetQuota.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">Average Daily Sales: {averageSales.toFixed(2)}</p>
                        <button
                            onClick={() => exportCSV(companyname, dates, values)}
                            className="my-2 px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                            Export CSV
                        </button>

                        <Charts
                            viewMode={viewMode}
                            dates={dates}
                            values={values}
                            targetQuota={targetQuota}
                            averageSales={averageSales}
                            maxVal={maxVal}
                            maxValIndex={maxValIndex}
                            formatDate={(date) => date.toLocaleDateString()}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default Sales;
