import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb"; // Import connectToDatabase

export default async function fetch(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const Xchire_db = await connectToDatabase();
    const Xchire_Collection = Xchire_db.collection('Faqs');
    const Xchire_fetch = await Xchire_Collection.find({}).toArray();
    res.status(200).json(Xchire_fetch);
  } catch (Xchire_error) {
    console.error('Error fetching accounts:', Xchire_error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
}
