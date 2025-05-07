import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb"; // Import connectToDatabase

// Function to add an account directly in this file
async function create({ 
  ReferenceID, userName, DateTime, CompanyName, ContactNumber, 
  PONumber, POAmount, SONumber, SODate, SalesAgent, PaymentTerms, 
  PaymentDate, DeliveryPickupDate, POStatus, POSource, Remarks }: {

  ReferenceID: string;
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
  Remarks: string;
}) {
  const Xchire_db = await connectToDatabase();
  const Xchire_Collection = Xchire_db.collection("monitoring");
  const newAccount = { ReferenceID, userName, DateTime, CompanyName, ContactNumber, PONumber, POAmount, SONumber, SODate, SalesAgent, PaymentTerms, PaymentDate, DeliveryPickupDate, POStatus, POSource, Remarks, createdAt: new Date(), };
  await Xchire_Collection.insertOne(newAccount);

  // Broadcast logic if needed
  if (typeof io !== "undefined" && io) {
    io.emit("newAccount", newAccount);
  }

  return { success: true };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { ReferenceID, userName, DateTime, CompanyName, ContactNumber, PONumber, POAmount, SONumber, SODate, SalesAgent, PaymentTerms, PaymentDate, DeliveryPickupDate, POStatus, POSource, Remarks } = req.body;

    // Validate required fields
    if (!CompanyName) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    try {
      const Xchire_result = await create({ ReferenceID, userName, DateTime, CompanyName, ContactNumber, PONumber, POAmount, SONumber, SODate, SalesAgent, PaymentTerms, PaymentDate, DeliveryPickupDate, POStatus, POSource, Remarks });
      res.status(200).json(Xchire_result);
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
