import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/app/ModuleCSR/lib/MongoDB"; // Import connectToDatabase

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // Extract startDate and endDate from query parameters
      const { startDate, endDate } = req.query;

      // If startDate or endDate is not provided, fallback to the current month
      const currentDate = new Date();
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const finalStartDate = startDate ? new Date(startDate as string) : startOfMonth;
      const finalEndDate = endDate ? new Date(endDate as string) : endOfMonth;

      // Log to verify the dates
      console.log("Filtering by Date Range:", finalStartDate, finalEndDate);

      const db = await connectToDatabase();
      const monitoringCollection = db.collection("monitoring");

      // Aggregate customer data with filtering by date range
      const result = await monitoringCollection.aggregate([
        {
          $match: {
            CustomerType: { $in: ["B2B", "B2C", "B2G", "Gentrade", "Modern Trade"] }, // Filter customer types
            createdAt: { $gte: finalStartDate, $lte: finalEndDate }, // Date filter
          },
        },
        {
          $group: {
            _id: "$CustomerType", // Group by customer type
            count: { $sum: 1 }, // Count occurrences
          },
        },
      ]).toArray();

      console.log("Aggregated CustomerType Data:", result); // Debug log for customer type data
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching monitoring data:", error);
      res.status(500).json({ success: false, message: "Error fetching monitoring data", error });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
