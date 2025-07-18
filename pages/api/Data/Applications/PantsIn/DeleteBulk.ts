import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";
import { ObjectId } from "mongodb";

export default async function DeleteBulkOrders(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  const { ids } = req.body as { ids?: string[] };
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, error: "Missing or invalid ids array" });
  }

  try {
    const db = await connectToDatabase();

    // Convert string ids to ObjectId array
    const objectIds = ids.map((id) => new ObjectId(id));

    const result = await db
      .collection("TaskLog")
      .deleteMany({ _id: { $in: objectIds } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: "No orders found to delete" });
    }

    res.status(200).json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Bulk delete failed" });
  }
}
