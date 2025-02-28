import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb";
import { ObjectId } from 'mongodb';

export default async function editAccount(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { 
    id, 
    UserId, 
    userName, 
    Role, 
    ReferenceID, 
    TicketReceived, 
    TicketEndorsed, 
    CompanyName, 
    CustomerName, 
    Gender, 
    ContactNumber, 
    Email, 
    CustomerSegment, 
    CityAddress, 
    Channel, 
    WrapUp, 
    Source, 
    CustomerType, 
    CustomerStatus, 
    Status, 
    OrderNumber, 
    Amount, 
    QtySold, 
    SalesManager, 
    SalesAgent, 
    TsmAcknowledgeDate, 
    TsaAcknowledgeDate, 
    TsmHandlingTime, 
    TsaHandlingTime, 
    Remarks, 
    Traffic, 
    Inquiries, 
    Department, 
    DateClosed,
    TicketReferenceNumber // optional: if provided, use this; otherwise, ReferenceID will be used
  } = req.body;

  try {
    const db = await connectToDatabase();
    const accountCollection = db.collection('monitoring');

    const updatedAccount = { 
      UserId, 
      userName, 
      Role, 
      ReferenceID, 
      CompanyName, 
      TicketReceived, 
      TicketEndorsed, 
      CustomerName, 
      Gender, 
      ContactNumber, 
      Email, 
      CustomerSegment, 
      CityAddress, 
      Channel, 
      WrapUp, 
      Source, 
      CustomerType, 
      CustomerStatus, 
      Status, 
      OrderNumber, 
      Amount, 
      QtySold, 
      SalesManager, 
      SalesAgent, 
      TsmAcknowledgeDate, 
      TsaAcknowledgeDate, 
      TsmHandlingTime, 
      TsaHandlingTime, 
      Remarks, 
      Traffic, 
      Inquiries, 
      Department, 
      DateClosed,
      updatedAt: new Date(),
    };

    // Update the record in the "monitoring" collection
    await accountCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedAccount });
    
    // Use TicketReferenceNumber if provided; otherwise, fallback to ReferenceID
    const ticketRef = TicketReferenceNumber ? TicketReferenceNumber : ReferenceID;
    const createdAt = new Date();
    const message = `${userName} has been updated ticket - ${ticketRef} on ${createdAt.toLocaleString()}`;

    // Insert into the "MonitoringRecords" collection including the message field
    const monitoringRecordsCollection = db.collection("MonitoringRecords");
    await monitoringRecordsCollection.insertOne({ ...updatedAccount, message });

    res.status(200).json({ success: true, message: 'Account updated successfully' });
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({ error: 'Failed to update account' });
  }
}
