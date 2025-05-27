import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb"; // Import connectToDatabase
import { ObjectId } from 'mongodb';

export default async function update(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const { id, ReferenceID, userName, DateCreated, Title, Description } = req.body;

    try {
        const Xchire_db = await connectToDatabase();
        const Xchire_Collection = Xchire_db.collection('Faqs');

        const Xchire_update = {
            ReferenceID,
            userName,
            DateCreated,
            Title,
            Description,
            updatedAt: new Date(),
        };

        await Xchire_Collection.updateOne({ _id: new ObjectId(id) }, { $set: Xchire_update });
        res.status(200).json({ success: true, message: 'updated successfully' });
    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({ error: 'Failed to update account' });
    }
}
