import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb"; // Import connectToDatabase

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    // ✅ Extract query parameters
    const { month, year, ReferenceID, Role } = req.query;

    // ✅ Define date range based on selected month and year
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const selectedYear = parseInt((year as string) || `${currentYear}`);
    const selectedMonth = parseInt((month as string) || `${currentMonth}`);

    const startOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
    const endOfMonth = new Date(selectedYear, selectedMonth, 0, 23, 59, 59);

    console.log("✅ Filtering by Date Range:", {
      startDate: startOfMonth.toISOString(),
      endDate: endOfMonth.toISOString(),
    });

    // ✅ Connect to MongoDB
    const db = await connectToDatabase();
    const monitoringCollection = db.collection("monitoring");

    // ✅ Define base match filter
    const matchFilter: any = {
      CustomerType: {
        $in: ["B2B", "B2C", "B2G", "Gentrade", "Modern Trade"],
      },
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    };

    // ✅ Apply ReferenceID filter only if Role is "Staff"
    if (Role === "Staff" && ReferenceID) {
      matchFilter.ReferenceID = ReferenceID;
    }

    // ✅ Aggregate customer type data
    const result = await monitoringCollection
      .aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: "$CustomerType",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    console.log("🎯 Aggregated CustomerType Data:", result);

    // ✅ Send success response
    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error fetching customer type data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching customer type data",
      error,
    });
  }
}
