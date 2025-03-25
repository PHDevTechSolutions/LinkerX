import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb"; // Import connectToDatabase

export default async function fetchMetrics(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { ReferenceID, month, year } = req.query;

    // ✅ Validate month and year as numbers
    const selectedMonth = parseInt(month as string);
    const selectedYear = parseInt(year as string);

    if (isNaN(selectedMonth) || isNaN(selectedYear)) {
      return res.status(400).json({ error: "Invalid month or year" });
    }

    // ✅ Connect to database
    const db = await connectToDatabase();
    const monitoringCollection = db.collection("monitoring");

    // ✅ Fixed list of channels
    const channels = [
      "Google Maps",
      "Website",
      "FB Main",
      "FB EShome",
      "Viber",
      "Text Message",
      "Instagram",
      "Voice Call",
      "Email",
      "WhatsApp",
    ];

    // ✅ Build match conditions for filtering by date and status
    const matchConditions: any = {
      Status: "Converted Into Sales",
      $expr: {
        $and: [
          { $eq: [{ $month: "$createdAt" }, selectedMonth] },
          { $eq: [{ $year: "$createdAt" }, selectedYear] },
        ],
      },
    };

    // ✅ Optional filtering by ReferenceID
    if (ReferenceID) {
      matchConditions.ReferenceID = ReferenceID;
    }

    console.log("Match Conditions:", JSON.stringify(matchConditions)); // Debugging

    // ✅ Aggregation query to calculate metrics
    const aggregatedMetrics = await monitoringCollection
      .aggregate([
        { $match: matchConditions },
        {
          $group: {
            _id: "$Channel",
            count: { $sum: 1 },
            totalAmount: {
              $sum: {
                $convert: { input: "$Amount", to: "double", onError: 0, onNull: 0 },
              },
            },
            convertedSales: { $sum: 1 },
            totalQty: {
              $sum: {
                $convert: { input: "$QtySold", to: "double", onError: 0, onNull: 0 },
              },
            },
            createdAt: { $max: "$createdAt" },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    console.log("Aggregated Metrics:", aggregatedMetrics); // Debugging

    // ✅ Convert result to expected format
    const result = channels.map((channel) => {
      const data = aggregatedMetrics.find((m) => m._id === channel);
      return {
        Total: channel,
        Count: data ? data.count : 0,
        Amount: data
          ? `₱${data.totalAmount.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
            })}`
          : "₱0.00",
        ConvertedSales: data ? data.convertedSales : 0,
        TotalQty: data ? data.totalQty : 0,
        CreatedAt: data
          ? new Date(data.createdAt).toLocaleString("en-PH")
          : "N/A",
      };
    });

    // ✅ Return the final result
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error fetching metrics:", error.message);
    res.status(500).json({
      error: "Failed to fetch metrics",
      details: error.message,
    });
  }
}
