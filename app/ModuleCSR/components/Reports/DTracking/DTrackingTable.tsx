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
}

const DTrackingTable: React.FC<AccountsTableProps> = ({ posts, handleEdit }) => {
  const [menuVisible, setMenuVisible] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<string>("Accounting");

  const departments = [
    "Accounting",
    "Engineering",
    "Human Resources",
    "Marketing",
    "Purchasing",
    "Sales",
    "Warehouse",
  ];

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

  // ✅ Filter posts by selected department
  const filteredPosts = posts.filter((post) => post.Department === activeTab);

  return (
    <div className="overflow-x-auto bg-white p-4 shadow-md rounded-md">
      {/* ✅ Department Tabs */}
      <div className="flex space-x-2 mb-4 text-xs">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setActiveTab(dept)}
            className={`px-4 py-2 rounded ${activeTab === dept
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* ✅ Table */}
      <table className="bg-white border border-gray-300 shadow-md">
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
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <React.Fragment key={post._id}>
                <tr className="text-xs text-gray-700 border hover:bg-gray-50 capitalize">
                  <td className="px-4 py-2 border whitespace-nowrap">
                    {post.CompanyName}
                  </td>
                  <td className="px-4 py-2 border whitespace-nowrap">
                    {post.CustomerName}
                  </td>
                  <td className="px-4 py-2 border whitespace-nowrap">
                    {post.ContactNumber}
                  </td>
                  <td className="px-4 py-2 border whitespace-nowrap">
                    {post.TicketType}
                  </td>
                  <td className="px-4 py-2 border whitespace-nowrap">
                    {post.TicketConcern}
                  </td>
                  <td className="px-4 py-2 border capitalize whitespace-nowrap">
                    {post.NatureConcern}
                  </td>
                  <td className="px-4 py-2 border capitalize whitespace-nowrap">
                    {post.SalesAgent}
                  </td>
                  <td className="px-4 py-2 border capitalize whitespace-nowrap">
                    {post.SalesManager}
                  </td>
                  <td className="px-4 py-2 border whitespace-nowrap">
                    {calculatePendingDays(post.ClosedDate)}
                  </td>
                  <td className="px-4 py-2 border whitespace-nowrap">
                    {formatDate(post.EndorsedDate)}
                  </td>
                  <td className="px-4 py-2 border whitespace-nowrap">
                    {formatDate(post.ClosedDate)}
                  </td>
                  <td className="px-4 py-2 border whitespace-nowrap">
                    {post.TrackingStatus}
                  </td>
                  <td className="px-4 py-2 border whitespace-nowrap">
                    {post.TrackingRemarks}
                  </td>
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
    </div>
  );
};

export default DTrackingTable;
