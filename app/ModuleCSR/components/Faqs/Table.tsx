"use client";
import React, { useState } from "react";

interface Post {
  _id: string;
  Title: string;
  Description: string;
}

interface AccountsTableProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
}

const ClientTable: React.FC<AccountsTableProps> = ({ posts, handleEdit }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="overflow-x-auto bg-white p-4 rounded-md">
      {/* ✅ Page Size Selector */}
      <div className="mb-4 text-xs">
        <select
          id="postsPerPage"
          value={postsPerPage}
          onChange={(e) => setPostsPerPage(Number(e.target.value))}
          className="border px-3 py-2 rounded text-xs capitalize"
        >
          {[5, 10, 15, 20, 50, 100].map((length) => (
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
            <th className="px-6 py-4 font-semibold text-gray-700">Title</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Description</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <tr key={post._id} className="border-b whitespace-nowrap">
                <td className="px-6 py-4 text-xs">{post.Title}</td>
                <td className="px-6 py-4 text-xs">{post.Description}</td>
                <td className="px-6 py-4 text-xs">
                  <button
                    onClick={() => handleEdit(post)}
                    className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center text-gray-500 text-xs py-3">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Pagination */}
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

export default ClientTable;
