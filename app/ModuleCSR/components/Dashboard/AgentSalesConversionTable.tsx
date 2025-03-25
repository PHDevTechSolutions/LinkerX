import React, { useEffect, useState } from "react";

interface Metric {
    userName: string;
    ReferenceID: string;
    Traffic: string;
    Amount: number;
    QtySold: number;
    Status: string;
    createdAt: string;
}

interface AgentSalesConversionProps {
    ReferenceID: string;
    Role: string;
}

const AgentSalesConversion: React.FC<AgentSalesConversionProps> = ({ ReferenceID, Role }) => {
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

    const referenceIdToNameMap: Record<string, string> = {
        "MQ-CSR-170039": "Quinto, Myra",
        "LM-CSR-809795": "Miguel, Lester",
        "RP-CSR-451122": "Paje, Rikki",
        "SA-CSR-517304": "Almoite, Sharmaine",
        "AA-CSR-785895": "Arendain, Armando",
        "GL-CSR-586725": "Lumabao, Grace",
        "MD-CSR-152985": "Dungso, Mary Grace",
        "LR-CSR-849432": "Leroux Y Xchire",
        "MC-CSR-947264": "Capin, Mark Vincent",
    };

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await fetch(
                    `/api/ModuleCSR/Dashboard/AgentSalesConversion?ReferenceID=${ReferenceID}&Role=${Role}&month=${selectedMonth}&year=${selectedYear}`
                );
                if (!response.ok) throw new Error("Failed to fetch data");
                const data = await response.json();
                setMetrics(data);
            } catch (error) {
                console.error("Error fetching metrics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, [ReferenceID, Role, selectedMonth, selectedYear]);

    // Grouping data by ReferenceID and computing total Amount and QtySold
    const groupedData = metrics.reduce((acc, metric) => {
        if (!acc[metric.ReferenceID]) {
            acc[metric.ReferenceID] = {
                ReferenceID: metric.ReferenceID,
                Traffic: metric.Traffic,
                Amount: 0,
                QtySold: 0,
                ConversionToSale: 0,
                Sales: 0,
                NonSales: 0,
            };
        }
        acc[metric.ReferenceID].Amount += Number(metric.Amount) || 0;
        acc[metric.ReferenceID].QtySold += Number(metric.QtySold) || 0;
        acc[metric.ReferenceID].ConversionToSale += metric.Status === "Converted Into Sales" ? 1 : 0;
        acc[metric.ReferenceID].Sales += metric.Traffic === "Sales" ? 1 : 0;
        acc[metric.ReferenceID].NonSales += metric.Traffic !== "Sales" ? 1 : 0;

        return acc;
    }, {} as Record<string, any>);

    const formattedData = Object.values(groupedData);

    const formatAmountWithPeso = (amount: number) => {
        if (isNaN(amount)) {
            return "₱0.00";
        }
        return `₱${Number(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            {/* Month and Year Filter */}
            <div className="flex justify-start space-x-2 mb-4">
                {/* Month Filter */}
                <select
                    className="border p-2 text-xs rounded"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                >
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>

                {/* Year Filter */}
                <select
                    className="border p-2 text-xs rounded"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                >
                    {Array.from({ length: 5 }, (_, i) => (
                        <option key={i} value={(new Date().getFullYear() - i).toString()}>
                            {new Date().getFullYear() - i}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <p className="text-xs">Loading...</p>
            ) : (
                <table className="w-full border-collapse border border-gray-200 text-xs">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Agent Name</th>
                            <th className="border p-2">Traffic</th>
                            <th className="border p-2">Amount</th>
                            <th className="border p-2">Quantity Sold</th>
                            <th className="border p-2">Conversion to Sale</th>
                            <th className="border p-2">Sales</th>
                            <th className="border p-2">Non-Sales</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formattedData.length > 0 ? (
                            formattedData.map((metric, index) => (
                                <tr key={index} className="text-center border-t">
                                    <td className="border p-2">
                                        {referenceIdToNameMap[metric.ReferenceID] || "Unknown"}
                                    </td>
                                    <td className="border p-2">{metric.Traffic}</td>
                                    <td className="border p-2">{formatAmountWithPeso(metric.Amount)}</td>
                                    <td className="border p-2">{metric.QtySold}</td>
                                    <td className="border p-2">{metric.ConversionToSale}</td>
                                    <td className="border p-2">{metric.Sales}</td>
                                    <td className="border p-2">{metric.NonSales}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="p-2 text-center text-gray-500">
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
