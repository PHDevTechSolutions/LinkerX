import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/MongoDB';

export default async function update(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id } = req.query;
  const { Url, Title, Description, PhotoUrl, Email, Category } = req.body as { Url?: string; Title?: string; Description?: string; PhotoUrl?: string; Email?: string; Category?: string; };

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Missing note ID.' });
  }
  if (!Url || !Title) {
    return res.status(400).json({ message: 'Url and Title are required.' });
  }

  try {
    new URL(Url);
  } catch (_) {
    return res.status(400).json({ message: 'Invalid URL format.' });
  }

  try {
    const db = await connectToDatabase();
    const Links = db.collection('notes');

    const updateData = {
      Url,
      Title,
      Description,
      PhotoUrl: PhotoUrl || '',
      Email,
      Category,
      updatedAt: new Date(),
    };

    const result = await Links.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Note not found.' });
    }

    return res.status(200).json({ message: 'Note updated.' });
  } catch (err) {
    console.error('Update error:', err);
    return res.status(500).json({ message: 'Failed to update note.' });
  }
}
