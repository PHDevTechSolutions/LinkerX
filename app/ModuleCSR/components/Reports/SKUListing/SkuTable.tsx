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
}

interface AccountsTableProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  handleEdit: (post: Post) => void;
  handleDelete: (postId: string) => void;
  Role: string;
}

const AccountsTable: React.FC<AccountsTableProps> = ({ posts, handleEdit, handleDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return posts.slice(startIndex, startIndex + postsPerPage);
  }, [posts, currentPage]);

  const totalQty = useMemo(() => {
    return posts.reduce((total, post) => {
      const qty = parseFloat(post.QtySold) || 0; // Convert to number, default to 0 if NaN
      return total + qty;
    }, 0);
  }, [posts]);

  return (
    <div className="overflow-x-auto">
      {posts.length > 0 ? (
        <>
          <table className="min-w-full bg-white border border-gray-300 text-xs">
            <thead>
              <tr className="bg-gray-100 text-left uppercase font-bold border-b">
                <th className="p-3 border">Company Name</th>
                <th className="p-3 border">Item Code</th>
                <th className="p-3 border">Item Description</th>
                <th className="p-3 border">Quantity Sold</th>
                <th className="p-3 border">Sales Agent</th>
                <th className="p-3 border">Remarks</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPosts.map((post) => (
                <tr key={post._id} className="border-b capitalize hover:bg-gray-50 capitalize transition-all duration-200 ease-in-out transform hover:scale-[1.02]">
                  <td className="p-3 border">{post.CompanyName}</td>
                  <td className="p-3 border">{post.ItemCode}</td>
                  <td className="p-3 border">{post.ItemDescription}</td>
                  <td className="p-3 border text-center">{post.QtySold || "0"}</td>
                  <td className="p-3 border italic capitalize">{post.SalesAgent}</td>
                  <td className="p-3 border">{post.Remarks}</td>
                  <td className="p-3 border text-center space-x-2">
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
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold bg-gray-100">
                <td className="p-3 border" colSpan={3}>Total Quantity Sold:</td>
                <td className="p-3 border text-center">{totalQty}</td>
                <td className="p-3 border" colSpan={3}></td>
              </tr>
            </tfoot>
          </table>
        </>
      ) : (
        <p className="text-center text-gray-500 text-xs mt-4">No records found</p>
      )}
    </div>
  );
};

export default AccountsTable;
