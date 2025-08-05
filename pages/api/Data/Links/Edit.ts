import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/MongoDB';

export default async function updateLink(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id } = req.query;
  const { Url, LinkName, Description, PhotoUrl } = req.body as { Url?: string; LinkName?: string; Description?: string; PhotoUrl?: string };

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Missing link ID.' });
  }
  if (!Url || !LinkName) {
    return res.status(400).json({ message: 'Url and LinkName are required.' });
  }

  try {
    new URL(Url);
  } catch (_) {
    return res.status(400).json({ message: 'Invalid URL format.' });
  }

  try {
    const db = await connectToDatabase();
    const Links = db.collection('links');

    const updateData = {
      Url,
      LinkName,
      Description,
      PhotoUrl: PhotoUrl || '',
      updatedAt: new Date(),
    };

    const result = await Links.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Link not found.' });
    }

    return res.status(200).json({ message: 'Link updated.' });
  } catch (err) {
    console.error('Update error:', err);
    return res.status(500).json({ message: 'Failed to update link.' });
  }
}
