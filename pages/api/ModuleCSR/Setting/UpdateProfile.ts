import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export default async function update(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    id,
    Firstname,
    Lastname,
    Email,
    Role,
    Department,
    Status,
    ContactNumber,
    Password, // ✅ Make sure to destructure Password
  } = req.body;

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const Xchire_db = await connectToDatabase();
    const Xchire_Collection = Xchire_db.collection("users");

    const updatedUser: any = {
      Firstname,
      Lastname,
      Email,
      Role,
      Department,
      Status,
      ContactNumber,
      updatedAt: new Date(),
    };

    if (Password && Password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(Password, 10);
      updatedUser.Password = hashedPassword;
    }

    await Xchire_Collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedUser }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (Xchire_error) {
    console.error("Error updating profile:", Xchire_error);
    return res.status(500).json({ error: "Failed to update profile" });
  }
}
