import type { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

type Data = {
  success: boolean;
  data?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    // List resources - adjust options as needed (max 1000 here)
    const result = await cloudinary.api.resources({
      max_results: 1000,
      resource_type: "image", // or 'video', 'raw' etc.
    });

    // result.resources is an array of media
    res.status(200).json({ success: true, data: result.resources });
  } catch (error: any) {
    console.error("Cloudinary fetch error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch media" });
  }
}
