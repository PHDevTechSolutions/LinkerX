import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/MongoDB';

interface LinkPayload {
  Url: string;
  Email: string;
  LinkName: string;
  Description: string;
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
    const { Url, LinkName, Description, Email, PhotoUrl } = req.body;

    // Validate required fields
    if (
      typeof Url !== 'string' ||
      typeof LinkName !== 'string' ||
      typeof Description !== 'string' ||
      typeof Email !== 'string'
    ) {
      return res.status(400).json({ message: 'Url, LinkName, Description, and Email are required.' });
    }

    // Validate URL format
    try {
      new URL(Url);
    } catch (_) {
      return res.status(400).json({ message: 'Invalid URL format.' });
    }

    const db = await connectToDatabase();
    const LinksCollection = db.collection<LinkPayload & { createdAt: Date }>('links');

    const newDoc = {
      Url,
      LinkName,
      Description,
      Email,
      PhotoUrl: PhotoUrl || '',
      createdAt: new Date(),
    };

    const result = await LinksCollection.insertOne(newDoc);

    return res.status(201).json({ ...newDoc, _id: result.insertedId });
  } catch (err) {
    console.error('Error inserting link:', err);
    return res.status(500).json({ message: 'Failed to add link.' });
  }
}