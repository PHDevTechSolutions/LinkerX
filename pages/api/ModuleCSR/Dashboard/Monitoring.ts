import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../app/ModuleCSR/lib/mongodb"; // Import connectToDatabase

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { startDate, endDate } = req.query;

      const db = await connectToDatabase();
      const monitoringCollection = db.collection("monitoring");

      // Aggregate gender count (Male vs Female)
      const result = await monitoringCollection.aggregate([
        {
          $match: {
            Gender: { $in: ["Male", "Female"] }, // Filter for Male and Female only
            createdAt: { $gte: new Date(startDate as string), $lte: new Date(endDate as string) }, // Date range filter
          },
        },
        {
          $group: {
            _id: "$Gender", // Group by gender
            count: { $sum: 1 }, // Count each gender occurrence
          },
        },
      ]).toArray();

      console.log("Aggregated Gender Data:", result); // Debug log for gender data
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching monitoring data:", error);
      res.status(500).json({ success: false, message: "Error fetching monitoring data", error });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}

