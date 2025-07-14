"use client";
import React from "react";

interface Variant {
  price: string;
  inventory_quantity?: number; // Assuming this field exists
}

interface ShopifyProduct {
  id: number;
  title: string;
  product_type: string;
  vendor: string;
  status: string;
  variants: Variant[];
  created_at: string;
}

interface TableProps {
  products: ShopifyProduct[];
  loading: boolean;
}

const statusColors: { [key: string]: string } = {
  draft: "bg-gray-400",
  active: "bg-green-400",
};

const Table: React.FC<TableProps> = ({ products, loading }) => {
  if (loading)
    return <p className="text-sm text-gray-500">Loading products…</p>;

  if (products.length === 0)
    return <p className="text-sm text-gray-500">No products found.</p>;

  // Calculate totals for footer
  const totalPrice = products.reduce((sum, p) => {
    const price = parseFloat(p.variants?.[0]?.price ?? "0");
    return sum + price;
  }, 0);

  const totalStock = products.reduce((sum, p) => {
    return (
      sum +
      p.variants.reduce((stockSum, v) => stockSum + (v.inventory_quantity ?? 0), 0)
    );
  }, 0);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-200 sticky top-0 z-10">
          <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
            <th className="px-6 py-4 font-semibold text-gray-700">ID</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Title</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Type</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Vendor</th>
            <th className="px-6 py-4 font-semibold text-gray-700 text-right">Price</th>
            <th className="px-6 py-4 font-semibold text-gray-700 text-right">Stock</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Created</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const totalStock = p.variants.reduce(
              (sum, v) => sum + (v.inventory_quantity ?? 0),
              0
            );

            return (
              <tr
                key={p.id}
                className="border-b whitespace-nowrap hover:bg-gray-100 cursor-pointer"
              >
                <td className="px-6 py-4 text-xs capitalize">{p.id}</td>
                <td className="px-6 py-4 text-xs capitalize">{p.title}</td>
                <td className="px-6 py-4 text-xs capitalize">
                  {p.product_type || "—"}
                </td>
                <td className="px-6 py-4 text-xs capitalize">{p.vendor}</td>
                <td className="px-6 py-4 text-xs capitalize text-right">
                  ₱{p.variants?.[0]?.price ?? "0.00"}
                </td>
                <td className="px-6 py-4 text-xs capitalize text-right">{totalStock}</td>
                <td className="px-6 py-4 text-xs capitalize">
                  <span
                    className={`badge text-white shadow-md text-[8px] px-2 py-1 mr-2 rounded-xl ${
                      statusColors[p.status] || "bg-gray-400"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs capitalize">
                  {new Date(p.created_at).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>

        <tfoot className="bg-gray-100 font-semibold text-gray-700">
          <tr>
            <td className="px-6 py-4 text-xs" colSpan={4}>
              Totals:
            </td>
            <td className="px-6 py-4 text-xs text-right">
              ₱{totalPrice.toFixed(2)}
            </td>
            <td className="px-6 py-4 text-xs text-right">{totalStock}</td>
            <td colSpan={2}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Table;
