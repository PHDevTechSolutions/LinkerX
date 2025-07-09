import React from "react";
import ActivityCounts from "./Charts/ActivityCount";
import ClientTypeChart from "./Charts/ClientTypeChart";
import SourceByTypeClientChart from "./Charts/SourceByTypeClientChart";
import AreaDistributionChart from "./Charts/AreaDistributionChart";

interface AnalyticsContainerProps {
    updatedUser: any[];
}

const AnalyticsContainer: React.FC<AnalyticsContainerProps> = ({ updatedUser }) => {
    // Area Chart: Count per Day
    const analyticsData: Record<string, number> = updatedUser.reduce((acc, user) => {
        const date = new Date(user.date_created).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.entries(analyticsData)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Bar Chart: Count per typeclient
    const typeClientCounts: Record<string, number> = updatedUser.reduce((acc, user) => {
        const type = user.typeclient || "Unknown";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    const typeClientChartData = Object.entries(typeClientCounts).map(([type, count]) => ({
        type,
        count,
    }));

    // Grouped Bar Chart: Count of source per typeclient
    const typeClientSet = new Set<string>();
    const sourceMap: Record<string, Record<string, number>> = {};

    updatedUser.forEach((user) => {
        const source = user.source || "Unknown";
        const type = user.typeclient || "Unknown";

        typeClientSet.add(type);

        if (!sourceMap[source]) sourceMap[source] = {};
        sourceMap[source][type] = (sourceMap[source][type] || 0) + 1;
    });

    const sourceChartData = Object.entries(sourceMap).map(([source, typeCounts]) => {
        return {
            source,
            ...typeCounts,
        };
    });

    // Pie Chart: Area distribution
    const areaCounts = updatedUser.reduce((acc, user) => {
        const area = user.area || "Unknown";
        acc[area] = (acc[area] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const areaChartData = Object.entries(areaCounts).map(([name, value]) => ({
        name,
        value: value as number,
    }));


    const allTypeClients = Array.from(typeClientSet);

    return (
        <div className="bg-white rounded shadow p-4 text-sm space-y-8">
            <div>
                <h2 className="text-md font-bold mb-4">Activity Counts per Day</h2>
                <ActivityCounts data={chartData} />
            </div>

            <div>
                <h2 className="text-md font-bold mb-4">Client Type Distribution (TypeClient)</h2>
                <ClientTypeChart data={typeClientChartData} />
            </div>

            <div>
                <h2 className="text-md font-bold mb-4">Source vs TypeClient Comparison</h2>
                <SourceByTypeClientChart data={sourceChartData} typeClients={allTypeClients} />
            </div>

            <div>
                <h2 className="text-md font-bold mb-4">Area Distribution</h2>
                <AreaDistributionChart data={areaChartData} />
            </div>
        </div>
    );
};

export default AnalyticsContainer;
