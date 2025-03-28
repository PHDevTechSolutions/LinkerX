import React, { useEffect, useState } from "react";

interface UsersCardProps {
  posts: any[];
  referenceid?: string;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts }) => {
  const [updatedUser, setUpdatedUser] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(15); // Show 15 items per page

  useEffect(() => {
    setUpdatedUser(posts);
  }, [posts]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = updatedUser.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(updatedUser.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="mb-4">
      {/* Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-xs">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Date Received</th>
              <th className="p-2 border">Message</th>
              <th className="p-2 border">Callback</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 capitalize">
                  <td className="p-2 border">
                    {new Date(post.date_created).toLocaleString()}
                  </td>
                  <td className="p-2 border">{post.message || "N/A"}</td>
                  <td className="p-2 border">
                    {post.callback ? (
                      <span className="text-blue-500">Yes</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </td>
                  <td className="p-2 border">{post.type || "N/A"}</td>
                  <td className="p-2 border">{post.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="p-4 text-center text-gray-500"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-1 text-xs">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border ${
              currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border ${
              currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
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
