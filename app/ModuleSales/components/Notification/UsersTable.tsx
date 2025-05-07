import React, { useEffect, useState } from "react";

interface UsersCardProps {
  posts: any[];
  userDetails: any;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts, userDetails }) => {
  const [updatedUser, setUpdatedUser] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(15); // Show 15 items per page

  useEffect(() => {
    setUpdatedUser(filteredAccounts);
  }, [posts, userDetails]);

  // ✅ Filtered Accounts Logic based on Role and ReferenceID
  const filteredAccounts = Array.isArray(posts)
  ? posts
      .filter((post) => {
        const userReferenceID = userDetails.ReferenceID;

        // ✅ Check role and apply correct filters
        const matchesReferenceID =
          (userDetails.Role === "Manager" && post?.manager === userReferenceID) ||
          (userDetails.Role === "Territory Sales Manager" &&
            post?.tsm === userReferenceID &&
            post?.type === "Follow-Up Notification") || // ✅ Show only Follow-Up Notification for TSM
          (userDetails.Role === "Territory Sales Associate" &&
            post?.referenceid === userReferenceID &&
            post?.type !== "CSR Notification" && post?.type !== "Follow-Up Notification"); // ✅ Exclude CSR Notification for TSA

        return matchesReferenceID;
      })
      .sort(
        (a, b) =>
          new Date(b.date_created).getTime() -
          new Date(a.date_created).getTime()
      )
  : [];


  // ✅ Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAccounts.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);

    // Use UTC getters instead of local ones to prevent timezone shifting.
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // if hour is 0, display as 12
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;

    // Use toLocaleDateString with timeZone 'UTC' to format the date portion
    const formattedDateStr = date.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    // Return combined date and time string
    return `${formattedDateStr} ${hours}:${minutesStr} ${ampm}`;
  };

  return (
    <div className="mb-4">
      {/* Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
              <th className="px-6 py-4 font-semibold text-gray-700">Date Received</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Message</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Callback</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Type</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentItems.length > 0 ? (
              currentItems.map((post) => (
                <tr key={post.id} className="border-b whitespace-nowrap">
                  <td className="px-6 py-4 text-xs">
                    {new Date(post.date_created).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-xs">{post.message || "N/A"}</td>
                  <td className="px-6 py-4 text-xs">
                    {post.callback ? (
                      <span className="text-blue-500">Yes</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs">{post.type || "N/A"}</td>
                  <td className="px-6 py-4 text-xs">{post.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination Controls - Simplified */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2 text-xs">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-400 text-white hover:bg-blue-600"
            }`}
          >
            Prev
          </button>

          <span className="px-3 py-1 border rounded bg-gray-100 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-400 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersCard;
