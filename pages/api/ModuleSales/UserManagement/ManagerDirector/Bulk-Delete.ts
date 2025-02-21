import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";
import { ObjectId } from "mongodb";

export default async function bulkDelete(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const { userIds } = req.body;
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: "Invalid request: userIds must be a non-empty array." });
    }

    const db = await connectToDatabase();
    const userCollection = db.collection("users");

    const objectIds = userIds.map(id => new ObjectId(id));
    const result = await userCollection.deleteMany({ _id: { $in: objectIds } });

    res.status(200).json({ success: true, message: "Users deleted successfully", deletedCount: result.deletedCount });
  } catch (error) {
    console.error("Error deleting users:", error);
    res.status(500).json({ error: "Failed to delete users" });
  }
}
