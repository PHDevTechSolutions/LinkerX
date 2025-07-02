import { IncomingForm } from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../../lib/MongoDB';
import { ObjectId } from 'mongodb';
import cloudinary from 'cloudinary';

// Disable built-in body parser to handle multipart parsing ourselves
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

// Helper function to normalize field value to string
function normalizeField(field: any): string {
  if (Array.isArray(field)) {
    return field[0];
  }
  return field || '';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const contentType = req.headers['content-type'] || '';
    let fields: any = {};
    let files: any = {};

    if (contentType.includes('multipart/form-data')) {
      const form = new IncomingForm();

      const data = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });

      fields = data.fields;
      files = data.files;
    } else if (contentType.includes('application/json')) {
      const buffers: Uint8Array[] = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const rawBody = Buffer.concat(buffers).toString('utf8');
      fields = JSON.parse(rawBody);
    } else {
      return res.status(415).json({ error: 'Unsupported Content-Type' });
    }

    // Normalize fields to strings
    const id = normalizeField(fields.id);
    const ReferenceNumber = normalizeField(fields.ReferenceNumber);
    const ProductName = normalizeField(fields.ProductName);
    const ProductSKU = normalizeField(fields.ProductSKU);
    const ProductDescription = normalizeField(fields.ProductDescription);
    const ProductCategories = normalizeField(fields.ProductCategories);
    const ProductStatus = normalizeField(fields.ProductStatus);
    const ProductQuantity = normalizeField(fields.ProductQuantity);
    const ProductCostPrice = normalizeField(fields.ProductCostPrice);
    const ProductSellingPrice = normalizeField(fields.ProductSellingPrice);

    if (!id) return res.status(400).json({ error: 'Product ID is required' });

    const db = await connectToDatabase();
    const DataCollection = db.collection('Products');

    const UpdateData: any = {
      ReferenceNumber,
      ProductName,
      ProductSKU,
      ProductDescription,
      ProductCategories,
      ProductQuantity: Number(ProductQuantity),
      ProductCostPrice: Number(ProductCostPrice),
      ProductSellingPrice: Number(ProductSellingPrice),
      ProductStatus,
      updatedAt: new Date(),
    };

    // Handle image upload if new file is provided
    if (files.ProductImage) {
      const file = Array.isArray(files.ProductImage) ? files.ProductImage[0] : files.ProductImage;
      const result = await cloudinary.v2.uploader.upload(file.filepath, {
        folder: 'products',
      });
      UpdateData.ProductImage = result.secure_url;
    }

    const objectId = new ObjectId(id);
    const updateResult = await DataCollection.updateOne({ _id: objectId }, { $set: UpdateData });

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json({ success: true, message: 'Product Updated Successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ error: 'Failed to update product' });
  }
}
