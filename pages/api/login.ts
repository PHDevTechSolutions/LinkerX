import { NextApiRequest, NextApiResponse } from "next";
import { validateUser } from "@/lib/MongoDB";
import { serialize } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { Email, Password, Department } = req.body;

  if (!Email || !Password || !Department) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Validate user credentials
  const result = await validateUser({ Email, Password, Department });

  if (!result.success || !result.user) {
    return res.status(401).json({ message: result.message || "Invalid credentials." });
  }

  // Ensure the user belongs to the correct department
  if (result.user.Department !== Department) {
    return res.status(403).json({ message: "Department mismatch! Please check your selection." });
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
    Department: result.user.Department, // Return department for frontend validation
  });
}
