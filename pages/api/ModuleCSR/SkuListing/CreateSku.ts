import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb"; // Import connectToDatabase

// Function to add an account directly in this file
async function create({ UserID, userName, DateTime, CompanyName, ItemCategory, ItemCode, ItemDescription, Qty, SalesAgent }: {
  UserID: string;
  userName: string;
  DateTime: string;
  CompanyName: string;
  ItemCategory: string;
  ItemCode: string;
  ItemDescription: string;
  Qty: string;
  SalesAgent: string;
}) {
  const Xchire_db = await connectToDatabase();
  const Xchire_Collection = Xchire_db.collection("skulisting");
  const newAccount = { UserID, userName, DateTime, CompanyName, ItemCategory, ItemCode, ItemDescription, Qty, SalesAgent, createdAt: new Date(), };
  await Xchire_Collection.insertOne(newAccount);

  // Broadcast logic if needed
  if (typeof io !== "undefined" && io) {
    io.emit("newAccount", newAccount);
  }

  return { success: true };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { UserID, userName, DateTime, CompanyName, ItemCategory, ItemCode, ItemDescription, Qty, SalesAgent } = req.body;

    // Validate required fields
    if (!CompanyName) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    try {
      const result = await create({ UserID, userName, DateTime, CompanyName, ItemCategory, ItemCode, ItemDescription, Qty, SalesAgent });
      res.status(200).json(result);
    } catch (Xchire_error) {
      console.error("Error adding account:", Xchire_error);
      res
        .status(500)
        .json({ success: false, message: "Error adding account", Xchire_error });
    }
  } else {
    res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}
