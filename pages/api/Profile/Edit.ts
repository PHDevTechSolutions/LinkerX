import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export default async function updateProfile(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id, Firstname, Lastname, Email, Role, Department, Status, ContactNumber, Password, profilePicture, ImapHost, ImapPass, } = req.body;

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const db = await connectToDatabase();
    const userCollection = db.collection("users");

    const updatedUser: any = { Firstname, Lastname, Email, Role, Department, Status, ContactNumber, updatedAt: new Date(),};

    if (profilePicture) {
      updatedUser.profilePicture = profilePicture;
    }

    if (Password && Password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(Password, 10);
      updatedUser.Password = hashedPassword;
    }

    if (ImapHost) {
      updatedUser.ImapHost = ImapHost;
    }

    if (ImapPass && ImapPass.trim() !== "") {
      const hashedImapPass = await bcrypt.hash(ImapPass, 10);
      updatedUser.ImapPass = hashedImapPass;
    }

    const result = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedUser }
    );

    if (result.modifiedCount === 1) {
      return res.status(200).json({ message: "Profile updated successfully" });
    } else {
      return res.status(404).json({ error: "User not found or no changes made" });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
