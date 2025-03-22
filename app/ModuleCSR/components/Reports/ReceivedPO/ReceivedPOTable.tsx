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
      <table className="min-w-full bg-white border border-gray-300 shadow-md">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700 text-left">
          <tr>
            <th className="px-4 py-2 border">CSR Agent</th>
            <th className="px-4 py-2 border">Company</th>
            <th className="px-4 py-2 border">PO Number</th>
            <th className="px-4 py-2 border">Amount</th>
            <th className="px-4 py-2 border">SO Number</th>
            <th className="px-4 py-2 border">SO Date</th>
            <th className="px-4 py-2 border">Sales Agent</th>
            <th className="px-4 py-2 border">Pending From SO Date</th>
            <th className="px-4 py-2 border">Payment Terms</th>
            <th className="px-4 py-2 border">Payment Date</th>
            <th className="px-4 py-2 border">Delivery/Pick-Up Date</th>
            <th className="px-4 py-2 border">Pending Days from Payment</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Source</th>
            <th className="px-4 py-2 border">Created At</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map((post) => (
              <tr key={post._id} className="text-xs text-gray-700 capitalize border hover:bg-gray-50 transition-all duration-200 ease-in-out transform hover:scale-[1.02]">
                <td className="px-4 py-2 border whitespace-nowrap">
                  {post.AgentLastname}, {post.AgentFirstname}
                </td>
                <td className="px-4 py-2 border uppercase whitespace-nowrap">{post.CompanyName}</td>
                <td className="px-4 py-2 border italic uppercase whitespace-nowrap">{post.PONumber}</td>
                <td className="px-4 py-2 border whitespace-nowrap">
                  {isNaN(parseFloat(post.Amount?.toString() || "0"))
                    ? "0.00"
                    : parseFloat(post.Amount?.toString() || "0").toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                </td>
                <td className="px-4 py-2 border whitespace-nowrap">{post.SONumber}</td>
                <td className="px-4 py-2 border whitespace-nowrap">{formatTimestamp(post.SODate)}</td>
                <td className="px-4 py-2 border whitespace-nowrap">{post.SalesAgent}</td>
                <td className="px-4 py-2 border whitespace-nowrap text-red-700 font-semibold">{calculatePendingDays(post.SODate)}</td>
                <td className="px-4 py-2 border whitespace-nowrap">{post.PaymentTerms}</td>
                <td className="px-4 py-2 border whitespace-nowrap">{formatTimestamp(post.PaymentDate)}</td>
                <td className="px-4 py-2 border whitespace-nowrap">{formatTimestamp(post.DeliveryPickupDate)}</td>
                <td className="px-4 py-2 border whitespace-nowrap text-red-700 font-semibold">
                  {calculatePendingPaymentDays(post.PaymentDate, post.DeliveryPickupDate)}
                </td>
                <td className="px-4 py-2 border whitespace-nowrap">{post.POStatus}</td>
                <td className="px-4 py-2 border whitespace-nowrap">{post.POSource}</td>
                <td className="px-4 py-2 border whitespace-nowrap">{new Date(post.createdAt).toLocaleString()}</td>

                {/* Actions Menu */}
                <td className="px-4 py-2 border text-center">
                  <button onClick={() => toggleMenu(post._id)} className="text-gray-500 hover:text-gray-800">
                    <BsThreeDotsVertical size={14} />
                  </button>

                  {menuVisible[post._id] && (
                    <div className="absolute right-0 bg-white shadow-md rounded-md border w-32 text-xs z-10">
                      <button onClick={() => handleEdit(post)} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(post._id)} className="border-t w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">
                        Delete
                      </button>
                    </div>
                  )}
                </td>
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
            <td colSpan={3} className="px-4 py-2 border text-right">Total Amount:</td>
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
