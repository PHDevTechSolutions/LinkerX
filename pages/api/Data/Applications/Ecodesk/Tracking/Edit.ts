import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb"; // Import connectToDatabase
import { ObjectId } from 'mongodb';

export default async function update(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const { id, UserID, userName, DateRecord, CompanyName, CustomerName, ContactNumber, TicketType, TicketConcern, TrackingStatus, TrackingRemarks, 
        Department, EndorsedDate, ClosedDate, SalesAgent, SalesManager, NatureConcern  } = req.body;

    try {
        const Xchire_db = await connectToDatabase();
        const Xchire_Collection = Xchire_db.collection('Tracking');

        const Xchire_update = {
            UserID,
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
            updatedAt: new Date(),
        };

        await Xchire_Collection.updateOne({ _id: new ObjectId(id) }, { $set: Xchire_update });
        res.status(200).json({ success: true, message: 'Tracking updated successfully' });
    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({ error: 'Failed to update account' });
    }
}
