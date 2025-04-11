import { NextApiRequest, NextApiResponse } from "next";
import { validateUser } from "@/lib/ModuleGlobal/mongodb";
import { serialize } from "cookie";
import { connectToDatabase } from "@/lib/ModuleGlobal/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const db = await connectToDatabase();
  const usersCollection = db.collection("users");

  // Find the user by email
  const user = await usersCollection.findOne({ Email });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  // Validate user credentials
  const result = await validateUser({ Email, Password });

  if (!result.success || !result.user) {
    return res.status(401).json({
      message: "Invalid credentials.",
    });
  }

  const userId = result.user._id.toString();

  // Set a session cookie
  res.setHeader(
    "Set-Cookie",
    serialize("session", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })
  );

  return res.status(200).json({
    message: "Login successful",
    userId,
  });
}
