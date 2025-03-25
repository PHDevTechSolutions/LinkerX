import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb"; // Import connectToDatabase

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    // Extract query parameters
    const { month, year, ReferenceID, Role } = req.query;

    // ✅ Define date range based on month and year
    let finalStartDate, finalEndDate;

    if (month && year) {
      const monthInt = parseInt(month as string, 10) - 1; // Convert to zero-based month
      const yearInt = parseInt(year as string, 10);

      finalStartDate = new Date(yearInt, monthInt, 1);
      finalEndDate = new Date(yearInt, monthInt + 1, 0, 23, 59, 59);
    } else {
      // Fallback to current month if no month or year provided
      const currentDate = new Date();
      finalStartDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      finalEndDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
        23,
        59,
        59
      );
    }

    console.log("Filtering by Date Range:", finalStartDate, finalEndDate);

    const db = await connectToDatabase();
    const monitoringCollection = db.collection("monitoring");

    // ✅ Define match filter with WrapUp and createdAt
    const matchFilter: any = {
      WrapUp: {
        $in: [
          "Customer Order",
          "Customer Inquiry Sales",
          "Customer Inquiry Non-Sales",
          "Follow Up Sales",
          "After Sales",
          "Customer Complaint",
          "Customer Feedback/Recommendation",
          "Job Inquiry",
          "Job Applicants",
          "Supplier/Vendor Product Offer",
          "Follow Up Non-Sales",
          "Internal Whistle Blower",
          "Threats/Extortion/Intimidation",
          "Prank Call",
          "Supplier Accreditation Request",
          "Internal Concern",
          "Others",
        ],
      },
      createdAt: { $gte: finalStartDate, $lte: finalEndDate },
    };

    // ✅ Apply ReferenceID filter only if Role is "Staff"
    if (Role === "Staff" && ReferenceID) {
      matchFilter.ReferenceID = ReferenceID;
    }

    // ✅ Aggregate WrapUp data
    const result = await monitoringCollection
      .aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: "$WrapUp",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    console.log("Aggregated WrapUp Data:", result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching monitoring data:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching monitoring data",
        error,
      });
  }
}
