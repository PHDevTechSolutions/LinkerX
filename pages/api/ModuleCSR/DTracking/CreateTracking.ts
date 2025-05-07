import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb"; // Import connectToDatabase

// Function to add an account directly in this file
async function create({ ReferenceID, userName, DateRecord, CompanyName, CustomerName, ContactNumber, 
  TicketType, TicketConcern, TrackingStatus, TrackingRemarks, Department, EndorsedDate, ClosedDate, SalesAgent, SalesManager, NatureConcern, }: {

  ReferenceID: string;
  userName: string;
  DateRecord: string;
  CompanyName: string;
  CustomerName: string;
  ContactNumber: string;
  TicketType: string;
  TicketConcern: string;
  TrackingStatus: string;
  TrackingRemarks: string;
  Department: string;
  EndorsedDate: string;
  ClosedDate: string;
  SalesAgent: string;
  SalesManager:  string;
  NatureConcern: string;
}) {
  const Xchire_db = await connectToDatabase();
  const Xchire_Collection = Xchire_db.collection("Tracking");
  const newAccount = { ReferenceID, userName, DateRecord, CompanyName, CustomerName, ContactNumber, TicketType, TicketConcern, TrackingStatus, 
    TrackingRemarks, Department, EndorsedDate, ClosedDate, SalesAgent, SalesManager, NatureConcern, createdAt: new Date(), };
  await Xchire_Collection.insertOne(newAccount);

  // Broadcast logic if needed
  if (typeof io !== "undefined" && io) {
    io.emit("newAccount", newAccount);
  }

  return { success: true };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { ReferenceID, userName, DateRecord, CompanyName, CustomerName, ContactNumber, TicketType, TicketConcern, TrackingStatus, 
      TrackingRemarks, Department, EndorsedDate, ClosedDate, SalesAgent, SalesManager, NatureConcern } = req.body;

    // Validate required fields
    if (!CompanyName) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    try {
      const Xchire_insert = await create({ ReferenceID, userName, DateRecord, CompanyName, CustomerName, ContactNumber, TicketType, TicketConcern, TrackingStatus, 
        TrackingRemarks, Department, EndorsedDate, ClosedDate, SalesAgent, SalesManager, NatureConcern });
      res.status(200).json(Xchire_insert);
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
