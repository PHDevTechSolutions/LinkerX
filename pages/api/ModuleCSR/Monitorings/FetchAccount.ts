
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb"; // Import connectToDatabase

export default async function fetch(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const Xchire_db = await connectToDatabase();
            const Xchire_Collection = Xchire_db.collection('accounts');

            if (req.query.CompanyName) {
                const CompanyName = decodeURIComponent(req.query.CompanyName as string);
                const companyDetails = await Xchire_Collection.findOne({ CompanyName });
                if (companyDetails) {
                    res.status(200).json(companyDetails);
                } else {
                    res.status(404).json({ error: 'Company not found' });
                }
            } else {
                const Xchire_fetch = await Xchire_Collection.find({}, { projection: { CompanyName: 1 } }).toArray();
                res.status(200).json(Xchire_fetch);
            }
        } catch (Xchire_error) {
            console.error('Error fetching companies:', Xchire_error);
            res.status(500).json({ error: 'Failed to fetch companies' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
