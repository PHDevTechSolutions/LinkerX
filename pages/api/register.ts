//pages/api/register.ts

import { NextApiRequest, NextApiResponse } from "next";
import { registerUser } from "../../lib/MongoDB"; // Ensure this path is correct

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { userName, Email, Password } = req.body;

    if (!userName || !Email || !Password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
      const response = await registerUser({ userName, Email, Password });
      if (response.success) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(400).json({ success: false, message: response.message });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: "An error occurred while registering!" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}