import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/MongoDB';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { email, department, status, timestamp } = req.body;

  // Validate input
  if (!email || !department || !status || !timestamp) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const db = await connectToDatabase(); // Make sure this returns the db directly
    await db.collection('activityLogs').insertOne({
      email,
      department,
      status,
      timestamp: new Date(timestamp),
    });

    return res.status(200).json({ message: 'Activity logged successfully.' });
  } catch (error) {
    console.error('Logging error:', error);
    return res.status(500).json({ message: 'Error logging activity.' });
  }
}
