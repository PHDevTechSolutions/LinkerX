import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../../lib/MongoDB';
import { ObjectId } from 'mongodb';

export default async function Delete(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const { id } = req.body;

    try {
        const db = await connectToDatabase();
        const DataCollection = db.collection('Products');

        await DataCollection.deleteOne({ _id: new ObjectId(id) });
        res.status(200).json({ success: true, message: 'Report Item Deleted Successfully' });
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ error: 'Failed to delete data' });
    }
}
