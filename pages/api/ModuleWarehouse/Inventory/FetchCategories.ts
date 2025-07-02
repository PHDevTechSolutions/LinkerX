import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../../lib/MongoDB';

export default async function fetchProductCategories(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const db = await connectToDatabase();
            const Collection = db.collection('Categories');

            const { ProductCategories } = req.query;

            if (ProductCategories) {
                const decodedName = decodeURIComponent(ProductCategories as string);

                // Case-insensitive exact match
                const Details = await Collection.findOne({
                    ProductCategories: { $regex: new RegExp(`^${decodedName}$`, 'i') },
                });

                if (Details) {
                    return res.status(200).json(Details);
                } else {
                    return res.status(404).json({ error: 'data not found' });
                }
            } else {
                // Fetch all ProductCategories (only ProductCategories field)
                const fetch = await Collection
                    .find({}, { projection: { ProductCategories: 1, _id: 0 } })
                    .toArray();

                return res.status(200).json(fetch);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            return res.status(500).json({ error: 'Failed to fetch data' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
