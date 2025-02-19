import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@/lib/Session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req);

    if (session) {
      res.status(200).json({ isLoggedIn: true });
    } else {
      res.status(401).json({ isLoggedIn: false });
    }
  } catch (error) {
    console.error("Error during session check:", error);
    res.status(500).json({ isLoggedIn: false });
  }
}
