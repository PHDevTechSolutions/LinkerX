import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  Role: string;
}

const TransactionCards: React.FC<AccountsTableProps> = ({ posts, handleEdit, handleDelete }) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [menuVisible, setMenuVisible] = useState<Record<string, boolean>>({});

  const toggleExpand = useCallback((postId: string) => {
    setExpandedCards((prev) => ({
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

  // Function to format date & time
  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "N/A";
    return moment(timestamp).format("MMM D, YYYY hh:mm A");
  };

  // Function to calculate pending days from SODate to PaymentDate
  const calculatePendingDays = (SODate: string, PaymentDate: string) => {
    if (!SODate || !PaymentDate) return "No Payment";
    const payment = moment(PaymentDate, "YYYY-MM-DD");
    const sodate = moment(SODate, "YYYY-MM-DD");

    if (!sodate.isValid() || !payment.isValid()) return "Invalid Date";

    return `${payment.diff(sodate, "days")} days`;
  };

  // Function to calculate pending days from PaymentDate to DeliveryDate
  const calculatePendingDaysFromPayment = (PaymentDate: string, DeliveryDate: string) => {
    if (!PaymentDate || !DeliveryDate) return "No Delivery";
    const delivery = moment(DeliveryDate, "YYYY-MM-DD");
    const payment = moment(PaymentDate, "YYYY-MM-DD");

    if (!payment.isValid() || !delivery.isValid()) return "Invalid Date";

    return `${delivery.diff(payment, "days")} days`;
  };

  // Filter posts based on specific remarks
  const remarksFilter = useMemo(() => ["PO Received"], []);
  const filteredPosts = useMemo(() => posts.filter(post => remarksFilter.includes(post.Remarks)), [posts, remarksFilter]);

  // Compute Total Amount
  const TotalAmount = useMemo(() => {
    return filteredPosts.reduce((total, post) => total + parseFloat(post.Amount || "0"), 0);
  }, [filteredPosts]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <div key={post._id} className="relative border rounded-md shadow-md p-4 flex flex-col bg-white">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold capitalize">{post.CompanyName}</h3>
              <div className="flex items-center space-x-1">
                <button onClick={() => toggleExpand(post._id)} className="text-gray-500 hover:text-gray-800">
                  {expandedCards[post._id] ? <AiOutlineMinus size={12} /> : <AiOutlinePlus size={12} />}
                </button>
                <button onClick={() => toggleMenu(post._id)} className="text-gray-500 hover:text-gray-800">
                  <BsThreeDotsVertical size={12} />
                </button>
              </div>
            </div>

            {expandedCards[post._id] && (
              <div className="mt-2 text-xs">
                <p><strong>Contact Number:</strong> {post.ContactNumber}</p>
                <p><strong>Amount:</strong> {post.Amount}</p>
                <p><strong>PO Number:</strong><span className="uppercase"> {post.PONumber} / <strong className="capitalize">SO Number:</strong> {post.SONumber}</span></p>
                <div className="border-t border-gray-800 pb-4 mt-4"></div>
                <p><strong>SO Date:</strong> {formatTimestamp(post.SODate)}</p>
                <p><strong>Payment Date:</strong> {formatTimestamp(post.PaymentDate)}</p>
                <p><strong>Pending Days (SO to Payment):</strong> {calculatePendingDays(post.SODate, post.PaymentDate)}</p>
                <p><strong>Delivery Date:</strong> {formatTimestamp(post.DeliveryDate)}</p>
                <p><strong>Pending Days (Payment to Delivery):</strong> {calculatePendingDaysFromPayment(post.PaymentDate, post.DeliveryDate)}</p>
                <div className="border-t border-gray-800 pb-4 mt-4"></div>
                <p className="text-xs mt-2 capitalize"><strong>Status:</strong> {post.POStatus}</p>
              </div>
            )}

            <div className="border-t border-gray-300 mt-3 pt-2 text-xs flex justify-between items-center">
              <span className="italic capitalize">{post.POSource}</span>
              <span className="italic">{post.PaymentTerms}</span>
            </div>

            {menuVisible[post._id] && (
              <div className="absolute right-2 top-10 bg-white shadow-lg rounded-lg border w-32 z-10 text-xs">
                <button onClick={() => handleEdit(post)} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Edit Details
                </button>
                <button onClick={() => handleDelete(post._id)} className="border-t w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500 text-xs">No records found</p>
      )}

      <div className="col-span-full mt-4 text-xs font-semibold">
        <strong>Total Amount:</strong> {TotalAmount.toFixed(2)}
      </div>
    </div>
  );
};

export default TransactionCards;
