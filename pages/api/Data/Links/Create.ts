import type { NextApiRequest, NextApiResponse } from 'next';import { connectToDatabase } from '@/lib/MongoDB';

// Extend payload interface to include PhotoUrl
interface LinkPayload {
Url: string;
LinkName: string;
Description: string;
PhotoUrl?: string; // optional photo URL
}

export default async function addLink(
req: NextApiRequest,
res: NextApiResponse
) {
if (req.method !== 'POST') {
res.setHeader('Allow', ['POST']);
return res.status(405).end(Method ${req.method} Not Allowed);
}

try {
const { Url, LinkName, Description, PhotoUrl } = req.body as Partial<LinkPayload>;

if (!Url || !LinkName || !Description) {  
  return res.status(400).json({ message: 'Url and LinkName are required.' });  
}  

// URL format validation  
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
  PhotoUrl: PhotoUrl || '',  // Save empty string if no PhotoUrl given  
  createdAt: new Date(),  
};  

const result = await LinksCollection.insertOne(newDoc);  

return res.status(201).json({ ...newDoc, _id: result.insertedId });

} catch (err) {
console.error('Error inserting link:', err);
return res.status(500).json({ message: 'Failed to add link.' });
}
}

