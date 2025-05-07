import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb"; // Import connectToDatabase

export default async function fetch(req: NextApiRequest, res: NextApiResponse) {
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
        const Xchire_db = await connectToDatabase();
        const Xchire_Collection = Xchire_db.collection("monitoring");

        const matchConditions: any = {
            createdAt: { $gte: start, $lte: end } // Always filter based on the selected or default date range
        };

        // Aggregating traffic count, total amount, and quantity sold per userName based on traffic type (Sales vs Non-Sales) and status "Converted Into Sales"
        const aggregatedMetrics = await Xchire_Collection
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
            "RME-CDO-00": "Andrew Banaglorosio",
            "RME-CDO-004": "Annie Mabilanga",
            "AB-NCR-006": "Ansley Patelo",
            "RT-NCR-001": "Banjo Lising",
            "RT-NCR-013": "Cesar Paredes",
            "RDC-R1-001": "Cris Acierto",
            "AB-NCR-002": "Cristy Bobis",
            "RT-NCR-006": "Dionisio Doyugan",
            "NTL-DVO-003": "Duke Menil",
            "RT-NCR-014": "Erish Tomas Cajipe",
            "AB-NCR-008": "Erwin Laude",
            "RT-NCR-009": "Eryll Joyce Encina",
            "RT-NCR-005": "Gene Mark Roxas",
            "RT-NCR-004": "Gretchell Aquino",
            "RT-016": "Jean Dela Cerna",
            "AB-NCR-007": "Jeff Puying",
            "RT-NCR-002": "Jeffrey Lacson",
            "JS-NCR-001": "Jonna Clarin",
            "JS-NCR-005": "Julius Abuel",
            "AB-NCR-003": "Joseph Candazo",
            "NTL-DVO-001": "Khay Yango",
            "SH-DA-001": "Krista Ilaya",
            "RT-NCR-011": "Krizelle Payno",
            "RME-CDO-002": "Kurt Guanco",
            "RT-NCR-003": "Lotty Deguzman",
            "JP-CBU-002": "Mark Villagonzalo",
            "JS-NCR-003": "Michael Quijano",
            "RR-SLN-002": "Patrick Managuelod",
            "AB-NCR-009": "Princess Joy Ambre",
            "RT-NCR-012": "Raegan Bautista",
            "JP-CBU-004": "Reynaldo Piedad",
            "RT-NCR-015": "Randy Bacor",
            "RT-NCR-008": "Rodelio Ico",
            "RT-NCR-007": "Rodolfo Delizo",
            "RT-018": "Rosemarie Nollora",
            "RT-017": "Roselyn Barnes",
            "JS-NCR-002": "Sherilyn Rapote",
            "AB-NCR-005": "Vincent Ortiz",
            "AB-NCR-001": "Wilnie Ardelozo",
            "RT-NCR-016": "Agnes Angeli, Panopio",
            "NTL-DVO-004": "Arteo Angelo, Beseril",
            "RT-NCR-018": "Brian, Zantua",
            "JP-CBU-003": "Ferdinand, Canete",
            "RT-NCR-024": "Fortunato, Mabingnay",
            "JD-001": "Jayvee, Atienza",
            "RT-NCR-023": "Joy Merel, Soriente",
            "RT-NCR-021": "Niko, Gertes",
            "RT-NCR-019": "Richard, Esteban",
            // Add more mappings here as needed
        };

        const Xchire_result = aggregatedMetrics.map((data) => {
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

        res.status(200).json(Xchire_result);
    } catch (Xchire_error) {
        console.error("Error fetching metrics:", Xchire_error);
        res.status(500).json({ error: "Failed to fetch metrics" });
    }
}
