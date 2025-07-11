import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/MongoDB';

export default async function deleteLink(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Missing link ID.' });
  }

  try {
    const db = await connectToDatabase();
    const Links = db.collection('links');

    const result = await Links.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Link not found.' });
    }

    return res.status(200).json({ message: 'Link deleted.' });
  } catch (err) {
    console.error('Delete error:', err);
    return res.status(500).json({ message: 'Failed to delete link.' });
  }
}
