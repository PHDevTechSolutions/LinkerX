import React, { useState } from "react";
import moment from "moment";
import { BsThreeDotsVertical } from "react-icons/bs";

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
  AgentFirstname: string;
  AgentLastname: string;
}

interface AccountsTableProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
  Role: string;
}

const DTrackingTable: React.FC<AccountsTableProps> = ({ posts, handleEdit }) => {
  const [menuVisible, setMenuVisible] = useState<Record<string, boolean>>({});

  const toggleMenu = (postId: string) => {
    setMenuVisible((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const formatDate = (timestamp: string) => {
    return timestamp ? moment(timestamp).format("MMM DD, YYYY hh:mm A") : "N/A";
  };

  const calculatePendingDays = (closedDate: string) => {
    if (!closedDate) return "N/A"; // If there's no closed date, return "N/A"
    const closedMoment = moment(closedDate);
    const today = moment();
    const daysDifference = today.diff(closedMoment, 'days');
    return daysDifference >= 0 ? daysDifference.toString() : "N/A"; // If days are negative, return "N/A"
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 shadow-md">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th className="px-4 py-2 border">CSR Agent</th>
            <th className="px-4 py-2 border">Company</th>
            <th className="px-4 py-2 border">Customer Name</th>
            <th className="px-4 py-2 border">Contact Number</th>
            <th className="px-4 py-2 border">Ticket Type</th>
            <th className="px-4 py-2 border">Ticket Concern</th>
            <th className="px-4 py-2 border">Nature of Concern</th>
            <th className="px-4 py-2 border">TSA</th>
            <th className="px-4 py-2 border">TSM</th>
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
                <tr className="text-xs text-gray-700 border hover:bg-gray-50 capitalize transition-all duration-200 ease-in-out transform hover:scale-[1.02]">
                  <td className="px-4 py-2 border capitalize whitespace-nowrap">{post.AgentLastname}, {post.AgentFirstname}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{post.CompanyName}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{post.CustomerName}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{post.ContactNumber}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{post.TicketType}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{post.TicketConcern}</td>
                  <td className="px-4 py-2 border capitalize whitespace-nowrap">{post.NatureConcern}</td>
                  <td className="px-4 py-2 border capitalize whitespace-nowrap">{post.SalesAgent}</td>
                  <td className="px-4 py-2 border capitalize whitespace-nowrap">{post.SalesManager}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{post.Department}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{calculatePendingDays(post.ClosedDate)}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{formatDate(post.EndorsedDate)}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{formatDate(post.ClosedDate)}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{post.TrackingStatus}</td>
                  <td className="px-4 py-2 border text-center">
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
