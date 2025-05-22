import React, { useEffect, useState, useMemo } from "react";
import { CiExport } from "react-icons/ci";
import ExcelJS from "exceljs";
import { RiRefreshLine } from "react-icons/ri";

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
    startDate?: string;
    endDate?: string;
}

const AgentSalesConversion: React.FC<AgentSalesConversionProps> = ({
    ReferenceID,
    Role,
    startDate,
    endDate,
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
                `/api/ModuleCSR/Dashboard/AgentSalesConversion?ReferenceID=${ReferenceID}&Role=${Role}`
            );
            if (!response.ok) throw new Error("Failed to fetch metrics");

            let data = await response.json();

            // Filter if role is Staff
            if (Role === "Staff") {
                data = data.filter((m: Metric) => m.ReferenceID === ReferenceID);
            }

            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            if (start) start.setHours(0, 0, 0, 0);
            if (end) end.setHours(23, 59, 59, 999);

            const filteredData = data.filter(({ createdAt }: Metric) => {
                const created = new Date(createdAt);
                return (!start || created >= start) && (!end || created <= end);
            });

            setMetrics(filteredData);
        } catch (error) {
            console.error("Error fetching metrics:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch users and metrics on component mount or dependencies change
    useEffect(() => {
        fetchUsers();
        fetchMetrics();
    }, [ReferenceID, Role, startDate, endDate]);


    // ✅ Group by ReferenceID
    const groupedMetrics = useMemo(() => {
        return metrics.reduce((acc, metric) => {
            if (!acc[metric.SalesAgent]) {
                acc[metric.SalesAgent] = [];
            }
            acc[metric.SalesAgent].push(metric);
            return acc;
        }, {} as Record<string, Metric[]>);
    }, [metrics]);

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
                    case "New Non-Buying":
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
    const totals = useMemo(() => {
        return Object.values(groupedMetrics).reduce(
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

                acc.totalATU += totals.totalConversionToSale > 0 ? totals.totalQtySold / totals.totalConversionToSale : 0;
                acc.totalATV += totals.totalConversionToSale > 0 ? totals.totalAmount / totals.totalConversionToSale : 0;
                acc.totalConversionPercentage += totals.sales > 0 ? (totals.totalConversionToSale / totals.sales) * 100 : 0;

                acc.agentCount += 1;
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
    }, [groupedMetrics]);

    const exportToExcel = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("TSA Traffic to Sales Conversion");

        worksheet.columns = [
            { header: 'Agent Name', key: 'agentName', width: 25 },
            { header: 'Sales', key: 'sales', width: 10 },
            { header: 'Non-Sales', key: 'nonSales', width: 10 },
            { header: 'Amount', key: 'amount', width: 15 },
            { header: 'QTY Sold', key: 'qtySold', width: 10 },
            { header: 'Conversion to Sale', key: 'conversionToSale', width: 20 },
            { header: '% Conversion Inquiry to Sales', key: 'conversionPercentage', width: 25 },
            { header: 'New Client', key: 'newClientCount', width: 15 },
            { header: 'New Non-Buying', key: 'newNonBuyingCount', width: 18 },
            { header: 'Existing Active', key: 'existingActiveCount', width: 18 },
            { header: 'Existing Inactive', key: 'existingInactiveCount', width: 20 },
            { header: 'New Client (Converted To Sales)', key: 'newClientConvertedAmount', width: 30 },
            { header: 'New Non-Buying (Converted To Sales)', key: 'newNonBuyingConvertedAmount', width: 35 },
            { header: 'Existing Active (Converted To Sales)', key: 'existingActiveConvertedAmount', width: 35 },
            { header: 'Existing Inactive (Converted To Sales)', key: 'existingInactiveConvertedAmount', width: 35 },
        ];

        Object.keys(groupedMetrics).forEach((refId) => {
            const agentMetrics = groupedMetrics[refId];
            const totals = calculateAgentTotals(agentMetrics);
            const conversionPercentage =
                totals.sales === 0
                    ? "0.00%"
                    : `${((totals.totalConversionToSale / totals.sales) * 100).toFixed(2)}%`;

            worksheet.addRow({
                agentName: getSalesAgentName(agentMetrics[0].SalesAgent),
                sales: totals.sales,
                nonSales: totals.nonSales,
                amount: totals.totalAmount,
                qtySold: totals.totalQtySold,
                conversionToSale: totals.totalConversionToSale,
                conversionPercentage,
                newClientCount: totals.newClientCount,
                newNonBuyingCount: totals.newNonBuyingCount,
                existingActiveCount: totals.existingActiveCount,
                existingInactiveCount: totals.existingInactiveCount,
                newClientConvertedAmount: totals.newClientConvertedAmount,
                newNonBuyingConvertedAmount: totals.newNonBuyingConvertedAmount,
                existingActiveConvertedAmount: totals.existingActiveConvertedAmount,
                existingInactiveConvertedAmount: totals.existingInactiveConvertedAmount
            });
        });

        // Optional: add total row
        worksheet.addRow({}); // blank spacer
        const totalsRow = worksheet.addRow({
            agentName: 'Total',
            sales: totals.sales,
            nonSales: totals.nonSales,
            amount: totals.totalAmount,
            qtySold: totals.totalQtySold,
            conversionToSale: totals.totalConversionToSale,
            conversionPercentage:
                totals.sales === 0
                    ? "0.00%"
                    : `${((totals.totalConversionToSale / totals.sales) * 100).toFixed(2)}%`,
            newClientCount: totals.newClientCount,
            newNonBuyingCount: totals.newNonBuyingCount,
            existingActiveCount: totals.existingActiveCount,
            existingInactiveCount: totals.existingInactiveCount,
            newClientConvertedAmount: totals.newClientConvertedAmount,
            newNonBuyingConvertedAmount: totals.newNonBuyingConvertedAmount,
            existingActiveConvertedAmount: totals.existingActiveConvertedAmount,
            existingInactiveConvertedAmount: totals.existingInactiveConvertedAmount
        });

        totalsRow.font = { bold: true };

        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "TSATrafficSalesConversion.xlsx";
            link.click();
        });
    };


    // ✅ Final Averages for % Conversion, ATU, and ATV
    return (
        <div className="overflow-x-auto max-h-screen overflow-y-auto">
            {loading ? (
                <div className="flex justify-center items-center h-full w-full">
                    <div className="flex justify-center items-center w-30 h-30">
                        <RiRefreshLine size={30} className="animate-spin" />
                    </div>
                </div>
            ) : (
                <>
                    <h2 className="text-sm font-semibold mb-4 text-left">TSA Sales </h2>
                    <button onClick={exportToExcel} className="flex items-center gap-1 border mb-2 bg-white text-black text-xs px-4 py-2 shadow-sm rounded hover:bg-orange-500 hover:text-white transition">
                        <CiExport size={16} /> Export
                    </button>

                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-100 sticky top-0">
                            <tr className="text-xs text-left whitespace-nowrap border-l-4 border-emerald-400">
                                <th className="px-6 py-4 font-semibold text-gray-700">Agent Name</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Sales</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Non-Sales</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Amount</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">QTY Sold</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Conversion to Sale</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">% Conversion Inquiry to Sales</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">New Client</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">New Non-Buying</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Existing Active</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Existing Inactive</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">New Client (Converted To Sales)</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">New Non-Buying (Converted To Sales)</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Existing Active (Converted To Sales)</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Existing Inactive (Converted To Sales)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
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
                                        <tr key={index} className="border-b whitespace-nowrap">
                                            <td className="px-6 py-4 text-xs capitalize">
                                                {getSalesAgentName(agentMetrics[0].SalesAgent)}
                                            </td>
                                            <td className="px-6 py-4 text-xs">{totals.sales}</td>
                                            <td className="px-6 py-4 text-xs">{totals.nonSales}</td>
                                            <td className="px-6 py-4 text-xs">
                                                {formatAmountWithPeso(totals.totalAmount)}
                                            </td>
                                            <td className="px-6 py-4 text-xs">{totals.totalQtySold}</td>
                                            <td className="px-6 py-4 text-xs">{totals.totalConversionToSale}</td>
                                            <td className="px-6 py-4 text-xs">{conversionPercentage}</td>
                                            <td className="px-6 py-4 text-xs">{totals.newClientCount}</td>
                                            <td className="px-6 py-4 text-xs">{totals.newNonBuyingCount}</td>
                                            <td className="px-6 py-4 text-xs">{totals.existingActiveCount}</td>
                                            <td className="px-6 py-4 text-xs">{totals.existingInactiveCount}</td>
                                            <td className="px-6 py-4 text-xs">{formatAmountWithPeso(totals.newClientConvertedAmount)}</td>
                                            <td className="px-6 py-4 text-xs">{formatAmountWithPeso(totals.newNonBuyingConvertedAmount)}</td>
                                            <td className="px-6 py-4 text-xs">{formatAmountWithPeso(totals.existingActiveConvertedAmount)}</td>
                                            <td className="px-6 py-4 text-xs">{formatAmountWithPeso(totals.existingInactiveConvertedAmount)}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={13} className="p-2 text-center text-gray-500 text-xs">
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-200 text-xs font-bold text-left">
                                <td className="px-6 py-4 text-xs">Total</td>
                                <td className="px-6 py-4 text-xs">{totals.sales}</td>
                                <td className="px-6 py-4 text-xs">{totals.nonSales}</td>
                                <td className="px-6 py-4 text-xs">{formatAmountWithPeso(totals.totalAmount)}</td>
                                <td className="px-6 py-4 text-xs">{totals.totalQtySold}</td>
                                <td className="px-6 py-4 text-xs">{totals.totalConversionToSale}</td>
                                <td className="px-6 py-4 text-xs">
                                    {totals.sales === 0
                                        ? "0.00%"
                                        : `${((totals.totalConversionToSale / totals.sales) * 100).toFixed(2)}%`}
                                </td>
                                <td className="px-6 py-4 text-xs">{totals.newClientCount}</td>
                                <td className="px-6 py-4 text-xs">{totals.newNonBuyingCount}</td>
                                <td className="px-6 py-4 text-xs">{totals.existingActiveCount}</td>
                                <td className="px-6 py-4 text-xs">{totals.existingInactiveCount}</td>
                                <td className="px-6 py-4 text-xs">
                                    {formatAmountWithPeso(totals.newClientConvertedAmount)}
                                </td>
                                <td className="px-6 py-4 text-xs">
                                    {formatAmountWithPeso(totals.newNonBuyingConvertedAmount)}
                                </td>
                                <td className="px-6 py-4 text-xs">
                                    {formatAmountWithPeso(totals.existingActiveConvertedAmount)}
                                </td>
                                <td className="px-6 py-4 text-xs">
                                    {formatAmountWithPeso(totals.existingInactiveConvertedAmount)}
                                </td>
                            </tr>
                        </tfoot>

                    </table>
                </>
            )}
        </div>
    );
};

export default AgentSalesConversion;
