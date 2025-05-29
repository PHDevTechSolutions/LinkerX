import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../../lib/MongoDB';
import { ObjectId } from 'mongodb';

export default async function Edit(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const {
        id,
        ReferenceNumber,
        ProductCategories,
        CategoryDescription
    } = req.body;

    try {
        const db = await connectToDatabase();
        const DataCollection = db.collection('Categories');

        const UpdateData = {
            ReferenceNumber,
            ProductCategories,
            CategoryDescription,
            updatedAt: new Date(),
        };

        // Update data
        await DataCollection.updateOne({ _id: new ObjectId(id) }, { $set: UpdateData });

        res.status(200).json({ success: true, message: 'Data Updated Successfully' });
    } catch (error) {
        console.error('Error updating Data:', error);
        res.status(500).json({ error: 'Failed to update Data' });
    }
}
