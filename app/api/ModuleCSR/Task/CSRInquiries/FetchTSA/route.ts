import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const db = await connectToDatabase();

    try {
      const { Role, referenceId } = req.query;

      if (!Role) {
        return res.status(400).json({ error: "Role is required" });
      }

      // Check if referenceId is provided and filter by referenceId if available
      const query: any = { Role };
      if (referenceId) {
        query.ReferenceID = referenceId; // Filter by ReferenceID if provided
      }

      // Fetch users with the given role and optionally the referenceId
      const users = await db.collection("users")
        .find(query)
        .project({ Firstname: 1, Lastname: 1, ReferenceID: 1, _id: 0 }) // Include ReferenceID
        .toArray();

      if (users.length === 0) {
        return res.status(404).json({ error: "No users found with this role" });
      }

      return res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching tsa:", error);
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
