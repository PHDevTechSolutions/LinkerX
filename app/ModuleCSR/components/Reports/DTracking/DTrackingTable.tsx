"use client";
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
  handleDelete: (postId: string) => void;
}

const DTrackingTable: React.FC<AccountsTableProps> = ({ posts, handleEdit, handleDelete }) => {
  const [menuVisible, setMenuVisible] = useState<Record<string, boolean>>({});
  const [activeTicketType, setActiveTicketType] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10); // Add state for posts per page

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const ticketTypes = ["All", "After Sales", "Follow Up", "Complaint", "Technical", "Procurement", "Documentation"]; // Example ticket types

  const toggleMenu = (postId: string) => {
    setMenuVisible((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const formatDate = (timestamp: string) => {
    return timestamp ? moment(timestamp).format("MMM DD, YYYY hh:mm A") : "N/A";
  };

  const calculatePendingDays = (closedDate: string) => {
    if (!closedDate) return "N/A";
    const closedMoment = moment(closedDate);
    const today = moment();
    const daysDifference = today.diff(closedMoment, "days");
    return daysDifference >= 0 ? daysDifference.toString() : "N/A";
  };

  // ✅ Filter posts by selected TicketType
  const filteredPosts = posts.filter((post) =>
    activeTicketType === "All" ? true : post.TicketType === activeTicketType
  );

  // ✅ Pagination Logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="overflow-x-auto bg-white p-4 rounded-md">
        {/* ✅ TicketType Filter (Select Dropdown) */}
        <div className="mb-4 text-xs">
          <select
            value={activeTicketType}
            onChange={(e) => setActiveTicketType(e.target.value)}
            className="border px-3 py-2 rounded text-xs capitalize mr-1"
          >
            {ticketTypes.map((ticketType) => (
              <option key={ticketType} value={ticketType}>
                {ticketType}
              </option>
            ))}
          </select>
          <select
            id="postsPerPage"
            value={postsPerPage}
            onChange={(e) => setPostsPerPage(Number(e.target.value))}
            className="border px-3 py-2 rounded text-xs capitalize"
          >
            {[5, 10, 15, 20, 50, 100, 200, 500, 1000].map((length) => (
              <option key={length} value={length}>
                {length}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Table */}
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr className="text-xs text-left whitespace-nowrap border-l-4 border-emerald-400">
              <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Company</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Customer Name</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Contact Number</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Ticket Type</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Ticket Concern</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Nature of Concern</th>
              <th className="px-6 py-4 font-semibold text-gray-700">TSA</th>
              <th className="px-6 py-4 font-semibold text-gray-700">TSM</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Pending Days</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Endorsed</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Closed</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentPosts.length > 0 ? (
              currentPosts.map((post) => (
                <React.Fragment key={post._id}>
                  <tr className="border-b whitespace-nowrap">
                    <td className="px-6 py-4 text-xs flex gap-1">
                      <button
                        onClick={() => handleEdit(post)}
                        className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                    <td className="px-6 py-4 text-xs">{post.CompanyName}</td>
                    <td className="px-6 py-4 text-xs">{post.CustomerName}</td>
                    <td className="px-6 py-4 text-xs">{post.ContactNumber}</td>
                    <td className="px-6 py-4 text-xs">{post.TicketType}</td>
                    <td className="px-6 py-4 text-xs">{post.TicketConcern}</td>
                    <td className="px-6 py-4 text-xs capitalize">{post.NatureConcern}</td>
                    <td className="px-6 py-4 text-xs">{post.SalesAgent}</td>
                    <td className="px-6 py-4 text-xs">{post.SalesManager}</td>
                    <td className="px-6 py-4 text-xs">{calculatePendingDays(post.ClosedDate)}</td>
                    <td className="px-6 py-4 text-xs">{formatDate(post.EndorsedDate)}</td>
                    <td className="px-6 py-4 text-xs">{formatDate(post.ClosedDate)}</td>
                    <td className="px-6 py-4 text-xs">{post.TrackingStatus}</td>
                    <td className="px-6 py-4 text-xs capitalize">{post.TrackingRemarks}</td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={14} className="text-center text-gray-500 text-xs py-3">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* ✅ Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 text-gray-600 rounded text-xs"
        >
          Previous
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 text-gray-600 rounded text-xs"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default DTrackingTable;
