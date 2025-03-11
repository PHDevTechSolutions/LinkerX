import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const db = await connectToDatabase();
    const { Role, TSM } = req.query;

    // Error handling for missing query parameters
    if (!Role || !TSM) {
      return res.status(400).json({ error: "Role and TSM are required" });
    }

    console.log("Fetching TSA with Role:", Role, "and TSM:", TSM); // Debugging log

    // Find TSA accounts under the given TSM (ReferenceID)
    const users = await db.collection("users")
      .find({ Role, TSM }) // Filter by Role & TSM
      .project({ Firstname: 1, Lastname: 1, ReferenceID: 1, TSM: 1, _id: 0 }) // Only include required fields
      .toArray();

    if (users.length === 0) {
      return res.status(404).json({ error: "No TSA users found for this TSM" });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching TSA list:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
