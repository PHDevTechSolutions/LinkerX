import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb"; // Import connectToDatabase

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    // ✅ Extract query parameters
    const { ReferenceID, Role, month, year } = req.query;

    // ✅ Define date range based on month and year
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const selectedYear = parseInt((year as string) || `${currentYear}`);
    const selectedMonth = parseInt((month as string) || `${currentMonth}`);

    const startOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
    const endOfMonth = new Date(selectedYear, selectedMonth, 0, 23, 59, 59);

    console.log("Filtering by Date Range:", startOfMonth, endOfMonth);

    const db = await connectToDatabase();
    const monitoringCollection = db.collection("monitoring");

    // ✅ Define match filter
    const matchFilter: any = {
      Source: {
        $in: [
          "FB Ads", "Viber Community / Viber", "Whatsapp Community / Whatsapp",
          "SMS", "Website", "Word of Mouth", "Quotation Docs", "Google Search",
          "Email Blast", "Agent Call", "Catalogue", "Shopee", "Lazada",
          "Tiktok", "Worldbex", "PhilConstruct", "Calendar", "Product Demo"
        ],
      },
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    };

    // ✅ Apply ReferenceID filter only if Role is "Staff"
    if (Role === "Staff" && ReferenceID) {
      matchFilter.ReferenceID = ReferenceID;
    }

    // ✅ Aggregate source data
    const result = await monitoringCollection
      .aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: "$Source",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    console.log("Aggregated Source Data:", result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching monitoring data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching monitoring data",
      error,
    });
  }
}
