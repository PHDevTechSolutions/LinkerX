import React, { useState, useMemo } from "react";
import TimelineProgress from "./Analytics/TimelineProgress";

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

interface GroupedPosts {
    [key: string]: Call[];
}

interface CallDetailsProps {
    groupedPosts: GroupedPosts;
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#f87171", "#60a5fa", "#a78bfa", "#facc15"];

const getDistributionData = (calls: Call[], key: keyof Call) => {
    const count: Record<string, number> = {};
    calls.forEach((call) => {
        const value = call[key] || "Unknown";
        count[value] = (count[value] || 0) + 1;
    });
    return Object.entries(count).map(([name, value]) => ({ name, value }));
};

const CustomPieChart = ({
    data,
    size = 160,
}: {
    data: { name: string; value: number }[];
    size?: number;
}) => {
    const radius = size / 2;
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let cumulative = 0;

    const getCoordinates = (percent: number) => {
        const angle = 2 * Math.PI * percent;
        const x = radius + radius * Math.cos(angle - Math.PI / 2);
        const y = radius + radius * Math.sin(angle - Math.PI / 2);
        return { x, y };
    };

    const slices = data.map((slice, index) => {
        const start = cumulative / total;
        cumulative += slice.value;
        const end = cumulative / total;

        const { x: x1, y: y1 } = getCoordinates(start);
        const { x: x2, y: y2 } = getCoordinates(end);
        const largeArc = end - start > 0.5 ? 1 : 0;

        const d = `
      M ${radius},${radius}
      L ${x1},${y1}
      A ${radius},${radius} 0 ${largeArc} 1 ${x2},${y2}
      Z
    `;

        return (
            <path key={index} d={d} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth={1} />
        );
    });

    return (
        <div className="flex flex-col items-center">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {slices}
            </svg>
            <div className="mt-2 space-y-1 text-xs text-gray-600">
                {data.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span>{entry.name} ({entry.value})</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ✅ Main Component
const CallDetails: React.FC<CallDetailsProps> = ({ groupedPosts }) => {
    const allCalls: Call[] = Object.values(groupedPosts).flat();
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const filteredCalls = useMemo(() => {
        if (!startDate && !endDate) return allCalls;
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        return allCalls.filter((call) => {
            const callStart = new Date(call.startdate);
            const callEnd = new Date(call.enddate);
            if (start && callEnd < start) return false;
            if (end && callStart > end) return false;
            return true;
        });
    }, [allCalls, startDate, endDate]);

    const callStatusData = getDistributionData(filteredCalls, "callstatus");
    const typeCallData = getDistributionData(filteredCalls, "typecall");

    return (
        <>
            {/* Date Picker */}
            <div className="flex gap-4 mb-2 items-center">
                <label className="text-xs text-gray-600">
                    Start Date:
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border px-2 py-1 rounded ml-1"
                    />
                </label>
                <label className="text-xs text-gray-600">
                    End Date:
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border px-2 py-1 rounded ml-1"
                    />
                </label>
                <button
                    onClick={() => {
                        setStartDate("");
                        setEndDate("");
                    }}
                    className="text-xs text-blue-600 underline"
                >
                    Clear
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                {/* LEFT: Call History + Timeline */}
                <div className="md:w-1/2 space-y-4 border rounded-md shadow-md p-4">
                    <h2 className="font-semibold text-sm text-gray-700">Timeline Progress</h2>
                    <TimelineProgress calls={filteredCalls} />
                    <h2 className="font-semibold text-sm text-gray-700">Call History</h2>
                    <div className="overflow-x-auto bg-white">
                        <table className="w-full text-xs">
                            <thead className="bg-gray-100">
                                <tr className="whitespace-nowrap text-left">
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">Type</th>
                                    <th className="px-4 py-2">Callback</th>
                                    <th className="px-4 py-2">Wrap-Up</th>
                                    <th className="px-4 py-2">Inquiries</th>
                                    <th className="px-4 py-2">Agent</th>
                                    <th className="px-4 py-2">Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCalls.length > 0 ? (
                                    filteredCalls.map((call, i) => (
                                        <tr key={i} className="hover:bg-gray-50 whitespace-nowrap">
                                            <td className="px-4 py-2">{call.callstatus}</td>
                                            <td className="px-4 py-2">{call.typecall}</td>
                                            <td className="px-4 py-2">{call.callback}</td>
                                            <td className="px-4 py-2">{call.wrapup}</td>
                                            <td className="px-4 py-2">{call.inquiries}</td>
                                            <td className="px-4 py-2">{call.csragent}</td>
                                            <td className="px-4 py-2 capitalize">{call.remarks}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="text-center py-4 text-gray-500">
                                            No calls found in the selected date range.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* RIGHT: Pie Charts */}
                <div className="md:w-1/2 flex flex-col gap-6">
                    <div className="border rounded-md shadow-md bg-white p-4">
                        <h3 className="font-semibold text-sm text-gray-700 mb-2">Call Status Distribution</h3>
                        <CustomPieChart data={callStatusData} />
                    </div>
                    <div className="border rounded-md shadow-md bg-white p-4">
                        <h3 className="font-semibold text-sm text-gray-700 mb-2">Type of Call Distribution</h3>
                        <CustomPieChart data={typeCallData} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CallDetails;
