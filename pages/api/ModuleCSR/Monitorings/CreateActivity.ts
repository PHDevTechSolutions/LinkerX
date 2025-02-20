import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb"; // Import connectToDatabase

// Function to add an account directly in this file
async function addMonitoring({ UserId, TicketReferenceNumber, userName, Role, CompanyName, CustomerName, Gender, ContactNumber, Email, CustomerSegment, CityAddress, Channel, WrapUp, Source, 
  CustomerType, CustomerStatus, Status, Amount, QtySold, SalesManager, SalesAgent, TicketReceived, TicketEndorsed, TsmAcknowledgeDate, TsaAcknowledgeDate,
  TsmHandlingTime, TsaHandlingTime, Remarks, Traffic, Inquiries, Department, ItemCode, ItemDescription, SONumber, PONumber, SODate, PaymentTerms, PaymentDate, DeliveryDate, POStatus, POSource,
}: {
  UserId: string;
  TicketReferenceNumber: string;
  userName: string;
  Role: string;
  CompanyName: string;
  CustomerName: string;
  Gender: string;
  ContactNumber: string;
  Email: string;
  CustomerSegment: string;
  CityAddress: string;
  Channel: string;
  WrapUp: string;
  Source: string;
  CustomerType: string;
  CustomerStatus: string;
  Status: string;
  Amount: number;
  QtySold: number;
  SalesManager: string;
  SalesAgent: string;
  TicketReceived: string;
  TicketEndorsed: string;
  TsmAcknowledgeDate: string;
  TsaAcknowledgeDate: string;
  TsmHandlingTime: string;
  TsaHandlingTime: string;
  Remarks: string;
  Traffic: string;
  Inquiries: string;
  Department: string;
  ItemCode: string;
  ItemDescription: string;

  SONumber: string;
  PONumber: string;
  SODate: string;
  PaymentTerms: string;
  PaymentDate: string;
  DeliveryDate: string;
  POStatus: string;
  POSource: string;

}) {
  const db = await connectToDatabase();
  const accountsCollection = db.collection("monitoring");
  const newMonitoring = { UserId, TicketReferenceNumber, userName, Role, CompanyName, CustomerName, Gender, ContactNumber, Email, CustomerSegment, CityAddress, Channel, WrapUp, Source, CustomerType, 
    CustomerStatus, Status, Amount, QtySold, SalesManager, SalesAgent, TicketReceived, TicketEndorsed, TsmAcknowledgeDate, TsaAcknowledgeDate,
    TsmHandlingTime, TsaHandlingTime, Remarks, Traffic, Inquiries, Department, ItemCode, ItemDescription, SONumber, PONumber, SODate, PaymentTerms, PaymentDate, DeliveryDate, POStatus, POSource, createdAt: new Date(), };
  await accountsCollection.insertOne(newMonitoring);

  // Broadcast logic if needed
  if (typeof io !== "undefined" && io) {
    io.emit("newMonitoring", newMonitoring);
  }

  return { success: true };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { UserId, TicketReferenceNumber, userName, Role, CompanyName, CustomerName, Gender, ContactNumber, Email, CustomerSegment, CityAddress, Channel, WrapUp, Source, CustomerType, 
      CustomerStatus, Status, Amount, QtySold, SalesManager, SalesAgent, TicketReceived, TicketEndorsed, TsmAcknowledgeDate, TsaAcknowledgeDate, TsmHandlingTime, 
      TsaHandlingTime, Remarks, Traffic, Inquiries, Department, ItemCode, ItemDescription, SONumber, PONumber, SODate, PaymentTerms, PaymentDate, DeliveryDate, POStatus, POSource } = req.body;

    // Validate required fields
    if (!CompanyName || !CustomerName) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    try {
      const result = await addMonitoring({ UserId, TicketReferenceNumber, userName, Role, CompanyName, CustomerName, Gender, ContactNumber, Email, CustomerSegment, CityAddress, Channel, WrapUp, Source, CustomerType, 
        CustomerStatus, Status, Amount, QtySold, SalesManager, SalesAgent, TicketReceived, TicketEndorsed, TsmAcknowledgeDate, TsaAcknowledgeDate, TsmHandlingTime, TsaHandlingTime, 
        Remarks, Traffic, Inquiries, Department, ItemCode, ItemDescription, SONumber, PONumber, SODate, PaymentTerms, PaymentDate, DeliveryDate, POStatus, POSource});
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
