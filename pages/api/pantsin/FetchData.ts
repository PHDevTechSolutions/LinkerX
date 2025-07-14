import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from '@/lib/MongoDB';

export default async function fetchAccounts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    const db = await connectToDatabase();
    const UserCollection = db.collection("TaskLog");
    const data = await UserCollection.find({}).toArray();

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch data" });
  }
}
