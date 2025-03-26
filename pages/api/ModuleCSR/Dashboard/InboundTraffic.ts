import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb";

export default async function fetchMetrics(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { ReferenceID, Role } = req.query;

    // ✅ Validate Role and ReferenceID
    if (!Role || typeof Role !== "string") {
      return res.status(400).json({ error: "Invalid Role parameter" });
    }

    // ✅ Connect to database
    const db = await connectToDatabase();
    const monitoringCollection = db.collection("monitoring");

    // ✅ Role-based filtering
    const matchConditions: any = {};
    if (Role === "Staff" && ReferenceID) {
      matchConditions.ReferenceID = ReferenceID;
    } else if (Role !== "Admin" && Role !== "Super Admin") {
      return res.status(403).json({ error: "Unauthorized role" });
    }

    // ✅ Fetch documents from the monitoring collection
    const allMetrics = await monitoringCollection
      .find(matchConditions)
      .project({ createdAt: 1, Channel: 1 })
      .toArray();

    // ✅ Return all data (filtering happens on frontend)
    res.status(200).json(allMetrics);
  } catch (error: any) {
    console.error("Error fetching metrics:", error.message);
    res.status(500).json({
      error: "Failed to fetch metrics",
      details: error.message,
    });
  }
}
