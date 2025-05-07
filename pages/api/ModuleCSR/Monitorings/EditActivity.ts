import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb";
import { ObjectId } from 'mongodb';

export default async function update(req: NextApiRequest, res: NextApiResponse) {
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
    SOAmount,
    SONumber,
    QuotationNumber,
    QuotationAmount,
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
    createdAt,
    TicketReferenceNumber // optional: if provided, use this; otherwise, ReferenceID will be used
  } = req.body;

  try {
    const Xchire_db = await connectToDatabase();
    const Xchire_Collection = Xchire_db.collection('monitoring');

    const Xchire_update = { 
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
      SONumber,
      QuotationNumber,
      QuotationAmount,
      QtySold, 
      SOAmount,
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
      createdAt,
      updatedAt: new Date(),
    };

    // Update the record in the "monitoring" collection
    await Xchire_Collection.updateOne({ _id: new ObjectId(id) }, { $set: Xchire_update });
    
    // Use TicketReferenceNumber if provided; otherwise, fallback to ReferenceID
    const ticketRef = TicketReferenceNumber ? TicketReferenceNumber : ReferenceID;
    const message = `${userName} has been updated ticket - ${ticketRef} on ${createdAt.toLocaleString()}`;

    // Insert into the "MonitoringRecords" collection including the message field
    const monitoringRecordsCollection = Xchire_db.collection("MonitoringRecords");
    await monitoringRecordsCollection.insertOne({ ...Xchire_update, message });

    res.status(200).json({ success: true, message: 'Account updated successfully' });
  } catch (Xchire_error) {
    console.error('Error updating account:', Xchire_error);
    res.status(500).json({ error: 'Failed to update account' });
  }
}
