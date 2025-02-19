import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from "@/app/ModuleCSR/lib/MongoDB"; // Import connectToDatabase
import { ObjectId } from 'mongodb';

export default async function editAccount(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const { id, UserId, userName, Role, TicketReceived, TicketEndorsed, CompanyName, CustomerName, Gender, ContactNumber, Email, CustomerSegment, CityAddress, Channel, WrapUp, Source, CustomerType, 
        CustomerStatus, Status, OrderNumber, Amount, QtySold, SalesManager, SalesAgent, TsmAcknowledgeDate, TsaAcknowledgeDate, TsmHandlingTime, TsaHandlingTime, Remarks, 
        Traffic, Inquiries, Department, DateClosed } = req.body;

    try {
        const db = await connectToDatabase();
        const accountCollection = db.collection('monitoring');

        const updatedAccount = { UserId, userName, Role, CompanyName, TicketReceived, TicketEndorsed, CustomerName, Gender, ContactNumber, Email, CustomerSegment, CityAddress, Channel, WrapUp, Source, CustomerType, 
            CustomerStatus, Status, OrderNumber, Amount, QtySold, SalesManager, SalesAgent, TsmAcknowledgeDate, TsaAcknowledgeDate, TsmHandlingTime, TsaHandlingTime, Remarks, Traffic, Inquiries, Department, DateClosed,
            updatedAt: new Date(),
        };

        await accountCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedAccount });
        res.status(200).json({ success: true, message: 'Account updated successfully' });
    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({ error: 'Failed to update account' });
    }
}
