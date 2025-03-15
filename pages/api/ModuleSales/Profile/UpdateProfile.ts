import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";
import { ObjectId } from "mongodb";

export default async function updateProfile(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { id, Firstname, Lastname, Email, Role, Department, Status } = req.body;

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const db = await connectToDatabase();
    const userCollection = db.collection("users");

    const updatedUser = {Firstname, Lastname, Email, Role, Department, Status, updatedAt: new Date(),
    };

    await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedUser }
    );

    res.status(200).json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
}
