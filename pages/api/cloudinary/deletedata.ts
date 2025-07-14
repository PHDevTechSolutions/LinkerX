import type { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  const { public_id } = req.body as { public_id?: string };
  if (!public_id) {
    return res.status(400).json({ success: false, error: "Missing public_id" });
  }

  try {
    const result = await cloudinary.api.delete_resources([public_id]);
    if (result.deleted && result.deleted[public_id] !== "deleted") {
      return res.status(404).json({ success: false, error: "Resource not found or already deleted" });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Delete failed" });
  }
}
