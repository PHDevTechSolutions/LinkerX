import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../app/ModuleCSR/lib/mongodb"; // Import connectToDatabase

export default async function fetchMetrics(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const { startDate, endDate } = req.query;

    // Determine the current month (start and end dates)
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Use provided dates or fallback to the current month's range
    const start = startDate ? new Date(startDate as string) : startOfMonth;
    const end = endDate ? new Date(endDate as string) : endOfMonth;

    try {
        const db = await connectToDatabase();
        const monitoringCollection = db.collection("monitoring");

        const matchConditions: any = {
            createdAt: { $gte: start, $lte: end } // Always filter based on the selected or default date range
        };

        // Aggregating traffic count, total amount, and quantity sold per userName based on traffic type (Sales vs Non-Sales) and status "Converted Into Sales"
        const aggregatedMetrics = await monitoringCollection
            .aggregate([
                { $match: matchConditions },
                {
                    $group: {
                        _id: "$SalesAgent", // Group by userName (Agent)
                        salesCount: {
                            $sum: { $cond: [{ $eq: ["$Traffic", "Sales"] }, 1, 0] }
                        },
                        nonSalesCount: {
                            $sum: { $cond: [{ $eq: ["$Traffic", "NonSales"] }, 1, 0] }
                        },
                        totalSalesAmount: {
                            $sum: {
                                $cond: [{ $eq: ["$Traffic", "Sales"] }, { $toDouble: "$Amount" }, 0]
                            }
                        },
                        totalQtySold: {
                            $sum: {
                                $cond: [{ $eq: ["$Traffic", "Sales"] }, { $toDouble: "$QtySold" }, 0]
                            }
                        },
                        convertedSalesCount: {
                            $sum: {
                                $cond: [{ $eq: ["$Status", "Converted Into Sales"] }, 1, 0]
                            }
                        },
                        newClientAmount: {
                            $sum: {
                                $cond: [{ $eq: ["$CustomerStatus", "New Client"] }, 1, 0]
                            }
                        },
                        newNonBuyingAmount: {
                            $sum: {
                                $cond: [{ $eq: ["$CustomerStatus", "New Non-Buying"] }, 1, 0]
                            }
                        },
                        existingActiveAmount: {
                            $sum: {
                                $cond: [{ $eq: ["$CustomerStatus", "Existing Active"] }, 1, 0]
                            }
                        },
                        existingInactiveAmount: {
                            $sum: {
                                $cond: [{ $eq: ["$CustomerStatus", "Existing Inactive"] }, 1, 0]
                            }
                        },
                        newClientAmountSales: {
                            $sum: {
                                $cond: [{ $eq: ["$CustomerStatus", "New Client"] }, { $toDouble: "$Amount" }, 0]
                            }
                        },
                        newNonBuyingAmountSales: {
                            $sum: {
                                $cond: [{ $eq: ["$CustomerStatus", "New Non-Buying"] }, { $toDouble: "$Amount" }, 0]
                            }
                        },
                        existingActiveAmountSales: {
                            $sum: {
                                $cond: [{ $eq: ["$CustomerStatus", "Existing Active"] }, { $toDouble: "$Amount" }, 0]
                            }
                        },
                        existingInactiveAmountSales: {
                            $sum: {
                                $cond: [{ $eq: ["$CustomerStatus", "Existing Inactive"] }, { $toDouble: "$Amount" }, 0]
                            }
                        },
                        createdAt: { $max: "$createdAt" }
                    }
                },
                { $sort: { _id: 1 } }
            ])
            .toArray();

        // Define the mapping of agent short codes to full names
        const agentMapping: { [key: string]: string } = {
            "LX-NCR-001": "Leroux Xchire",
            "LR-NCR-001": "Liesther Roluna",
            // Add more mappings here as needed
        };

        const result = aggregatedMetrics.map((data) => {
            // If the SalesAgent exists in the mapping, use the full name, otherwise fallback to the short code
            const salesAgentFormatted = agentMapping[data._id] || data._id;

            return {
                SalesAgent: salesAgentFormatted,
                salesCount: data.salesCount,
                nonSalesCount: data.nonSalesCount,
                totalSalesAmount: `₱${data.totalSalesAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
                totalQtySold: data.totalQtySold,
                convertedSalesCount: data.convertedSalesCount,
                newClientAmount: data.newClientAmount,
                newNonBuyingAmount: data.newNonBuyingAmount,
                existingActiveAmount: data.existingActiveAmount,
                existingInactiveAmount: data.existingInactiveAmount,

                newClientAmountSales: `₱${data.newClientAmountSales.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
                newNonBuyingAmountSales: `₱${data.newNonBuyingAmountSales.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
                existingActiveAmountSales: `₱${data.existingActiveAmountSales.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
                existingInactiveAmountSales: `₱${data.existingInactiveAmountSales.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,

                CreatedAt: data ? new Date(data.createdAt).toLocaleString("en-PH") : "N/A" // Format date
            };
        });

        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching metrics:", error);
        res.status(500).json({ error: "Failed to fetch metrics" });
    }
}
