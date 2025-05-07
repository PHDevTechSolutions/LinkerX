// Delete

import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb"; // Import connectToDatabase
import { ObjectId } from 'mongodb';

export default async function remove(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const { id } = req.body;

    try {
        const Xchire_db = await connectToDatabase();
        const Xchire_Collection = Xchire_db.collection('accounts');

        await Xchire_Collection.deleteOne({ _id: new ObjectId(id) });
        res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (Xchire_error) {
        console.error('Error deleting post:', Xchire_error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
}
