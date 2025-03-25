import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb"; // Import connectToDatabase

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    // ✅ Extract query parameters
    const { startDate, endDate, ReferenceID, Role } = req.query;

    // ✅ Get the current date and fallback to the start and end of the current month
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 0, 0, 0);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

    // ✅ Use provided dates or fallback to current month's range
    const start = startDate ? new Date(startDate as string) : startOfMonth;
    const end = endDate ? new Date(endDate as string) : endOfMonth;

    console.log("✅ Filtering by Date Range:", {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    });

    // ✅ Connect to MongoDB
    const db = await connectToDatabase();
    const monitoringCollection = db.collection("monitoring");

    // ✅ Define base match filter
    const matchFilter: any = {
      CustomerStatus: {
        $in: ["New Client", "New Non-Buying", "Existing Active", "Existing Inactive"],
      },
      createdAt: {
        $gte: start,
        $lte: end,
      },
    };

    // ✅ Apply ReferenceID filter only if Role is "Staff"
    if (Role === "Staff" && ReferenceID) {
      matchFilter.ReferenceID = ReferenceID;
    }

    // ✅ Aggregate customer status data
    const result = await monitoringCollection
      .aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: "$CustomerStatus", // Group by CustomerStatus
            count: { $sum: 1 }, // Count occurrences of each status
          },
        },
      ])
      .toArray();

    console.log("🎯 Aggregated Customer Status Data:", result);

    // ✅ Send success response
    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error fetching monitoring data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching monitoring data",
      error,
    });
  }
}
