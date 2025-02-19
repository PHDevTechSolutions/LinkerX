//pages/api/logout.ts

import { NextApiRequest, NextApiResponse } from "next";
import { destroySession } from "@/lib/Session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    await destroySession(req, res);
    res.status(200).json({ message: "Logout successful" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}