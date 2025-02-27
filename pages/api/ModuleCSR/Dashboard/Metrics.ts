import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb"; // Import connectToDatabase

export default async function fetchMetrics(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        const { startDate, endDate, ReferenceID, Role } = req.query;

        // Validate Role
        if (!Role || typeof Role !== "string") {
            return res.status(400).json({ error: "Invalid Role parameter" });
        }

        // Connect to database
        const db = await connectToDatabase();
        const monitoringCollection = db.collection("monitoring");

        // Fixed list of channels
        const channels = [
            "Google Maps", "Website", "FB Main", "FB EShome", "Viber",
            "Text Message", "Instagram", "Voice Call", "Email", "WhatsApp"
        ];

        // Determine the current month's start and end dates
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        startOfMonth.setHours(0, 0, 0, 0);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);

        // Use provided dates or fallback to current month
        const start = startDate ? new Date(startDate as string) : startOfMonth;
        const end = endDate ? new Date(endDate as string) : endOfMonth;

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ error: "Invalid date format" });
        }

        // Build match conditions
        const matchConditions: any = {
            Status: "Converted Into Sales",
            createdAt: { $gte: start, $lte: end }
        };

        // Role-based filtering
        if (Role === "Staff" && ReferenceID) {
            matchConditions.ReferenceID = ReferenceID;
        } else if (Role === "Admin" || Role === "SuperAdmin") {
            // Allow all data for Admin and SuperAdmin (no filtering needed)
        } else {
            return res.status(403).json({ error: "Unauthorized role" });
        }

        console.log("Match Conditions:", matchConditions); // Debugging

        // Aggregation query
        const aggregatedMetrics = await monitoringCollection
            .aggregate([
                { $match: matchConditions },
                {
                    $group: {
                        _id: "$Channel",
                        count: { $sum: 1 },
                        totalAmount: {
                            $sum: {
                                $convert: { input: "$Amount", to: "double", onError: 0, onNull: 0 }
                            }
                        },
                        convertedSales: { $sum: 1 },
                        totalQty: {
                            $sum: {
                                $convert: { input: "$QtySold", to: "double", onError: 0, onNull: 0 }
                            }
                        },
                        createdAt: { $max: "$createdAt" }
                    }
                },
                { $sort: { _id: 1 } }
            ])
            .toArray();

        console.log("Aggregated Metrics:", aggregatedMetrics); // Debugging

        // Convert result to expected format
        const result = channels.map(channel => {
            const data = aggregatedMetrics.find(m => m._id === channel);
            return {
                Role,
                Total: channel,
                Count: data ? data.count : 0,
                Amount: data ? `₱${data.totalAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}` : "₱0.00",
                ConvertedSales: data ? data.convertedSales : 0,
                TotalQty: data ? data.totalQty : 0,
                CreatedAt: data ? new Date(data.createdAt).toLocaleString("en-PH") : "N/A"
            };
        });

        res.status(200).json(result);
    } catch (error: any) {
        console.error("Error fetching metrics:", error.message);
        res.status(500).json({ error: "Failed to fetch metrics", details: error.message });
    }
}
