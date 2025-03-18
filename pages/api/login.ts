import { NextApiRequest, NextApiResponse } from "next";
import { validateUser } from "@/lib/MongoDB";
import { serialize } from "cookie";
import { connectToDatabase } from "@/lib/MongoDB";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { Email, Password, Department, recaptchaToken } = req.body;

  if (!Email || !Password || !Department || !recaptchaToken) {
    return res.status(400).json({ message: "All fields are required, including reCAPTCHA." });
  }

  // **Step 1: Verify reCAPTCHA Token**
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${recaptchaSecret}&response=${recaptchaToken}`,
  });

  const recaptchaData = await recaptchaResponse.json();
  if (!recaptchaData.success || recaptchaData.score < 0.5) {
    return res.status(400).json({ message: "reCAPTCHA verification failed. Please try again." });
  }

  // **Step 2: Database Operations After Captcha Validation**
  const db = await connectToDatabase();
  const usersCollection = db.collection("users");

  const user = await usersCollection.findOne({ Email });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const now = new Date();
  const lockDuration = 50 * 365 * 24 * 60 * 60 * 1000; // 50 years
  const lockUntil = user.LockUntil ? new Date(user.LockUntil) : null;

  if (user.Status === "Locked" && lockUntil && lockUntil > now) {
    return res.status(403).json({
      message: `Account is locked. Try again after ${lockUntil.toLocaleString()}.`,
      lockUntil: lockUntil.toISOString(),
    });
  }

  const result = await validateUser({ Email, Password, Department });

  if (!result.success || !result.user) {
    const attempts = (user.LoginAttempts || 0) + 1;

    if (attempts >= 3) {
      const newLockUntil = new Date(now.getTime() + lockDuration);
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

    return res.status(401).json({ message: "Invalid credentials." });
  }

  if (result.user.Department !== Department) {
    return res.status(403).json({ message: "Department mismatch! Please check your selection." });
  }

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
    Department: result.user.Department,
  });
}
