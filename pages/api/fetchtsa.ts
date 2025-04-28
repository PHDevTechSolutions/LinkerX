import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const db = await connectToDatabase();

    try {
      const { Role } = req.query;

      if (!Role) {
        return res.status(400).json({ error: "Role is required" });
      }

      // Fetch users with the role "Territory Sales Associate"
      const users = await db.collection("users")
        .find({ Role })
        .project({ Firstname: 1, Lastname: 1, ReferenceID: 1, _id: 0 }) // Only fetch necessary fields
        .toArray();

      if (users.length === 0) {
        return res.status(404).json({ error: "No users found with this role" });
      }

      // Ensure the data is returned as an array
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
