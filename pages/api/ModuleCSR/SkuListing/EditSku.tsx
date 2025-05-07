import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb"; // Import connectToDatabase
import { ObjectId } from 'mongodb';

export default async function update(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const { id, UserID, userName, CompanyName, Remarks, ItemCode, ItemDescription, QtySold, SalesAgent } = req.body;

    try {
        const Xchire_db = await connectToDatabase();
        const Xchire_Collection = Xchire_db.collection('monitoring');

        const updatedAccount = {
            UserID,
            userName,
            CompanyName,
            Remarks,
            ItemCode,
            ItemDescription,
            QtySold,
            SalesAgent,
            updatedAt: new Date(),
        };

        await Xchire_Collection.updateOne({ _id: new ObjectId(id) }, { $set: updatedAccount });
        res.status(200).json({ success: true, message: 'Account updated successfully' });
    } catch (Xchire_error) {
        console.error('Error updating account:', Xchire_error);
        res.status(500).json({ error: 'Failed to update account' });
    }
}
