import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";
import { ObjectId } from "mongodb";

export default async function DeleteOrder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  const { id } = req.body as { id?: string };
  if (!id) return res.status(400).json({ success: false, error: "Missing id" });

  try {
    const db = await connectToDatabase();
    const result = await db
      .collection("TaskLog")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0)
      return res
        .status(404)
        .json({ success: false, error: "Order not found" });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Delete failed" });
  }
}
