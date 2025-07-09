import { NextApiRequest, NextApiResponse } from "next";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.WC_STORE_URL as string,
  consumerKey: process.env.WC_CONSUMER_KEY as string,
  consumerSecret: process.env.WC_CONSUMER_SECRET as string,
  version: "wc/v3",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let allOrders: any[] = [];
    let page = 1;
    let fetched: number;

    do {
      const { data } = await api.get("orders", {
        page,
        per_page: 100, // required by WooCommerce
        orderby: "date",
        order: "desc",
      });

      fetched = data.length;
      allOrders.push(...data);
      page++;
    } while (fetched === 100); // keep fetching while full pages returned

    res.status(200).json(allOrders);
  } catch (error: any) {
    console.error("Error fetching orders:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch orders from WooCommerce" });
  }
}
