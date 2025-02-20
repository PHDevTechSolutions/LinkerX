import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/app/ModuleCSR/lib/mongodb"; // Import connectToDatabase

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

      // Aggregate data based on the "Source" field and the provided date range
      const result = await monitoringCollection.aggregate([
        {
          $match: {
            Source: { 
              $in: [
                "FB Ads", "Viber Community / Viber", "Whatsapp Community / Whatsapp", 
                "SMS", "Website", "Word of Mouth", "Quotation Docs", "Google Search", 
                "Email Blast", "Agent Call", "Catalogue", "Shopee", "Lazada", 
                "Tiktok", "Worldbex", "PhilConstruct", "Calendar", "Product Demo"
              ] 
            }, // Filter for specific sources
            createdAt: { $gte: finalStartDate, $lte: finalEndDate }, // Filter based on date range
          },
        },
        {
          $group: {
            _id: "$Source", // Group by source
            count: { $sum: 1 }, // Count occurrences
          },
        },
      ]).toArray();

      console.log("Aggregated Source Data:", result); // Debug log for source data
      res.status(200).json(result); // Send the aggregated data as the response
    } catch (error) {
      console.error("Error fetching monitoring data:", error);
      res.status(500).json({ success: false, message: "Error fetching monitoring data", error });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
