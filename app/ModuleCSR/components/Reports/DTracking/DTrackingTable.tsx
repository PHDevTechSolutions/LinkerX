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
}

const DTrackingTable: React.FC<AccountsTableProps> = ({ posts, handleEdit }) => {
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
      <table className="bg-white border border-gray-300 w-full">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th className="px-4 py-2 border">Company</th>
            <th className="px-4 py-2 border">Customer Name</th>
            <th className="px-4 py-2 border">Contact Number</th>
            <th className="px-4 py-2 border">Ticket Type</th>
            <th className="px-4 py-2 border">Ticket Concern</th>
            <th className="px-4 py-2 border">Nature of Concern</th>
            <th className="px-4 py-2 border">TSA</th>
            <th className="px-4 py-2 border">TSM</th>
            <th className="px-4 py-2 border">Pending Days</th>
            <th className="px-4 py-2 border">Endorsed</th>
            <th className="px-4 py-2 border">Closed</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Remarks</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <React.Fragment key={post._id}>
                <tr className="text-xs text-gray-700 border hover:bg-gray-50 capitalize">
                  <td className="px-4 py-2 border whitespace-nowrap">{post.CompanyName}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{post.CustomerName}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{post.ContactNumber}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{post.TicketType}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{post.TicketConcern}</td>
                  <td className="px-4 py-2 border capitalize whitespace-nowrap">{post.NatureConcern}</td>
                  <td className="px-4 py-2 border capitalize whitespace-nowrap">{post.SalesAgent}</td>
                  <td className="px-4 py-2 border capitalize whitespace-nowrap">{post.SalesManager}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{calculatePendingDays(post.ClosedDate)}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{formatDate(post.EndorsedDate)}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{formatDate(post.ClosedDate)}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{post.TrackingStatus}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{post.TrackingRemarks}</td>
                  <td className="px-4 py-2 border text-center whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(post)}
                      className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      Edit Details
                    </button>
                  </td>
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
    </div>
  );
};

export default DTrackingTable;
