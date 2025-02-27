import React, { useEffect, useState } from "react";

interface Metric {
    userName: string;
    ReferenceID: string;
    Role: string;
    Traffic: string;
    Amount: string;
    QtySold: string;
}

interface AgentSalesConversionProps {
    ReferenceID: string;
    Role: string;
}

const AgentSalesConversion: React.FC<AgentSalesConversionProps> = ({ ReferenceID, Role }) => {
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchMetrics = async () => {
            try {
                const response = await fetch(`/api/ModuleCSR/Dashboard/AgentSalesConversion?ReferenceID=${ReferenceID}&Role=${Role}`);
                if (!response.ok) throw new Error("Failed to fetch data");
                const data = await response.json();

                if (isMounted) setMetrics(data);
            } catch (error) {
                console.error("Error fetching metrics:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchMetrics();

        return () => {
            isMounted = false;
        };
    }, [ReferenceID, Role]);

    // Group metrics by ReferenceID and count usernames per group
    const groupedMetrics = metrics.reduce((acc, metric) => {
        if (!acc[metric.ReferenceID]) {
            acc[metric.ReferenceID] = { agents: [], count: 0 };
        }
        acc[metric.ReferenceID].agents.push({ 
            userName: metric.userName, 
            Traffic: metric.Traffic, 
            Amount: metric.Amount,
            QtySold: metric.QtySold  
        });
        acc[metric.ReferenceID].count += 1; // Counting all usernames under each ReferenceID
        return acc;
    }, {} as Record<string, { agents: { userName: string; Traffic: string; Amount: string; QtySold: string }[]; count: number }>);

    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Agent Sales Conversion</h2>
            {loading ? (
                <p className="text-xs">Loading...</p>
            ) : (
                <table className="w-full border-collapse border border-gray-200 text-xs">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Reference ID</th>
                            <th className="border p-2">Agent</th>
                            <th className="border p-2">Traffic</th>
                            <th className="border p-2">Amount</th>
                            <th className="border p-2">Quantity</th> 
                            <th className="border p-2">Total Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(groupedMetrics).length > 0 ? (
                            Object.entries(groupedMetrics).map(([refID, { agents, count }]) => (
                                <React.Fragment key={refID}>
                                    <tr className="bg-gray-200 font-semibold">
                                        <td className="border p-2">{refID}</td>
                                        <td className="border p-2"></td>
                                        <td className="border p-2"></td>
                                        <td className="border p-2"></td>
                                        <td className="border p-2 text-center">{count}</td>
                                    </tr>
                                    {agents.map(({ userName, Traffic, Amount, QtySold }, index) => (
                                        <tr key={index} className="text-center border-t">
                                            <td className="border p-2"></td>
                                            <td className="border p-2 capitalize">{userName}</td>
                                            <td className="border p-2">{Traffic}</td>
                                            <td className="border p-2">{Amount}</td>
                                            <td className="border p-2">{QtySold}</td>
                                            <td className="border p-2"></td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-2 text-center text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AgentSalesConversion;
