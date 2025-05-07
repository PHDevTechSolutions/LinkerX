import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb"; // Import connectToDatabase
import { ObjectId } from 'mongodb';

export default async function update(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        res.setHeader('Allow', ['PUT']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    const { id, Status } = req.body;

    if (!id || !Status) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const Xchire_db = await connectToDatabase();
        const Xchire_Collection = Xchire_db.collection('monitoring');

        const Xchire_result = await Xchire_Collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { Status, updatedAt: new Date() } }
        );

        if (Xchire_result.modifiedCount === 0) {
            return res.status(404).json({ error: 'No matching record found' });
        }

        return res.status(200).json({ success: true, message: 'Status updated successfully' });
    } catch (Xchire_error) {
        console.error('Error updating status:', Xchire_error);
        return res.status(500).json({ error: 'Failed to update status' });
    }
}
