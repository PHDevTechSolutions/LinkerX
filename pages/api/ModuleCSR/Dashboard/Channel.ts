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

    const Xchire_db = await connectToDatabase();
    const Xchire_Collection = Xchire_db.collection("monitoring");

    // ✅ Define match filter with WrapUp and createdAt
    const matchFilter: any = {
        Channel: {
        $in: [
          "Google Maps",
          "Website",
          "FB Main",
          "FB EShome",
          "Viber",
          "Text Message",
          "Instagram",
          "Voice Call",
          "Email",
          "Whatsapp",
          "Shopify",
        ],
      },
      createdAt: { $gte: finalStartDate, $lte: finalEndDate },
    };

    // ✅ Apply ReferenceID filter only if Role is "Staff"
    if (Role === "Staff" && ReferenceID) {
      matchFilter.ReferenceID = ReferenceID;
    }

    // ✅ Aggregate Channel data
    const Xchire_result = await Xchire_Collection
      .aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: "$Channel",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    console.log("Aggregated Channel Data:", Xchire_result);
    res.status(200).json(Xchire_result);
  } catch (Xchire_error) {
    console.error("Error fetching monitoring data:", Xchire_error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching monitoring data",
        Xchire_error,
      });
  }
}
