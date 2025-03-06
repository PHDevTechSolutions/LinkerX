import React, { useState, useCallback, useMemo } from "react";
import moment from "moment";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

interface Post {
  _id: string;
  userName: string;
  createdAt: string;
  CompanyName: string;
  ContactNumber: string;
  PONumber: string;
  Amount: string;
  SONumber: string;
  SODate: string;
  PaymentTerms: string;
  PaymentDate: string;
  DeliveryDate: string;
  POStatus: string;
  POSource: string;
  Remarks: string;
}

interface AccountsTableProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
  handleDelete: (postId: string) => void;
}

const TransactionTable: React.FC<AccountsTableProps> = ({ posts, handleEdit, handleDelete }) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [menuVisible, setMenuVisible] = useState<Record<string, boolean>>({});

  const toggleExpand = useCallback((postId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  }, []);

  const toggleMenu = useCallback((postId: string) => {
    setMenuVisible((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  }, []);

  const formatTimestamp = (timestamp: string) => {
    return timestamp ? moment(timestamp).format("MMM D, YYYY") : "N/A";
  };

  const calculatePendingDays = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return "N/A";
    const start = moment(startDate, "YYYY-MM-DD");
    const end = moment(endDate, "YYYY-MM-DD");

    return start.isValid() && end.isValid() ? `${end.diff(start, "days")} days` : "Invalid Date";
  };

  // Removed filtering by "PO Received"
  const TotalAmount = useMemo(() => {
    return posts.reduce((total, post) => {
        const amount = parseFloat(post.Amount?.replace(/,/g, "") || "0"); // Remove commas if present & handle empty values
        return total + (isNaN(amount) ? 0 : amount); // Ensure NaN values are treated as 0
    }, 0);
}, [posts]);


  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 shadow-md">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th className="px-4 py-2 border">Company</th>
            <th className="px-4 py-2 border">PO Number</th>
            <th className="px-4 py-2 border">SO Number</th>
            <th className="px-4 py-2 border">Amount</th>
            <th className="px-4 py-2 border">SO Date</th>
            <th className="px-4 py-2 border">Payment Date</th>
            <th className="px-4 py-2 border">Delivery Date</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map((post) => (
              <React.Fragment key={post._id}>
                <tr className="text-xs text-gray-700 capitalize border">
                  <td className="px-4 py-2 border">{post.CompanyName}</td>
                  <td className="px-4 py-2 border">{post.PONumber}</td>
                  <td className="px-4 py-2 border">{post.SONumber}</td>
                  <td className="px-4 py-2 border">{parseFloat(post.Amount).toFixed(2)}</td>
                  <td className="px-4 py-2 border">{formatTimestamp(post.SODate)}</td>
                  <td className="px-4 py-2 border">{formatTimestamp(post.PaymentDate)}</td>
                  <td className="px-4 py-2 border">{formatTimestamp(post.DeliveryDate)}</td>
                  <td className="px-4 py-2 border">{post.POStatus}</td>
                  <td className="px-4 py-2 border text-center relative">
                    <button onClick={() => toggleExpand(post._id)} className="text-gray-500 hover:text-gray-800 mr-2">
                      {expandedRows[post._id] ? <AiOutlineMinus size={14} /> : <AiOutlinePlus size={14} />}
                    </button>
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

                {expandedRows[post._id] && (
                  <tr className="text-xs bg-gray-50">
                    <td colSpan={9} className="px-4 py-2 border">
                      <p><strong>Contact Number:</strong> {post.ContactNumber}</p>
                      <p><strong>Payment Terms:</strong> {post.PaymentTerms}</p>
                      <p><strong>Pending Days (SO to Payment):</strong> {calculatePendingDays(post.SODate, post.PaymentDate)}</p>
                      <p><strong>Pending Days (Payment to Delivery):</strong> {calculatePendingDays(post.PaymentDate, post.DeliveryDate)}</p>
                      <p><strong>Source:</strong> {post.POSource}</p>
                      <p><strong>Remarks:</strong> {post.Remarks}</p>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="text-center text-gray-500 text-xs py-3">No records found</td>
            </tr>
          )}
        </tbody>

        <tfoot>
          <tr className="bg-gray-100 text-xs font-semibold">
            <td colSpan={3} className="px-4 py-2 border text-right">Total Amount:</td>
            <td className="px-4 py-2 border">{TotalAmount.toFixed(2)}</td>
            <td colSpan={5} className="border"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TransactionTable;
