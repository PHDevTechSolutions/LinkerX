import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/MongoDB';

interface LinkPayload {
  Email: string;
  Title: string;
  Description: string;
  Category: string;
  PhotoUrl?: string;
}

export default async function addLink(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { Email, Title, Description, PhotoUrl, Category } = req.body as Partial<LinkPayload>;

    // Validate required fields
    if (!Email || !Title || !Description || !Category) {
      return res.status(400).json({ message: 'Email, Title, Description, and Category are required.' });
    }

    const db = await connectToDatabase();
    const Collection = db.collection<LinkPayload & { createdAt: Date }>('notes');

    const newDoc = {
      Email,
      Title,
      Description,
      Category,
      PhotoUrl: PhotoUrl || '',
      createdAt: new Date(),
    };

    const result = await Collection.insertOne(newDoc);

    return res.status(201).json({ ...newDoc, _id: result.insertedId });

  } catch (err) {
    console.error('Error inserting note:', err);
    return res.status(500).json({ message: 'Failed to add note.' });
  }
}