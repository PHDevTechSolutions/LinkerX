import React, { useState, useMemo } from "react";

interface Post {
  _id: string;
  userName: string;
  createdAt: string;
  CompanyName: string;
  Remarks: string;
  ItemCode: string;
  ItemDescription: string;
  QtySold: string;
  SalesAgent: string;
  ItemCategory: string;
  Inquiries: string;
}

interface AccountsTableProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  handleEdit: (post: Post) => void;
  handleDelete: (postId: string) => void;
  Role: string;
}

const AccountsTable: React.FC<AccountsTableProps> = ({
  posts,
  handleEdit,
  handleDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [remarksFilter, setRemarksFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term state
  const [postsPerPage, setPostsPerPage] = useState(10);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    if (remarksFilter) {
      filtered = filtered.filter((post) =>
        post.Remarks.toLowerCase().includes(remarksFilter.toLowerCase())
      );
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((post) =>
        Object.values(post).some((val) =>
          typeof val === "string" && val.toLowerCase().includes(lowerSearch)
        )
      );
    }

    return filtered;
  }, [posts, remarksFilter, searchTerm]);

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, currentPage, postsPerPage]);

  const totalQty = useMemo(() => {
    return filteredPosts.reduce((total, post) => {
      const qty = parseFloat(post.QtySold) || 0;
      return total + qty;
    }, 0);
  }, [filteredPosts]);

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {/* Search Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow capitalize"
        />

        {/* Remarks Filter */}
        <select
          id="remarksFilter"
          value={remarksFilter}
          onChange={(e) => setRemarksFilter(e.target.value)}
          className="border px-3 py-2 rounded text-xs capitalize"
        >
          <option value="">All</option>
          <option value="No Stocks / Insufficient Stocks">No Stocks / Insufficient Stocks</option>
          <option value="Item Not Carried">Item Not Carried</option>
          <option value="Non Standard Item">Non Standard Item</option>
        </select>

        {/* Posts Per Page */}
        <select
          id="postsPerPage"
          value={postsPerPage}
          onChange={(e) => setPostsPerPage(Number(e.target.value))}
          className="border px-3 py-2 rounded text-xs"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={500}>500</option>
        </select>
      </div>

      {filteredPosts.length > 0 ? (
        <>
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr className="text-xs text-left whitespace-nowrap border-l-4 border-emerald-400">
                <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Company Name</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Item Category</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Item Code</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Item Description</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Quantity</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedPosts.map((post) => (
                <tr key={post._id} className="border-b whitespace-nowrap">
                  <td className="px-6 py-4 text-xs gap-1 flex">
                    <button
                      onClick={() => handleEdit(post)}
                      className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                  <td className="px-6 py-4 text-xs">{new Date(post.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 text-xs">{post.CompanyName}</td>
                  <td className="px-6 py-4 text-xs">{post.ItemCategory}</td>
                  <td className="px-6 py-4 text-xs">{post.ItemCode}</td>
                  <td className="px-6 py-4 text-xs">{post.ItemDescription}</td>
                  <td className="px-6 py-4 text-xs">{post.QtySold}</td>
                  <td className="px-6 py-4 text-xs capitalize">{post.Remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p className="text-center text-gray-500 text-xs mt-4">No records found</p>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 text-gray-600 rounded text-xs"
        >
          Previous
        </button>
        <span className="text-xs">
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

export default AccountsTable;
