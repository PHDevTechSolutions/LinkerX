import React, { useState, useCallback } from "react";
import moment from "moment";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

interface Post {
  _id: string;
  userName: string;
  CompanyName: string;
  CustomerName: string;
  ContactNumber: string;
  TicketType: string;
  TicketConcern: string;
  NatureConcern: string;
  SalesManager: string;
  SalesAgent: string;
  PendingDays: string;
  Department: string;
  TrackingRemarks: string;
  TrackingStatus: string;
  EndorsedDate: string;
  ClosedDate: string;
}

interface AccountsTableProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
  Role: string;
}

const DTrackingTable: React.FC<AccountsTableProps> = ({ posts, handleEdit }) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [menuVisible, setMenuVisible] = useState<Record<string, boolean>>({});

  const toggleExpand = useCallback((postId: string) => {
    setExpandedRows((prev) => ({ ...prev, [postId]: !prev[postId] }));
  }, []);

  const toggleMenu = useCallback((postId: string) => {
    setMenuVisible((prev) => ({ ...prev, [postId]: !prev[postId] }));
  }, []);

  const formatDate = (timestamp: string) => {
    return timestamp ? moment(timestamp).format("MMM DD, YYYY hh:mm A") : "N/A";
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 shadow-md">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th className="px-4 py-2 border">Company</th>
            <th className="px-4 py-2 border">Customer</th>
            <th className="px-4 py-2 border">Contact</th>
            <th className="px-4 py-2 border">Ticket Type</th>
            <th className="px-4 py-2 border">Concern</th>
            <th className="px-4 py-2 border">Department</th>
            <th className="px-4 py-2 border">Pending Days</th>
            <th className="px-4 py-2 border">Endorsed</th>
            <th className="px-4 py-2 border">Closed</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map((post) => (
              <React.Fragment key={post._id}>
                <tr className="text-xs text-gray-700 border">
                  <td className="px-4 py-2 border">{post.CompanyName}</td>
                  <td className="px-4 py-2 border">{post.CustomerName}</td>
                  <td className="px-4 py-2 border">{post.ContactNumber}</td>
                  <td className="px-4 py-2 border">{post.TicketType}</td>
                  <td className="px-4 py-2 border">{post.TicketConcern}</td>
                  <td className="px-4 py-2 border">{post.Department}</td>
                  <td className="px-4 py-2 border">{post.PendingDays}</td>
                  <td className="px-4 py-2 border">{formatDate(post.EndorsedDate)}</td>
                  <td className="px-4 py-2 border">{formatDate(post.ClosedDate)}</td>
                  <td className="px-4 py-2 border">{post.TrackingStatus}</td>
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
                          Edit Details
                        </button>
                      </div>
                    )}
                  </td>
                </tr>

                {expandedRows[post._id] && (
                  <tr className="text-xs bg-gray-50">
                    <td colSpan={11} className="px-4 py-2 border">
                      <p><strong>Nature of Concern:</strong> {post.NatureConcern}</p>
                      <p><strong>Sales Manager:</strong> {post.SalesManager}</p>
                      <p><strong>Sales Agent:</strong> {post.SalesAgent}</p>
                      <p><strong>Remarks:</strong> {post.TrackingRemarks}</p>
                      <p><strong>Created By:</strong> {post.userName}</p>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={11} className="text-center text-gray-500 text-xs py-3">No records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DTrackingTable;
