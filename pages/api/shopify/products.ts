// File: /pages/api/shopify/products/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const SHOPIFY_STORE = process.env.SHOPIFY_STORE!;
  const SHOPIFY_PRODUCT_TOKEN = process.env.SHOPIFY_PRODUCT_TOKEN!;

  const { id } = req.query;

  if (req.method === "GET" && !id) {
    try {
      const url = `https://${SHOPIFY_STORE}/admin/api/2024-04/products.json?limit=250`;
      const response = await fetch(url, {
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_PRODUCT_TOKEN,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`Shopify responded ${response.status}`);

      const { products } = await response.json();
      return res.status(200).json({ success: true, data: products });
    } catch (err: any) {
      console.error("Shopify fetch error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === "PUT" && id) {
    try {
      const payload = { product: { id, ...req.body } };

      const shopifyRes = await fetch(
        `https://${SHOPIFY_STORE}/admin/api/2024-04/products/${id}.json`,
        {
          method: "PUT",
          headers: {
            "X-Shopify-Access-Token": SHOPIFY_PRODUCT_TOKEN,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!shopifyRes.ok) {
        const msg = await shopifyRes.text();
        throw new Error(`Shopify responded ${shopifyRes.status}: ${msg}`);
      }

      const { product } = await shopifyRes.json();
      return res.status(200).json({ success: true, data: product });
    } catch (err: any) {
      console.error("Shopify update error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }


  return res
    .status(405)
    .json({ success: false, error: "Method Not Allowed or bad route" });
}
