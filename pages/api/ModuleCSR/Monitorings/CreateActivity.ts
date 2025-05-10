import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb"; // Import connectToDatabase

// Function to add an account directly in this file
async function create({ UserId, TicketReferenceNumber, userName, Role, ReferenceID, CompanyName, CustomerName, Gender, ContactNumber, Email, CustomerSegment, CityAddress, Channel, WrapUp, Source, 
  CustomerType, CustomerStatus, Status, Amount, QtySold, SalesManager, SalesAgent, TicketReceived, TicketEndorsed, TsmAcknowledgeDate, TsaAcknowledgeDate,
  TsmHandlingTime, TsaHandlingTime, Remarks, Traffic, Inquiries, Department, ItemCode, ItemDescription, SONumber, SOAmount, QuotationNumber, QuotationAmount, PONumber, SODate, PaymentTerms, PaymentDate, 
  DeliveryDate, POStatus, POSource, createdAt,
}: {
  UserId: string;
  TicketReferenceNumber: string;
  userName: string;
  Role: string;
  ReferenceID: string;
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
  SOAmount: string;
  PONumber: string;
  SODate: string;
  PaymentTerms: string;
  PaymentDate: string;
  DeliveryDate: string;
  POStatus: string;
  POSource: string;
  QuotationNumber: string;
  QuotationAmount: string;
  createdAt: string;

}) {
  const Xchire_db = await connectToDatabase();
  const Xchire_Collection = Xchire_db.collection("monitoring");
  
  const Xchire_insert = { UserId, TicketReferenceNumber, userName, Role, ReferenceID, CompanyName, CustomerName, Gender, ContactNumber, Email, CustomerSegment, CityAddress, Channel, WrapUp, Source, CustomerType, 
    CustomerStatus, Status, Amount, QtySold, SalesManager, SalesAgent, TicketReceived, TicketEndorsed, TsmAcknowledgeDate, TsaAcknowledgeDate,
    TsmHandlingTime, TsaHandlingTime, Remarks, Traffic, Inquiries, Department, ItemCode, ItemDescription, SONumber, SOAmount, QuotationNumber, QuotationAmount, PONumber, SODate, PaymentTerms, PaymentDate, DeliveryDate, POStatus, POSource, createdAt, };
  
  // Insert into "monitoring" collection
  await Xchire_Collection.insertOne(Xchire_insert);

  // Build the message for the MonitoringRecords collection
  const Xchire_message = `${userName} has been created ticket - ${TicketReferenceNumber} on ${createdAt.toLocaleString()}`;

  // Insert into the "MonitoringRecords" collection including the message field
  await Xchire_db.collection("MonitoringRecords").insertOne({ ...Xchire_insert, Xchire_message });

  // Insert into "accounts" collection
  const accounts_insert = {
    CompanyName,
    CustomerName,
    Gender,
    ContactNumber,
    Email,
    CityAddress,
    CustomerSegment,
    CustomerType,
    createdAt,
  };
  await Xchire_db.collection("accounts").insertOne(accounts_insert);

  // Broadcast logic if needed
  if (typeof io !== "undefined" && io) {
    io.emit("newMonitoring", Xchire_insert);
  }

  return { success: true };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { UserId, TicketReferenceNumber, userName, Role, ReferenceID, CompanyName, CustomerName, Gender, ContactNumber, Email, CustomerSegment, CityAddress, Channel, WrapUp, Source, CustomerType, 
      CustomerStatus, Status, Amount, QtySold, SalesManager, SalesAgent, TicketReceived, TicketEndorsed, TsmAcknowledgeDate, TsaAcknowledgeDate, TsmHandlingTime, 
      TsaHandlingTime, Remarks, Traffic, Inquiries, Department, ItemCode, ItemDescription, SONumber, SOAmount, QuotationNumber, QuotationAmount, PONumber, SODate, PaymentTerms, PaymentDate, DeliveryDate, POStatus, POSource, createdAt } = req.body;

    // Validate required fields
    if (!CompanyName || !CustomerName) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    try {
      const Xchire_result = await create({ UserId, TicketReferenceNumber, userName, Role, ReferenceID, CompanyName, CustomerName, Gender, ContactNumber, Email, CustomerSegment, CityAddress, Channel, WrapUp, Source, CustomerType, 
        CustomerStatus, Status, Amount, QtySold, SalesManager, SalesAgent, TicketReceived, TicketEndorsed, TsmAcknowledgeDate, TsaAcknowledgeDate, TsmHandlingTime, TsaHandlingTime, 
        Remarks, Traffic, Inquiries, Department, ItemCode, ItemDescription, SONumber, SOAmount, QuotationNumber, QuotationAmount, PONumber, SODate, PaymentTerms, PaymentDate, DeliveryDate, POStatus, POSource, createdAt});
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
