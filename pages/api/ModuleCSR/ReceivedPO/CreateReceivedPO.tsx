import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/app/ModuleCSR/lib/mongodb"; // Import connectToDatabase

// Function to add an account directly in this file
async function AddReceivedPO({ UserID, userName, DateTime, CompanyName, ContactNumber, PONumber, POAmount, SONumber, SODate, SalesAgent, PaymentTerms, PaymentDate, DeliveryPickupDate, POStatus, POSource }: {
  UserID: string;
  userName: string;
  DateTime: string;
  CompanyName: string;
  ContactNumber: string;
  PONumber: string;
  POAmount: string;
  SONumber: string;
  SODate: string;
  SalesAgent: string;
  PaymentTerms: string;
  PaymentDate: string;
  DeliveryPickupDate: string;
  POStatus: string;
  POSource: string;
}) {
  const db = await connectToDatabase();
  const accountsCollection = db.collection("monitoring");
  const newAccount = { UserID, userName, DateTime, CompanyName, ContactNumber, PONumber, POAmount, SONumber, SODate, SalesAgent, PaymentTerms, PaymentDate, DeliveryPickupDate, POStatus, POSource, createdAt: new Date(), };
  await accountsCollection.insertOne(newAccount);

  // Broadcast logic if needed
  if (typeof io !== "undefined" && io) {
    io.emit("newAccount", newAccount);
  }

  return { success: true };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { UserID, userName, DateTime, CompanyName, ContactNumber, PONumber, POAmount, SONumber, SODate, SalesAgent, PaymentTerms, PaymentDate, DeliveryPickupDate, POStatus, POSource } = req.body;

    // Validate required fields
    if (!CompanyName) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    try {
      const result = await AddReceivedPO({ UserID, userName, DateTime, CompanyName, ContactNumber, PONumber, POAmount, SONumber, SODate, SalesAgent, PaymentTerms, PaymentDate, DeliveryPickupDate, POStatus, POSource });
      res.status(200).json(result);
    } catch (error) {
      console.error("Error adding account:", error);
      res
        .status(500)
        .json({ success: false, message: "Error adding account", error });
    }
  } else {
    res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}
