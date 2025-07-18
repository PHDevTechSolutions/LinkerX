import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";
import { ObjectId } from "mongodb";

export default async function bulkTransfer(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const { userIds, managerReferenceID } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: "Invalid request: userIds must be a non-empty array." });
    }

    if (!managerReferenceID) {
      return res.status(400).json({ error: "Invalid request: tsmReferenceID must be provided." });
    }

    const db = await connectToDatabase();
    const userCollection = db.collection("users");

    const objectIds = userIds.map(id => new ObjectId(id));

    // Update only the TSM field for the selected users
    const result = await userCollection.updateMany(
      { _id: { $in: objectIds } },
      { $set: { Manager: managerReferenceID } }  // Using TSM instead of TSMReferenceID
    );

    res.status(200).json({
      success: true,
      message: `Transferred ${result.modifiedCount} users to TSM with ReferenceID ${managerReferenceID}`,
    });
  } catch (error) {
    console.error("Error transferring users:", error);
    res.status(500).json({ error: "Failed to transfer users" });
  }
}
