import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export default async function editAccount(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { id, UserId, Firstname, Lastname, Email, userName, Status, TargetQuota } = req.body;

  try {
    const db = await connectToDatabase();
    const userCollection = db.collection("users");

    // Prepare updated fields
    const updatedUser: any = {
      UserId, Firstname, Lastname, Email, userName, Status, TargetQuota, updatedAt: new Date(),
    };

    // Update user data
    const result = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedUser }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ success: true, message: "Account updated successfully" });
  } catch (error) {
    console.error("Error updating account:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
}
