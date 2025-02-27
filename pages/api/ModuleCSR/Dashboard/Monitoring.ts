import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb"; // Import connectToDatabase

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { startDate, endDate, ReferenceID, Role } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: "Missing required date parameters" });
    }

    const db = await connectToDatabase();
    const monitoringCollection = db.collection("monitoring");

    // Define match filter
    const matchFilter: any = {
      Gender: { $in: ["Male", "Female"] }, // Filter for Male and Female only
      createdAt: { $gte: new Date(startDate as string), $lte: new Date(endDate as string) },
    };

    // Apply ReferenceID filter only if Role is "Staff"
    if (Role === "Staff" && ReferenceID) {
      matchFilter.ReferenceID = ReferenceID;
    }

    // Aggregate gender count (Male vs Female)
    const result = await monitoringCollection.aggregate([
      { $match: matchFilter },
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
}
