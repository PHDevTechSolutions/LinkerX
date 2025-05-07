import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb"; // Import connectToDatabase

export default async function fetch(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const { startDate, endDate, ReferenceID, Role } = req.query;

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

        // Fixed list of channels
        const channels = [
            "Google Maps", "Website", "FB Main", "FB EShome", "Viber",
            "Text Message", "Instagram", "Voice Call", "Email", "WhatsApp"
        ];

        // Build the match condition based on the date range
        const matchConditions: any = {
            Status: "Converted Into Sales",
            createdAt: { $gte: start, $lte: end } // Always filter based on the selected or default date range
        };

        // Role-based filtering
        if (Role === "Staff" && ReferenceID) {
            matchConditions.ReferenceID = ReferenceID; // Staff can only see their assigned data
        } else if (Role === "Admin") {
            // Super Admin and Admin can see all data (no additional filtering)
        } else {
            return res.status(403).json({ error: "Unauthorized role" });
        }

        // Aggregating traffic count, amount, and createdAt per channel
        const aggregatedMetrics = await Xchire_Collection
            .aggregate([
                { $match: matchConditions }, // Apply the dynamic date range filter
                {
                    $group: {
                        _id: "$Channel", // Group by Channel
                        count: { $sum: 1 }, // Count occurrences per channel
                        totalAmount: { $sum: { $toDouble: "$Amount" } }, // Ensure Amount is treated as a number
                        convertedSales: { $sum: 1 }, // Count only converted sales
                        totalQty: { $sum: { $toDouble: "$QtySold" } },
                        createdAt: { $max: "$createdAt" } // Get the latest createdAt timestamp
                    }
                },
                { $sort: { _id: 1 } } // Sort alphabetically by channel name
            ])
            .toArray();

        // Convert MongoDB result to expected format
        const Xchire_result = channels.map(channel => {
            const data = aggregatedMetrics.find(m => m._id === channel);
            return {
                Role, // Include Role in the response
                Total: channel, // Display category name
                Count: data ? data.count : 0, // Total count
                Amount: data ? `₱${data.totalAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}` : "₱0.00", // Format amount in PHP
                ConvertedSales: data ? data.convertedSales : 0, // Count of converted sales
                TotalQty: data ? data.totalQty : 0,
                CreatedAt: data ? new Date(data.createdAt).toLocaleString("en-PH") : "N/A" // Format date
            };
        });

        console.log("Final Result:", Xchire_result); // Debugging log
        res.status(200).json(Xchire_result);
    } catch (Xchire_error) {
        console.error("Error fetching metrics:", Xchire_error);
        res.status(500).json({ error: "Failed to fetch metrics" });
    }
}
