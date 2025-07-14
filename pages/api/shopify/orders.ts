import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const SHOPIFY_STORE = process.env.SHOPIFY_STORE!;
  const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN!;

  try {
    const url = `https://${SHOPIFY_STORE}/admin/api/2024-04/orders.json?status=any&limit=250`;

    const response = await fetch(url, {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_TOKEN,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Shopify responded ${response.status}`);
    }

    const { orders } = await response.json();
    return res.status(200).json({ success: true, data: orders });
  } catch (err: any) {
    console.error("Shopify fetch error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
