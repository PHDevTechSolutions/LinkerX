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
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr className="text-xs text-left whitespace-nowrap border-l-4 border-emerald-400">
              <th className="px-6 py-4 font-semibold text-gray-700">Ticket Number</th>
              <th className="px-6 py-4 font-semibold text-gray-700">User Name</th>
              <th className="px-6 py-4 font-semibold text-gray-700">ReferenceID</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Company Name</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Customer Name</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Gender</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Contact Number</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Email</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Customer Segment</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Channel</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Wrap Up</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Source</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Customer Type</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Customer Status</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Amount</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Quantity</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Traffic</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Agent Name</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Date Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPosts.map((post, index) => (
              <tr key={post._id || `post-${index}`} className="border-b whitespace-nowrap">
                <td className="px-6 py-4 text-xs">{post.TicketReferenceNumber}</td>
                <td className="px-6 py-4 text-xs">{post.userName}</td>
                <td className="px-6 py-4 text-xs">{post.ReferenceID}</td>
                <td className="px-6 py-4 text-xs">{post.CompanyName}</td>
                <td className="px-6 py-4 text-xs">{post.CustomerName}</td>
                <td className="px-6 py-4 text-xs">{post.Gender}</td>
                <td className="px-6 py-4 text-xs">{post.ContactNumber}</td>
                <td className="px-6 py-4 text-xs">{post.Email}</td>
                <td className="px-6 py-4 text-xs">{post.CustomerSegment}</td>
                <td className="px-6 py-4 text-xs">{post.Channel}</td>
                <td className="px-6 py-4 text-xs">{post.WrapUp}</td>
                <td className="px-6 py-4 text-xs">{post.Source}</td>
                <td className="px-6 py-4 text-xs">{post.CustomerType}</td>
                <td className="px-6 py-4 text-xs">{post.CustomerStatus}</td>
                <td className="px-6 py-4 text-xs">{post.Status}</td>
                <td className="px-6 py-4 text-xs">
                  ₱{Number(post.Amount || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="px-6 py-4 text-xs">{post.QtySold}</td>
                <td className="px-6 py-4 text-xs">{post.Traffic}</td>
                <td className="px-6 py-4 text-xs">{post.SalesAgent}</td>
                <td className="px-6 py-4 text-xs">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}

            {/* ✅ Total row at the bottom */}
            <tr className="bg-gray-100 px-6 py-4 text-xs font-bold">
              <td colSpan={15} className="px-6 py-4 text-xs text-right">
                Total:
              </td>
              <td className="px-6 py-4 text-xs">
                ₱{totalAmount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td className="px-6 py-4 text-xs">{totalQuantity}</td>
              <td colSpan={3} className="px-6 py-4 text-xs"></td>
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
