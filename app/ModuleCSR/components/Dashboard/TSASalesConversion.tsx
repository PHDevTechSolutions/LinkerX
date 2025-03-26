import React, { useEffect, useState } from "react";

interface Metric {
    userName: string;
    ReferenceID: string;
    Traffic: string;
    Amount: any;
    QtySold: any;
    Status: string;
    createdAt: string;
    CustomerStatus: string;
    SalesAgent: string;
}

interface User {
    ReferenceID: string;
    Firstname: string;
    Lastname: string;
    Role: string;
}

interface AgentSalesConversionProps {
    ReferenceID: string;
    Role: string;
    month: number;
    year: number;
}

const AgentSalesConversion: React.FC<AgentSalesConversionProps> = ({
    ReferenceID,
    Role,
    month,
    year,
}) => {
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);

    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/ModuleSales/UserManagement/TerritorySalesAssociates/FetchUser");
            if (!response.ok) throw new Error("Failed to fetch users");
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const referenceIdToNameMap: Record<string, string> = {
        "Airish, Echanes": "Airish, Echanes",
        "RME-CDO-006": "Abelou, Sanchez",
        "RT-NCR-016": "Agnes Angeli, Panopio",
        "RME-CDO-001": "Andrew, Banaglorosio",
        "AB-NCR-006": "Ansley, Patelo",
        "NTL-DVO-004": "Arteo Angelo, Beseril",
        "RT-NCR-001": "Banjo, Lising",
        "RT-NCR-018": "Brian, Zantua",
        "AB-NCR-011": "Candy, Notob",
        "RT-NCR-013": "Cesar, Paredes",
        "RDC-R1-001": "Cris, Acierto",
        "AB-NCR-002": "Cristy, Bobis",
        "RT-NCR-006": "Dionisio, Doyugan",
        "NTL-DVO-003": "Duke, Menil",
        "RT-NCR-014": "Erish Tomas, Cajipe",
        "AB-NCR-008": "Erwin, Laude",
        "RT-NCR-009": "Eryll Joyce, Encina",
        "JP-CBU-003": "Ferdinand, Canete",
        "Florencio, Jacinto Jr": "Florencio, Jacinto Jr",
        "RT-NCR-024": "Fortunato, Mabingnay",
        "RT-NCR-005": "Gene Mark, Roxas",
        "RT-NCR-004": "Gretchell, Aquino",
        "JD-001": "Jayvee, Atienza",
        "RT-016": "Jean, Dela Cerna",
        "AB-NCR-007": "Jeff, Puying",
        "RT-NCR-002": "Jeffrey, Lacson",
        "Jessie, De Guzman": "Jessie, De Guzman",
        "JS-NCR-001": "Jonna, Clarin",
        "JS-NCR-005": "Julius, Abuel",
        "AB-NCR-003": "Joseph, Candazo",
        "RT-NCR-023": "Joy Merel, Soriente",
        "NTL-DVO-001": "Khay, Yango",
        "SH-DA-001": "Krista, Ilaya",
        "RT-NCR-011": "Krizelle, Payno",
        "RME-CDO-002": "Kurt, Guanco",
        "RT-NCR-003": "Lotty, De Guzman",
        "JP-CBU-002": "Mark, Villagonzalo",
        "JS-NCR-003": "Michael, Quijano",
        "Merie, Tumbado": "Merie, Tumbado",
        "RT-NCR-021": "Niko, Gertes",
        "RR-SLN-002": "Patrick, Managuelod",
        "Paula, Cauguiran": "Paula, Cauguiran",
        "AB-NCR-009": "Princess Joy, Ambre",
        "RT-NCR-019": "Richard, Esteban",
        "JP-CBU-004": "Reynaldo, Piedad",
        "RT-NCR-015": "Randy, Bacor",
        "RT-NCR-008": "Rodelio, Ico",
        "RT-NCR-007": "Rodolfo, Delizo",
        "RT-018": "Rosemarie, Nollora",
        "RT-017": "Roselyn, Barnes",
        "JS-NCR-002": "Sherilyn, Rapote",
        "AB-NCR-005": "Vincent, Ortiz",
        "AB-NCR-001": "Wilnie, Ardelozo",
        "LX-NCR-001": "Leroux Xchire",
        "": "",

        
    };

    // Function to get Sales Agent name by ReferenceID
    const getSalesAgentName = (referenceID: string): string => {
        // Check if the user exists in the fetched users list
        const user = users.find((user) => user.ReferenceID === referenceID);
        if (user) {
            return `${user.Lastname}, ${user.Firstname}`;
        }
        // Fallback to referenceIdToNameMap if not found
        return referenceIdToNameMap[referenceID] || "Unknown";
    };

    const fetchMetrics = async () => {
        try {
            const response = await fetch(
                `/api/ModuleCSR/Dashboard/AgentSalesConversion?ReferenceID=${ReferenceID}&Role=${Role}&month=${month}&year=${year}`
            );
            if (!response.ok) throw new Error("Failed to fetch metrics");
            const data = await response.json();

            // Filter data by month and year
            const filteredData = data.filter((item: Metric) => {
                const createdAtDate = new Date(item.createdAt);
                return (
                    createdAtDate.getMonth() + 1 === month &&
                    createdAtDate.getFullYear() === year
                );
            });

            setMetrics(filteredData);
        } catch (error) {
            console.error("Error fetching metrics:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch users and metrics on component mount
    useEffect(() => {
        fetchUsers();
        fetchMetrics();
    }, [ReferenceID, Role, month, year]);

    // ✅ Group by ReferenceID
    const groupedMetrics = metrics.reduce((acc, metric) => {
        if (!acc[metric.SalesAgent]) {
            acc[metric.SalesAgent] = [];
        }
        acc[metric.SalesAgent].push(metric);
        return acc;
    }, {} as Record<string, Metric[]>);

    // ✅ Calculate totals per agent
    const calculateAgentTotals = (agentMetrics: Metric[]) => {
        return agentMetrics.reduce(
            (acc, metric) => {
                const amount = parseFloat(metric.Amount) || 0;
                const qtySold = parseFloat(metric.QtySold) || 0;
                const isSale = metric.Traffic === "Sales";
                const isConverted = metric.Status === "Converted Into Sales";

                acc.sales += isSale ? 1 : 0;
                acc.nonSales += !isSale ? 1 : 0;
                acc.totalAmount += amount;
                acc.totalQtySold += qtySold;
                acc.totalConversionToSale += isConverted ? 1 : 0;

                // Add customer status counts
                switch (metric.CustomerStatus) {
                    case "New Client":
                        acc.newClientCount += 1;
                        if (isConverted) acc.newClientConvertedAmount += amount;
                        break;
                    case "New-Non Buying":
                        acc.newNonBuyingCount += 1;
                        if (isConverted) acc.newNonBuyingConvertedAmount += amount;
                        break;
                    case "Existing Active":
                        acc.existingActiveCount += 1;
                        if (isConverted) acc.existingActiveConvertedAmount += amount;
                        break;
                    case "Existing Inactive":
                        acc.existingInactiveCount += 1;
                        if (isConverted) acc.existingInactiveConvertedAmount += amount;
                        break;
                    default:
                        break;
                }

                return acc;
            },
            {
                sales: 0,
                nonSales: 0,
                totalAmount: 0,
                totalQtySold: 0,
                totalConversionToSale: 0,
                newClientCount: 0,
                newNonBuyingCount: 0,
                existingActiveCount: 0,
                existingInactiveCount: 0,
                newClientConvertedAmount: 0, // Total amount for New Client Converted To Sales
                newNonBuyingConvertedAmount: 0, // Total amount for New Non-Buying Converted To Sales
                existingActiveConvertedAmount: 0, // Total amount for Existing Active Converted To Sales
                existingInactiveConvertedAmount: 0, // Total amount for Existing Inactive Converted To Sales
            }
        );
    };


    // ✅ Format amount with Peso sign
    const formatAmountWithPeso = (amount: any) => {
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount)) {
            return "₱0.00";
        }
        return `₱${parsedAmount
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
    };


    // ✅ Calculate overall totals for tfoot
    const totals = Object.values(groupedMetrics).reduce(
        (acc, agentMetrics) => {
            const totals = calculateAgentTotals(agentMetrics);

            acc.sales += totals.sales;
            acc.nonSales += totals.nonSales;
            acc.totalAmount += totals.totalAmount;
            acc.totalQtySold += totals.totalQtySold;
            acc.totalConversionToSale += totals.totalConversionToSale;
            acc.newClientCount += totals.newClientCount;
            acc.newNonBuyingCount += totals.newNonBuyingCount;
            acc.existingActiveCount += totals.existingActiveCount;
            acc.existingInactiveCount += totals.existingInactiveCount;
            acc.newClientConvertedAmount += totals.newClientConvertedAmount;
            acc.newNonBuyingConvertedAmount += totals.newNonBuyingConvertedAmount;
            acc.existingActiveConvertedAmount += totals.existingActiveConvertedAmount;
            acc.existingInactiveConvertedAmount += totals.existingInactiveConvertedAmount;

            // ✅ Calculate Avg Transaction Unit & Value for overall
            acc.totalATU +=
                totals.totalConversionToSale > 0
                    ? totals.totalQtySold / totals.totalConversionToSale
                    : 0;
            acc.totalATV +=
                totals.totalConversionToSale > 0
                    ? totals.totalAmount / totals.totalConversionToSale
                    : 0;

            // ✅ Calculate Conversion % for overall
            acc.totalConversionPercentage +=
                totals.sales > 0
                    ? (totals.totalConversionToSale / totals.sales) * 100
                    : 0;

            acc.agentCount += 1; // Count total agents for averaging
            return acc;
        },
        {
            sales: 0,
            nonSales: 0,
            totalAmount: 0,
            totalQtySold: 0,
            totalConversionToSale: 0,
            newClientCount: 0,
            newNonBuyingCount: 0,
            existingActiveCount: 0,
            existingInactiveCount: 0,
            newClientConvertedAmount: 0,
            newNonBuyingConvertedAmount: 0,
            existingActiveConvertedAmount: 0,
            existingInactiveConvertedAmount: 0,
            totalATU: 0,
            totalATV: 0,
            totalConversionPercentage: 0,
            agentCount: 0,
        }
    );

    // ✅ Final Averages for % Conversion, ATU, and ATV
    return (
        <div className="overflow-x-auto max-h-screen overflow-y-auto">
            {loading ? (
                <p className="text-xs">Loading...</p>
            ) : (
                <table className="min-w-full bg-white border border-gray-300 shadow-md">
                    <thead className="bg-gray-100 text-[10px] uppercase text-gray-700">
                        <tr>
                            <th className="border p-2">Agent Name</th>
                            <th className="border p-2">Sales</th>
                            <th className="border p-2">Non-Sales</th>
                            <th className="border p-2">Amount</th>
                            <th className="border p-2">QTY Sold</th>
                            <th className="border p-2">Conversion to Sale</th>
                            <th className="border p-2">% Conversion Inquiry to Sales</th>
                            <th className="border p-2">New Client</th>
                            <th className="border p-2">New Non-Buying</th>
                            <th className="border p-2">Existing Active</th>
                            <th className="border p-2">Existing Inactive</th>
                            <th className="border p-2">New Client (Converted To Sales)</th>
                            <th className="border p-2">New Non-Buying (Converted To Sales)</th>
                            <th className="border p-2">Existing Active (Converted To Sales)</th>
                            <th className="border p-2">Existing Inactive (Converted To Sales)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(groupedMetrics).length > 0 ? (
                            Object.keys(groupedMetrics).map((refId, index) => {
                                const agentMetrics = groupedMetrics[refId];
                                const totals = calculateAgentTotals(agentMetrics);

                                // ✅ Calculate Conversion % 
                                const conversionPercentage =
                                    totals.sales === 0
                                        ? "0.00%"
                                        : `${((totals.totalConversionToSale / totals.sales) * 100).toFixed(2)}%`;

                                return (
                                    <tr key={index} className="text-center border-t text-[10px]">
                                        <td className="border p-2 whitespace-nowrap p-2">
                                            {getSalesAgentName(agentMetrics[0].SalesAgent)}
                                        </td>
                                        <td className="border p-2 whitespace-nowrap">{totals.sales}</td>
                                        <td className="border p-2 whitespace-nowrap">{totals.nonSales}</td>
                                        <td className="border p-2 whitespace-nowrap">
                                            {formatAmountWithPeso(totals.totalAmount)}
                                        </td>
                                        <td className="border p-2 whitespace-nowrap">{totals.totalQtySold}</td>
                                        <td className="border p-2 whitespace-nowrap">{totals.totalConversionToSale}</td>
                                        <td className="border p-2 whitespace-nowrap">{conversionPercentage}</td>
                                        <td className="border p-2 whitespace-nowrap">{totals.newClientCount}</td>
                                        <td className="border p-2 whitespace-nowrap">{totals.newNonBuyingCount}</td>
                                        <td className="border p-2 whitespace-nowrap">{totals.existingActiveCount}</td>
                                        <td className="border p-2 whitespace-nowrap">{totals.existingInactiveCount}</td>
                                        <td className="border p-2 whitespace-nowrap">{formatAmountWithPeso(totals.newClientConvertedAmount)}</td>
                                        <td className="border p-2 whitespace-nowrap">{formatAmountWithPeso(totals.newNonBuyingConvertedAmount)}</td>
                                        <td className="border p-2 whitespace-nowrap">{formatAmountWithPeso(totals.existingActiveConvertedAmount)}</td>
                                        <td className="border p-2 whitespace-nowrap">{formatAmountWithPeso(totals.existingInactiveConvertedAmount)}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={13} className="p-2 text-center text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-200 text-[10px] font-bold text-center">
                            <td className="border p-2">Total</td>
                            <td className="border p-2">{totals.sales}</td>
                            <td className="border p-2">{totals.nonSales}</td>
                            <td className="border p-2">{formatAmountWithPeso(totals.totalAmount)}</td>
                            <td className="border p-2">{totals.totalQtySold}</td>
                            <td className="border p-2">{totals.totalConversionToSale}</td>
                            <td className="border p-2">
                                {totals.sales === 0
                                    ? "0.00%"
                                    : `${((totals.totalConversionToSale / totals.sales) * 100).toFixed(2)}%`}
                            </td>
                            <td className="border p-2">{totals.newClientCount}</td>
                            <td className="border p-2">{totals.newNonBuyingCount}</td>
                            <td className="border p-2">{totals.existingActiveCount}</td>
                            <td className="border p-2">{totals.existingInactiveCount}</td>
                            <td className="border p-2">
                                {formatAmountWithPeso(totals.newClientConvertedAmount)}
                            </td>
                            <td className="border p-2">
                                {formatAmountWithPeso(totals.newNonBuyingConvertedAmount)}
                            </td>
                            <td className="border p-2">
                                {formatAmountWithPeso(totals.existingActiveConvertedAmount)}
                            </td>
                            <td className="border p-2">
                                {formatAmountWithPeso(totals.existingInactiveConvertedAmount)}
                            </td>
                        </tr>
                    </tfoot>

                </table>
            )}
        </div>
    );
};

export default AgentSalesConversion;
