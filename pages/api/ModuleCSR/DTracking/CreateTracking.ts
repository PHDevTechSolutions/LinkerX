import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb";

async function create({
  ReferenceID,
  userName,
  DateRecord,
  CompanyName,
  CustomerName,
  ContactNumber,
  TicketType,
  TicketConcern,
  TrackingStatus,
  TrackingRemarks,
  Department,
  EndorsedDate,
  ClosedDate,
  SalesAgent,
  SalesManager,
  NatureConcern,
}: {
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
  SalesManager: string;
  NatureConcern: string;
}) {
  const db = await connectToDatabase();

  const trackingCollection = db.collection("Tracking");
  const accountsCollection = db.collection("accounts");

  // Insert into Tracking
  const newTrackingEntry = {
    ReferenceID,
    userName,
    DateRecord,
    CompanyName,
    CustomerName,
    ContactNumber,
    TicketType,
    TicketConcern,
    TrackingStatus,
    TrackingRemarks,
    Department,
    EndorsedDate,
    ClosedDate,
    SalesAgent,
    SalesManager,
    NatureConcern,
    createdAt: new Date(),
  };

  await trackingCollection.insertOne(newTrackingEntry);

  // Insert into Accounts (if needed, avoid duplicates)
  const existingAccount = await accountsCollection.findOne({ CompanyName, ContactNumber });

  if (!existingAccount) {
    const newAccountEntry = {
      ReferenceID,
      CompanyName,
      CustomerName,
      ContactNumber,
      createdAt: new Date(),
    };
    await accountsCollection.insertOne(newAccountEntry);
  }

  // Emit socket event if defined
  if (typeof io !== "undefined" && io) {
    io.emit("newAccount", newTrackingEntry);
  }

  return { success: true };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const {
      ReferenceID,
      userName,
      DateRecord,
      CompanyName,
      CustomerName,
      ContactNumber,
      TicketType,
      TicketConcern,
      TrackingStatus,
      TrackingRemarks,
      Department,
      EndorsedDate,
      ClosedDate,
      SalesAgent,
      SalesManager,
      NatureConcern,
    } = req.body;

    if (!CompanyName || !CustomerName || !ContactNumber) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    try {
      const result = await create({
        ReferenceID,
        userName,
        DateRecord,
        CompanyName,
        CustomerName,
        ContactNumber,
        TicketType,
        TicketConcern,
        TrackingStatus,
        TrackingRemarks,
        Department,
        EndorsedDate,
        ClosedDate,
        SalesAgent,
        SalesManager,
        NatureConcern,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error("Error adding account:", error);
      res.status(500).json({
        success: false,
        message: "Error adding account",
        error,
      });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
