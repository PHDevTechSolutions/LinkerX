import React, { useEffect, useState } from "react";

interface Metric {
    userName: string;
    ReferenceID: string;
    Traffic: string;
    Amount: number;
    QtySold: number;
    Status: string;
}

interface AgentSalesConversionProps {
    ReferenceID: string;
    Role: string;
}

const AgentSalesConversion: React.FC<AgentSalesConversionProps> = ({ ReferenceID, Role }) => {
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [loading, setLoading] = useState(true);

    // Static mapping of ReferenceID to userName
    const referenceIdToNameMap: Record<string, string> = {
        "MQ-CSR-170039": "Quinto, Myra",
        "LM-CSR-809795": "Miguel, Lester",
        "RP-CSR-451122": "Paje, Rikki",
        "SA-CSR-517304": "Almoite, Sharmaine",
        "AA-CSR-785895": "Arendain, Armando",
        "GL-CSR-586725": "Lumabao, Grace",
        "MD-CSR-152985": "Dungso, Mary Grace",
        "LR-CSR-849432": "Leroux Y Xchire",
        // Add other mappings as needed
    };

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

    // Group data by ReferenceID
    const groupedMetrics = metrics.reduce((acc: any, metric) => {
        const { ReferenceID, Traffic, Amount, QtySold, Status } = metric;

        if (!acc[ReferenceID]) {
            acc[ReferenceID] = {
                Traffic,
                Amount: 0,
                QtySold: 0,
                ConversionToSale: 0,
                Sales: 0,
                NonSales: 0,
            };
        }

        acc[ReferenceID].Amount += Amount;
        acc[ReferenceID].QtySold += QtySold;

        // Increment ConversionToSale only if Status is 'Converted Into Sales'
        if (Status === "Converted Into Sales") {
            acc[ReferenceID].ConversionToSale += 1;
        }

        // Count Sales and Non-Sales based on Traffic
        if (Traffic === "Sales") {
            acc[ReferenceID].Sales += 1;
        } else {
            acc[ReferenceID].NonSales += 1;
        }

        return acc;
    }, {});

    // Calculate totals
    const totalData = Object.keys(groupedMetrics).map((key) => ({
        ReferenceID: key,
        Traffic: groupedMetrics[key].Traffic,
        Amount: groupedMetrics[key].Amount,
        QtySold: groupedMetrics[key].QtySold,
        ConversionToSale: groupedMetrics[key].ConversionToSale,
        Sales: groupedMetrics[key].Sales,
        NonSales: groupedMetrics[key].NonSales,
    }));

    // Calculate the total amount across all ReferenceIDs
    const totalAmount = totalData.reduce((total, metric) => total + metric.Amount, 0);

    // Format Amount as Peso sign with thousands separator and 2 decimal places
    const formatAmount = (amount: number) => {
        if (isNaN(amount)) {
            return "₱0.00";  // Handle invalid or non-numeric amount
        }
        return `₱${Number(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    };

    // Format the totalAmount as Peso sign with thousands separator and 2 decimal places
    const formatTotalAmount = (amount: number) => {
        if (isNaN(amount)) {
            return "₱0.00";  // Handle invalid or non-numeric amount
        }
        return `₱${Number(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    };

    // Format QtySold by removing leading zeros
    const formatQtySold = (qtySold: number) => {
        return qtySold === 0 ? '0' : qtySold.toString().replace(/^0+/, ''); // Remove leading zeros, but show 0 if the value is 0
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4">
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
                        {totalData.length > 0 ? (
                            totalData.map((metric, index) => (
                                <tr key={index} className="text-center border-t">
                                    <td className="border p-2">{referenceIdToNameMap[metric.ReferenceID] || "Unknown"}</td>
                                    <td className="border p-2">{metric.Traffic}</td>
                                    <td className="border p-2">{formatAmount(metric.Amount)}</td>
                                    <td className="border p-2">{formatQtySold(metric.QtySold)}</td>
                                    <td className="border p-2">{metric.ConversionToSale}</td>
                                    <td className="border p-2">{metric.Sales}</td>
                                    <td className="border p-2">{metric.NonSales}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="p-2 text-center text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
            <div className="mt-4">
                <h4 className="font-semibold">Total Amount: {formatTotalAmount(totalAmount)}</h4>
            </div>
        </div>
    );
};

export default AgentSalesConversion;
