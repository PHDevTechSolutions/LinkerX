"use client";
import React from "react";

interface Variant {
  price: string;
  inventory_quantity?: number;
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
  handleEdit: (p: ShopifyProduct) => void;   // ⬅️ NEW
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-400",
  active: "bg-green-400",
};

const Table: React.FC<TableProps> = ({ products, loading, handleEdit }) => {
  if (loading) return <p className="text-sm text-gray-500">Loading products…</p>;
  if (products.length === 0) return <p className="text-sm text-gray-500">No products found.</p>;

  // Totals for footer
  const totalPrice = products.reduce(
    (sum, p) => sum + parseFloat(p.variants?.[0]?.price ?? "0"),
    0
  );
  const totalStock = products.reduce(
    (sum, p) =>
      sum + p.variants.reduce((s, v) => s + (v.inventory_quantity ?? 0), 0),
    0
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-200 sticky top-0 z-10">
          <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
            <th className="px-4 py-3 font-semibold text-gray-700">Actions</th>
            <th className="px-4 py-3 font-semibold text-gray-700">ID</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Title</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Type</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Vendor</th>
            <th className="px-4 py-3 font-semibold text-gray-700 text-right">Price</th>
            <th className="px-4 py-3 font-semibold text-gray-700 text-right">Stock</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Created</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => {
            const stock = p.variants.reduce(
              (sum, v) => sum + (v.inventory_quantity ?? 0),
              0
            );

            return (
              <tr
                key={p.id}
                className="border-b whitespace-nowrap hover:bg-gray-100"
              >
                {/* Edit button */}
                <td className="px-4 py-2 text-xs">
                  <button
                    onClick={() => handleEdit(p)}
                    className="px-3 py-1 ml-2 text-[10px] text-white bg-blue-500 hover:bg-blue-800 hover:rounded-full rounded-md"
                  >
                    Update
                  </button>
                </td>

                <td className="px-4 py-2 text-xs">{p.id}</td>
                <td className="px-4 py-2 text-xs">{p.title}</td>
                <td className="px-4 py-2 text-xs">{p.product_type || "—"}</td>
                <td className="px-4 py-2 text-xs">{p.vendor}</td>
                <td className="px-4 py-2 text-xs text-right">
                  ₱{p.variants?.[0]?.price ?? "0.00"}
                </td>
                <td className="px-4 py-2 text-xs text-right">{stock}</td>
                <td className="px-4 py-2 text-xs">
                  <span
                    className={`badge text-white text-[8px] px-2 py-1 rounded-xl ${
                      statusColors[p.status] || "bg-gray-400"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-xs">
                  {new Date(p.created_at).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>

        <tfoot className="bg-gray-100 font-semibold text-gray-700">
          <tr>
            <td colSpan={5} className="px-4 py-3 text-xs">
              Totals:
            </td>
            <td className="px-4 py-3 text-xs text-right">
              ₱{totalPrice.toFixed(2)}
            </td>
            <td className="px-4 py-3 text-xs text-right">{totalStock}</td>
            <td colSpan={3}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Table;
