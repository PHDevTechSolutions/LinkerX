import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";
import { ObjectId } from "mongodb";

export default async function UpdateOrder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  const { _id, ...payload } = req.body as { _id?: string } & Record<string, any>;
  if (!_id)
    return res.status(400).json({ success: false, error: "Missing _id" });

  try {
    const db = await connectToDatabase();
    const result = await db
      .collection("TaskLog")
      .updateOne(
        { _id: new ObjectId(_id) },
        { $set: { ...payload } } // update every field sent
      );

    if (result.matchedCount === 0)
      return res
        .status(404)
        .json({ success: false, error: "Order not found" });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Update failed" });
  }
}
