import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb"; // Import connectToDatabase

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { startDate, endDate, ReferenceID, Role } = req.query;

    // Get the current date and calculate the start and end of the current month
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Use provided dates or fallback to the current month's range
    const start = startDate ? new Date(startDate as string) : startOfMonth;
    const end = endDate ? new Date(endDate as string) : endOfMonth;

    try {
      const db = await connectToDatabase();
      const monitoringCollection = db.collection("monitoring");

      // Base query filter
      let matchFilter: any = {
        CustomerStatus: { $in: ["New Client", "New Non-Buying", "Existing Active", "Existing Inactive"] },
        createdAt: { $gte: start, $lte: end }, // Filter records within the start and end dates
      };

      // Apply ReferenceID filter only if Role is "Staff"
      if (Role === "Staff" && ReferenceID) {
        matchFilter.ReferenceID = ReferenceID;
      }

      // Aggregating customer status count within the date range
      const result = await monitoringCollection.aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: "$CustomerStatus", // Group by CustomerStatus
            count: { $sum: 1 }, // Count occurrences of each status
          },
        },
      ]).toArray();

      console.log("Aggregated Customer Status Data:", result); // Debug log
      res.status(200).json(result); // Return the aggregated result
    } catch (error) {
      console.error("Error fetching monitoring data:", error);
      res.status(500).json({ success: false, message: "Error fetching monitoring data", error });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
