import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { month, year, ReferenceID, Role } = req.query;

    if (!month || !year) {
      return res.status(400).json({ success: false, message: "Month and year are required" });
    }

    const monthInt = parseInt(month as string);
    const yearInt = parseInt(year as string);

    const startOfMonth = new Date(yearInt, monthInt - 1, 1, 0, 0, 0, 0);
    const now = new Date();
    let endOfMonth: Date;

    const isCurrentMonth = now.getFullYear() === yearInt && (now.getMonth() + 1) === monthInt;

    if (isCurrentMonth) {
      // If the selected month is current month, end at "now"
      endOfMonth = now;
    } else {
      // Else, end at the last second of the last day of the selected month
      endOfMonth = new Date(yearInt, monthInt, 0, 23, 59, 59, 999);
    }

    console.log("Filtering by Date Range:", startOfMonth, endOfMonth);

    const db = await connectToDatabase();
    const monitoringCollection = db.collection("monitoring");

    const matchFilter: any = {
      Gender: { $in: ["Male", "Female"] },
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    };

    if (Role === "Staff" && ReferenceID) {
      matchFilter.ReferenceID = ReferenceID;
    }

    const result = await monitoringCollection.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: "$Gender",
          count: { $sum: 1 },
        },
      },
    ]).toArray();

    console.log("Aggregated Gender Data:", result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching monitoring data:", error);
    res.status(500).json({ success: false, message: "Error fetching monitoring data", error });
  }
}
