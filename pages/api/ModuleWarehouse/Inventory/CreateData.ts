import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from '../../../../lib/MongoDB';
import cloudinary from "cloudinary";
import formidable from "formidable";

// Disable Next.js body parser for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function Add(data: any) {
  const db = await connectToDatabase();
  const DataCollection = db.collection("Products");
  await DataCollection.insertOne(data);
  return { success: true };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        console.error("Form parse error", err);
        return res.status(500).json({ success: false, message: "Form parsing failed" });
      }

      const {
        ReferenceNumber,
        ProductName,
        ProductSKU,
        ProductDescription,
        ProductCategories,
        ProductQuantity,
        ProductCostPrice,
        ProductSellingPrice,
        ProductStatus,
      } = fields;

      // Ensure all fields are strings (not arrays)
      const record = {
        ReferenceNumber: String(ReferenceNumber),
        ProductName: String(ProductName),
        ProductSKU: String(ProductSKU),
        ProductDescription: String(ProductDescription),
        ProductCategories: String(ProductCategories),
        ProductQuantity: String(ProductQuantity),
        ProductCostPrice: String(ProductCostPrice),
        ProductSellingPrice: String(ProductSellingPrice),
        ProductStatus: String(ProductStatus),
        // Add ProductImage and createdAt here
        ProductImage: "", // This will be added after file upload
        createdAt: new Date(), // Add createdAt timestamp
      };

      // Ensure that files.ProductImage is not an array, just a single file
      const imageFile = Array.isArray(files.ProductImage) ? files.ProductImage[0] : files.ProductImage;

      if (!imageFile) {
        return res.status(400).json({ success: false, message: "No image file uploaded" });
      }

      // ✅ Upload image to Cloudinary
      const result = await cloudinary.v2.uploader.upload(imageFile.filepath, {
        folder: "products",
      });

      const ProductImage = result.secure_url;

      // Add image URL to record
      record.ProductImage = ProductImage;

      // Save the record to MongoDB
      await Add(record);

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Upload error", error);
      return res.status(500).json({ success: false, message: "Upload failed", error });
    }
  });
}
