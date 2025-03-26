"use client";
import React, { useState } from "react";

interface DataLogsTableProps {
  posts: any[];
}

const DataLogTable: React.FC<DataLogsTableProps> = ({ posts }) => {
  const [selectedReferenceID, setSelectedReferenceID] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedCustomerStatus, setSelectedCustomerStatus] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // ✅ Filter logic
  const filteredPosts = posts.filter((post) => {
    const createdDate = new Date(post.createdAt);
    const postMonth = String(createdDate.getMonth() + 1).padStart(2, "0"); // Format month as 01, 02, etc.
    const postYear = String(createdDate.getFullYear());

    return (
      (selectedReferenceID === "" || post.ReferenceID === selectedReferenceID) &&
      (selectedUserName === "" || post.userName === selectedUserName) &&
      (selectedCustomerStatus === "" || post.CustomerStatus === selectedCustomerStatus) &&
      (selectedMonth === "" || postMonth === selectedMonth) &&
      (selectedYear === "" || postYear === selectedYear)
    );
  });

  // ✅ Calculate total amount and quantity
  const totalAmount = filteredPosts.reduce(
    (sum, post) => sum + (Number(post.Amount) || 0),
    0
  );

  const totalQuantity = filteredPosts.reduce(
    (sum, post) => sum + (Number(post.QtySold) || 0),
    0
  );

  // ✅ Get unique options for select filters
  const referenceIDOptions = Array.from(
    new Set(posts.map((post) => post.ReferenceID))
  );
  const userNameOptions = Array.from(
    new Set(posts.map((post) => post.userName))
  );
  const customerStatusOptions = Array.from(
    new Set(posts.map((post) => post.CustomerStatus))
  );
  const monthOptions = Array.from(
    new Set(
      posts.map((post) =>
        String(new Date(post.createdAt).getMonth() + 1).padStart(2, "0")
      )
    )
  );
  const yearOptions = Array.from(
    new Set(posts.map((post) => String(new Date(post.createdAt).getFullYear())))
  );

  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-2 mb-4">
        {/* ✅ Select for ReferenceID */}
        <select
          className="border p-2 text-xs rounded"
          value={selectedReferenceID}
          onChange={(e) => setSelectedReferenceID(e.target.value)}
        >
          <option value="">All ReferenceIDs</option>
          {referenceIDOptions.map((ref) => (
            <option key={ref} value={ref}>
              {ref}
            </option>
          ))}
        </select>

        {/* ✅ Select for User Name */}
        <select
          className="border p-2 text-xs rounded"
          value={selectedUserName}
          onChange={(e) => setSelectedUserName(e.target.value)}
        >
          <option value="">All User Names</option>
          {userNameOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        {/* ✅ Select for Customer Status */}
        <select
          className="border p-2 text-xs rounded"
          value={selectedCustomerStatus}
          onChange={(e) => setSelectedCustomerStatus(e.target.value)}
        >
          <option value="">All Customer Status</option>
          {customerStatusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        {/* ✅ Select for Month */}
        <select
          className="border p-2 text-xs rounded"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">All Months</option>
          {monthOptions.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>

        {/* ✅ Select for Year */}
        <select
          className="border p-2 text-xs rounded"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">All Years</option>
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Data Table */}
      {filteredPosts.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300 text-xs">
          <thead>
            <tr className="bg-gray-100 text-left uppercase font-bold border-b">
              <th className="p-3 border whitespace-nowrap">Ticket Number</th>
              <th className="p-3 border whitespace-nowrap">User Name</th>
              <th className="p-3 border whitespace-nowrap">ReferenceID</th>
              <th className="p-3 border whitespace-nowrap">Company Name</th>
              <th className="p-3 border whitespace-nowrap">Customer Name</th>
              <th className="p-3 border whitespace-nowrap">Gender</th>
              <th className="p-3 border whitespace-nowrap">Contact Number</th>
              <th className="p-3 border whitespace-nowrap">Email</th>
              <th className="p-3 border whitespace-nowrap">Customer Segment</th>
              <th className="p-3 border whitespace-nowrap">Channel</th>
              <th className="p-3 border whitespace-nowrap">Wrap Up</th>
              <th className="p-3 border whitespace-nowrap">Source</th>
              <th className="p-3 border whitespace-nowrap">Customer Type</th>
              <th className="p-3 border whitespace-nowrap">Customer Status</th>
              <th className="p-3 border whitespace-nowrap">Status</th>
              <th className="p-3 border whitespace-nowrap">Amount</th>
              <th className="p-3 border whitespace-nowrap">Quantity</th>
              <th className="p-3 border whitespace-nowrap">Traffic</th>
              <th className="p-3 border whitespace-nowrap">Date Created</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post, index) => (
              <tr
                key={post._id || `post-${index}`} // Fallback key if _id is missing
                className="border-b hover:bg-gray-50 capitalize"
              >
                <td className="p-3 border whitespace-nowrap">
                  {post.TicketReferenceNumber}
                </td>
                <td className="p-3 border whitespace-nowrap">
                  {post.userName}
                </td>
                <td className="p-3 border whitespace-nowrap">
                  {post.ReferenceID}
                </td>
                <td className="p-3 border whitespace-nowrap">
                  {post.CompanyName}
                </td>
                <td className="p-3 border whitespace-nowrap">
                  {post.CustomerName}
                </td>
                <td className="p-3 border whitespace-nowrap">{post.Gender}</td>
                <td className="p-3 border whitespace-nowrap">
                  {post.ContactNumber}
                </td>
                <td className="p-3 border whitespace-nowrap">{post.Email}</td>
                <td className="p-3 border whitespace-nowrap">
                  {post.CustomerSegment}
                </td>
                <td className="p-3 border whitespace-nowrap">{post.Channel}</td>
                <td className="p-3 border whitespace-nowrap">{post.WrapUp}</td>
                <td className="p-3 border whitespace-nowrap">{post.Source}</td>
                <td className="p-3 border whitespace-nowrap">
                  {post.CustomerType}
                </td>
                <td className="p-3 border whitespace-nowrap">
                  {post.CustomerStatus}
                </td>
                <td className="p-3 border whitespace-nowrap">{post.Status}</td>
                <td className="p-3 border whitespace-nowrap">
                  ₱{Number(post.Amount || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="p-3 border whitespace-nowrap">{post.QtySold}</td>
                <td className="p-3 border whitespace-nowrap">{post.Traffic}</td>
                <td className="p-3 border whitespace-nowrap">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}

            {/* ✅ Total row at the bottom */}
            <tr className="bg-gray-100 font-bold">
              <td colSpan={15} className="p-3 border text-right">
                Total:
              </td>
              <td className="p-3 border">
                ₱{totalAmount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td className="p-3 border">{totalQuantity}</td>
              <td colSpan={2} className="p-3 border"></td>
            </tr>
          </tbody>
        </table>
      ) : (
        <div className="text-center py-4 text-sm">
          No CSR inquiries available
        </div>
      )}
    </div>
  );
};

export default DataLogTable;
