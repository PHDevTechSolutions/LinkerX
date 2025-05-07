import React, { useState, useMemo, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

interface Post {
  _id: string;
  CompanyName: string;
  CustomerName: string;
  Gender: string;
  ContactNumber: string;
  Email: string;
  CityAddress: string;
  CustomerSegment?: string;
  CustomerType?: string;
}

interface AccountsTableProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
  handleDelete: (postId: string) => void;
  Role: string;
}

const AccountsTable: React.FC<AccountsTableProps> = ({ posts, handleEdit, handleDelete, Role }) => {
  const [menuVisible, setMenuVisible] = useState<{ [key: string]: boolean }>({});

  const updatedPosts = useMemo(() => posts, [posts]);

  useEffect(() => {
    console.log("Role in AccountsTable:", Role);
  }, [Role]);

  const toggleMenu = (postId: string) => {
    setMenuVisible((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr className="text-xs text-left whitespace-nowrap border-l-4 border-emerald-400">
            <th className="px-6 py-4 font-semibold text-gray-700">Company Name</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Customer Name</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Gender</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Contact Number</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Email</th>
            <th className="px-6 py-4 font-semibold text-gray-700">City Address</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Segment</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Customer Type</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {updatedPosts.map((post) => (
            <tr key={post._id} className="border-b whitespace-nowrap">
              <td className="px-6 py-4 text-xs uppercase">{post.CompanyName}</td>
              <td className="px-6 py-4 text-xs capitalize">{post.CustomerName}</td>
              <td className="px-6 py-4 text-xs">{post.Gender}</td>
              <td className="px-6 py-4 text-xs">{post.ContactNumber}</td>
              <td className="px-6 py-4 text-xs">{post.Email}</td>
              <td className="px-6 py-4 text-xs capitalize">{post.CityAddress}</td>
              <td className="px-6 py-4 text-xs">{post.CustomerSegment || "N/A"}</td>
              <td className="px-6 py-4 text-xs">{post.CustomerType}</td>
              <td className="px-6 py-4 text-xs relative">
                <button onClick={() => toggleMenu(post._id)} className="text-gray-500 hover:text-gray-800">
                  <BsThreeDotsVertical size={14} />
                </button>
                {menuVisible[post._id] && (
                  <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md border w-32 z-10 text-xs">
                    <button onClick={() => handleEdit(post)} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Edit Details
                    </button>
                    <button onClick={() => handleDelete(post._id)} className="border-t w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountsTable;
