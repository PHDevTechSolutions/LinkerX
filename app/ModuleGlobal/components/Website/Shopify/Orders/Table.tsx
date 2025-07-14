"use client";
import React from "react";

interface ShopifyOrder {
  id: number;
  name: string;
  created_at: string;
  financial_status: string;
  fulfillment_status: string | null;
  current_total_price: string;
  customer?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface TableProps {
  orders: ShopifyOrder[];
  loading: boolean;
}

const Table: React.FC<TableProps> = ({ orders, loading }) => {
  if (loading) return <p className="text-xs text-gray-500">Loading orders…</p>;
  if (orders.length === 0)
    return <p className="text-xs text-gray-500">No orders found.</p>;

  // Compute total price
  const totalPrice = orders.reduce(
    (sum, o) => sum + Number(o.current_total_price),
    0
  );

  const statusColors: { [key: string]: string } = {
    paid: 'bg-green-800',
    refunded: 'bg-violet-800',
    pending: 'bg-red-800',
    voided: 'bg-slate-800',
    fulfilled: 'bg-blue-800',
    Unfulfilled: 'bg-red-800',
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-200 sticky top-0 z-10">
          <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
            <th className="px-6 py-4 font-semibold text-gray-700">Order&nbsp;#</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Customer</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Email</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Total</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Financial</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Fulfillment</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b whitespace-nowrap hover:bg-gray-100 cursor-pointer">
              <td className="px-6 py-4 text-xs capitalize">{o.name}</td>
              <td className="px-6 py-4 text-xs capitalize">{new Date(o.created_at).toLocaleString()}</td>
              <td className="px-6 py-4 text-xs capitalize">
                {o.customer
                  ? `${o.customer.first_name} ${o.customer.last_name}`
                  : "Guest"}
              </td>
              <td className="px-6 py-4 text-xs">{o.customer?.email ?? "—"}</td>
              <td className="px-6 py-4 text-xs capitalize text-right">
                ₱{Number(o.current_total_price).toFixed(2)}
              </td>
              <td className="px-6 py-4 text-xs capitalize">
                <span className={`badge text-white shadow-md text-[8px] px-2 py-1 mr-2 rounded-xl ${statusColors[o.financial_status] || 'bg-gray-400'}`}>
                  {o.financial_status}
                </span>
              </td>
              <td className="px-6 py-4 text-xs capitalize">
                <span className={`badge text-white shadow-md text-[8px] px-2 py-1 mr-2 rounded-xl ${statusColors[o.fulfillment_status ?? "Unfulfilled"] || 'bg-gray-400'}`}>
                  {o.fulfillment_status ?? "Unfulfilled"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-100 font-semibold text-sm text-right">
          <tr>
            <td colSpan={4} className="px-6 py-4 text-xs capitalize">
              Total
            </td>
            <td className="px-6 py-4 text-xs capitalize">
              ₱{totalPrice.toFixed(2)}
            </td>
            <td colSpan={2} className="px-6 py-4 text-xs capitalize"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Table;
