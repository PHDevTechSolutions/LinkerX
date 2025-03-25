import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb"; // Import connectToDatabase

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    // Extract query parameters
    const { month, year, ReferenceID, Role } = req.query;

    // Validate month and year parameters
    if (!month || !year) {
      return res.status(400).json({ success: false, message: "Month and year are required" });
    }

    // Define the start and end of the selected month and year
    const monthInt = parseInt(month as string);
    const yearInt = parseInt(year as string);
    const startOfMonth = new Date(yearInt, monthInt - 1, 1); // First day of the month
    const endOfMonth = new Date(yearInt, monthInt, 0, 23, 59, 59); // Last day of the month

    console.log("Filtering by Date Range:", startOfMonth, endOfMonth); // Debugging

    // Connect to the database
    const db = await connectToDatabase();
    const monitoringCollection = db.collection("monitoring");

    // Define match filter with date range and gender filter
    const matchFilter: any = {
      Gender: { $in: ["Male", "Female"] }, // Filter only Male and Female
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }, // Date range filter
    };

    // Apply ReferenceID filter only if Role is "Staff"
    if (Role === "Staff" && ReferenceID) {
      matchFilter.ReferenceID = ReferenceID;
    }

    // Aggregate gender count (Male vs Female)
    const result = await monitoringCollection
      .aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: "$Gender", // Group by gender
            count: { $sum: 1 }, // Count each gender occurrence
          },
        },
      ])
      .toArray();

    console.log("Aggregated Gender Data:", result); // Debugging
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching monitoring data:", error);
    res.status(500).json({ success: false, message: "Error fetching monitoring data", error });
  }
}
