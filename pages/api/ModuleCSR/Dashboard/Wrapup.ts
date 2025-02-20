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
            WrapUp: { 
              $in: [
                "Customer Order", "Customer Inquiry Sales", "Customer Inquiry Non-Sales", "Follow Up Sales","After Sales", 
                "Customer Complaint", "Customer Feedback/Recommendation", "Job Inquiry", "Job Applicants", "Supplier/Vendor Product Offer", 
                "Follow Up Non-Sales", "Internal Whistle Blower", "Threats/Extortion/Intimidation", "Prank Call", "Supplier Accreditation Request", "Internal Concern", "Others"
              ] 
            }, // Filter for specific sources
            createdAt: { $gte: finalStartDate, $lte: finalEndDate }, // Filter based on date range
          },
        },
        {
          $group: {
            _id: "$WrapUp", // Group by source
            count: { $sum: 1 }, // Count occurrences
          },
        },
      ]).toArray();

      console.log("Aggregated WrapUp Data:", result); // Debug log for source data
      res.status(200).json(result); // Send the aggregated data as the response
    } catch (error) {
      console.error("Error fetching monitoring data:", error);
      res.status(500).json({ success: false, message: "Error fetching monitoring data", error });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
