import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb";

export default async function fetch(
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
    const Xchire_db = await connectToDatabase();
    const Xchire_Collection = Xchire_db.collection("monitoring");

    // ✅ Role-based filtering
    const matchConditions: any = {};
    if (Role === "Staff" && ReferenceID) {
      matchConditions.ReferenceID = ReferenceID;
    } else if (Role !== "Admin" && Role !== "Super Admin") {
      return res.status(403).json({ error: "Unauthorized role" });
    }

    // ✅ Fetch documents from the monitoring collection
    const allMetrics = await Xchire_Collection
      .find(matchConditions)
      .project({ createdAt: 1, WrapUp: 1 })
      .toArray();

    // ✅ Return all data (filtering happens on frontend)
    res.status(200).json(allMetrics);
  } catch (Xchire_error: any) {
    console.error("Error fetching metrics:", Xchire_error.message);
    res.status(500).json({
      error: "Failed to fetch metrics",
      details: Xchire_error.message,
    });
  }
}
