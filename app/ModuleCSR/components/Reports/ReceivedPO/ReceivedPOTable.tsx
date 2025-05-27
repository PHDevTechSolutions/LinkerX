import React, { useState, useMemo } from "react";
import moment from "moment";
import { BsThreeDotsVertical } from "react-icons/bs";

interface Post {
  _id: string;
  userName: string;
  createdAt: string;
  CompanyName: string;
  ContactNumber: string;
  PONumber: string;
  Amount: string | number;
  SONumber: string;
  SODate: string;
  PaymentTerms: string;
  PaymentDate: string;
  DeliveryPickupDate: string;
  POStatus: string;
  POSource: string;
  Remarks: string;
  AgentFirstname: string;
  AgentLastname: string;
  SalesAgent: string;
}

interface AccountsTableProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
  handleDelete: (postId: string) => void;
}

const TransactionTable: React.FC<AccountsTableProps> = ({ posts, handleEdit, handleDelete }) => {
  const [menuVisible, setMenuVisible] = useState<Record<string, boolean>>({});

  const toggleMenu = (postId: string) => {
    setMenuVisible((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return ""; // ✅ Show blank if no value
    return moment(timestamp).isValid() ? moment(timestamp).format("MMM D, YYYY") : "";
  };

  // ✅ Calculate Total Amount
  const TotalAmount = useMemo(() => {
    return posts.reduce((total, post) => {
      const amountStr = typeof post.Amount === "string" ? post.Amount : post.Amount?.toString();
      const amount = parseFloat(amountStr?.replace(/,/g, "") || "0");
      return total + (isNaN(amount) ? 0 : amount);
    }, 0);
  }, [posts]);

  // ✅ Calculate Pending Days from SO Date
  const calculatePendingDays = (SODate: string) => {
    if (!SODate || !moment(SODate).isValid()) return ""; // ✅ Return blank if invalid date
    const today = moment();
    const soDateMoment = moment(SODate);
    const pendingDays = today.diff(soDateMoment, "days");
    return pendingDays >= 0 ? `${pendingDays} day(s)` : "0 day(s)";
  };

  // ✅ Calculate Pending Days from Payment to Delivery
  const calculatePendingPaymentDays = (PaymentDate: string, DeliveryPickupDate: string) => {
    if (!PaymentDate || !DeliveryPickupDate) return ""; // ✅ Return blank if either date is missing
    const paymentMoment = moment(PaymentDate);
    const deliveryMoment = moment(DeliveryPickupDate);

    if (!paymentMoment.isValid() || !deliveryMoment.isValid()) return "0 day(s)";
    const pendingPaymentDays = deliveryMoment.diff(paymentMoment, "days");

    return pendingPaymentDays >= 0 ? `${pendingPaymentDays} day(s)` : "0 day(s)";
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr className="text-xs text-left whitespace-nowrap border-l-4 border-emerald-400">
            <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
            <th className="px-6 py-4 font-semibold text-gray-700">CSR Agent</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Company</th>
            <th className="px-6 py-4 font-semibold text-gray-700">PO Number</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Amount</th>
            <th className="px-6 py-4 font-semibold text-gray-700">SO Number</th>
            <th className="px-6 py-4 font-semibold text-gray-700">SO Date</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Sales Agent</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Pending From SO Date</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Payment Terms</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Payment Date</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Delivery/Pick-Up Date</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Pending Days from Payment</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Source</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Created At</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {posts.length > 0 ? (
            posts.map((post) => (
              <tr key={post._id} className="border-b whitespace-nowrap">
                {/* Actions Menu */}
                <td className="px-6 py-4 text-xs gap-1 flex">
                  <button onClick={() => handleEdit(post)} className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(post._id)} className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">
                    Delete
                  </button>
                </td>
                <td className="px-6 py-4 text-xs">
                  {post.AgentLastname}, {post.AgentFirstname}
                </td>
                <td className="px-6 py-4 text-xs uppercase">{post.CompanyName}</td>
                <td className="px-6 py-4 text-xs">{post.PONumber}</td>
                <td className="px-6 py-4 text-xs">
                  {isNaN(parseFloat(post.Amount?.toString() || "0"))
                    ? "0.00"
                    : parseFloat(post.Amount?.toString() || "0").toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                </td>
                <td className="px-6 py-4 text-xs">{post.SONumber}</td>
                <td className="px-6 py-4 text-xs">{formatTimestamp(post.SODate)}</td>
                <td className="px-6 py-4 text-xs">{post.SalesAgent}</td>
                <td className="px-6 py-4 text-xs text-red-700">{calculatePendingDays(post.SODate)}</td>
                <td className="px-6 py-4 text-xs">{post.PaymentTerms}</td>
                <td className="px-6 py-4 text-xs">{formatTimestamp(post.PaymentDate)}</td>
                <td className="px-6 py-4 text-xs">{formatTimestamp(post.DeliveryPickupDate)}</td>
                <td className="px-6 py-4 text-xs text-red-700 font-semibold">
                  {calculatePendingPaymentDays(post.PaymentDate, post.DeliveryPickupDate)}
                </td>
                <td className="px-6 py-4 text-xs">{post.POStatus}</td>
                <td className="px-6 py-4 text-xs">{post.POSource}</td>
                <td className="px-6 py-4 text-xs">{new Date(post.createdAt).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={17} className="text-center text-gray-500 text-xs py-3">
                No records found
              </td>
            </tr>
          )}
        </tbody>

        {/* Total Amount Footer */}
        <tfoot>
          <tr className="bg-gray-100 text-xs font-semibold">
            <td colSpan={4} className="px-4 py-2 border text-right">Total Amount:</td>
            <td className="px-4 py-2 border">
              ₱{TotalAmount.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
            <td colSpan={13} className="border"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TransactionTable;
