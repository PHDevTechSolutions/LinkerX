import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const SHOPIFY_STORE = process.env.SHOPIFY_STORE!;
  const SHOPIFY_PRODUCT_TOKEN = process.env.SHOPIFY_PRODUCT_TOKEN!;

  try {
    // Shopify Products API endpoint - limit max 250 per request
    const url = `https://${SHOPIFY_STORE}/admin/api/2024-04/products.json?limit=250`;

    const response = await fetch(url, {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_PRODUCT_TOKEN,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Shopify responded with status ${response.status}`);
    }

    const { products } = await response.json();

    return res.status(200).json({ success: true, data: products });
  } catch (err: any) {
    console.error("Shopify fetch error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
