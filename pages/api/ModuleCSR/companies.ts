import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb"; // Import connectToDatabase

export default async function fetchCompanies(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const db = await connectToDatabase();
            const accountsCollection = db.collection('accounts');

            if (req.query.CompanyName) {
                const CompanyName = decodeURIComponent(req.query.CompanyName as string);
                const companyDetails = await accountsCollection.findOne({ CompanyName });
                if (companyDetails) {
                    res.status(200).json(companyDetails);
                } else {
                    res.status(404).json({ error: 'Company not found' });
                }
            } else {
                const companies = await accountsCollection.find({}, { projection: { CompanyName: 1 } }).toArray();
                res.status(200).json(companies);
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
            res.status(500).json({ error: 'Failed to fetch companies' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
