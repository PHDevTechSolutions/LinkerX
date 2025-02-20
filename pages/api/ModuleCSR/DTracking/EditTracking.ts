import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from "../../../../app/ModuleCSR/lib/mongodb"; // Import connectToDatabase
import { ObjectId } from 'mongodb';

export default async function editAccount(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const { id, UserID, userName, DateRecord, CompanyName, CustomerName, ContactNumber, TicketType, TicketConcern, TrackingStatus, TrackingRemarks, Department, EndorsedDate, ClosedDate  } = req.body;

    try {
        const db = await connectToDatabase();
        const DTracking = db.collection('Tracking');

        const updatedAccount = {
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
            updatedAt: new Date(),
        };

        await DTracking.updateOne({ _id: new ObjectId(id) }, { $set: updatedAccount });
        res.status(200).json({ success: true, message: 'Tracking updated successfully' });
    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({ error: 'Failed to update account' });
    }
}
