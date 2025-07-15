// /api/ModuleSales/IT/Asset/Update.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";
import { ObjectId } from "mongodb";

export default async function updateAsset(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    _id,
    location,
    designation,
    brand,
    model,
    serialNumber,
    ipAddress,
    macAddress,
    type,
    printerName,
    remarks,
    warrantyDate,
    siNumber,
    dateOfPurchase,
    price,
    status,
    oldUser,
    newUser,
    dateRelease,
    dateReturn,
    processor,
    ram,
    storage,
    accessories,
    inclusions,
  } = req.body;

  if (!_id) {
    return res.status(400).json({ error: "Missing asset ID (_id)" });
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection("Inventory");

    const updatedAsset = {
      location,
      designation,
      brand,
      model,
      serialNumber,
      ipAddress,
      macAddress,
      type,
      printerName,
      remarks,
      warrantyDate,
      siNumber,
      dateOfPurchase,
      price,
      status,
      oldUser,
      newUser,
      dateRelease,
      dateReturn,
      processor,
      ram,
      storage,
      accessories,
      inclusions,
      updatedAt: new Date(),
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: updatedAsset }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Asset not found" });
    }

    res.status(200).json({ success: true, message: "Asset updated successfully" });
  } catch (error) {
    console.error("Update asset error:", error);
    res.status(500).json({ error: "Failed to update asset" });
  }
}
