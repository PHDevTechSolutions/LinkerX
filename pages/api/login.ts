import { NextApiRequest, NextApiResponse } from "next";
import { validateUser } from "@/lib/MongoDB";
import { serialize } from "cookie";
import { connectToDatabase } from "@/lib/MongoDB";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { Email, Password, Department } = req.body;

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

  // Lock duration logic (50 years)
  const now = new Date();
  const lockDuration = 50 * 365 * 24 * 60 * 60 * 1000; // 50 years in milliseconds
  const lockUntil = user.LockUntil ? new Date(user.LockUntil) : null;

  if (user.Status === "Locked" && lockUntil && lockUntil > now) {
    return res.status(403).json({
      message: `Account is locked. Try again after ${lockUntil.toLocaleString()}.`,
      lockUntil: lockUntil.toISOString(),
    });
  }

  // Validate user credentials
  const result = await validateUser({ Email, Password, Department });

  if (!result.success || !result.user) {
    // Increment failed login attempts
    const attempts = (user.LoginAttempts || 0) + 1;

    if (attempts >= 3) {
      const newLockUntil = new Date(now.getTime() + lockDuration); // Lock for 50 years
      await usersCollection.updateOne(
        { Email },
        { 
          $set: { 
            LoginAttempts: attempts, 
            Status: "Locked", 
            LockUntil: newLockUntil.toISOString() 
          } 
        }
      );

      return res.status(403).json({
        message: `Account locked after 3 failed attempts. Try again after ${newLockUntil.toLocaleString()}.`,
        lockUntil: newLockUntil.toISOString(),
      });
    }

    await usersCollection.updateOne(
      { Email },
      { $set: { LoginAttempts: attempts } }
    );

    return res.status(401).json({
      message: "Invalid credentials.",
    });
  }

  // Ensure the user belongs to the correct department
  if (result.user.Department !== Department) {
    return res.status(403).json({ message: "Department mismatch! Please check your selection." });
  }

  // Reset login attempts on successful login
  await usersCollection.updateOne(
    { Email },
    { 
      $set: { 
        LoginAttempts: 0, 
        Status: "Active", 
        LockUntil: null 
      } 
    }
  );

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
