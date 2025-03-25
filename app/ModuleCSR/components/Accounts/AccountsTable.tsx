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
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left text-xs uppercase font-bold border-b">
            <th className="p-3 border">Company Name</th>
            <th className="p-3 border">Customer Name</th>
            <th className="p-3 border">Gender</th>
            <th className="p-3 border">Contact Number</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">City Address</th>
            <th className="p-3 border">Segment</th>
            <th className="p-3 border">Customer Type</th>
            <th className="p-3 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {updatedPosts.map((post) => (
            <tr key={post._id} className="border-b text-xs capitalize hover:bg-gray-50 capitalize">
              <td className="p-3 border">{post.CompanyName}</td>
              <td className="p-3 border">{post.CustomerName}</td>
              <td className="p-3 border">{post.Gender}</td>
              <td className="p-3 border">{post.ContactNumber}</td>
              <td className="p-3 border">{post.Email}</td>
              <td className="p-3 border">{post.CityAddress}</td>
              <td className="p-3 border">{post.CustomerSegment || "N/A"}</td>
              <td className="p-3 border">{post.CustomerType}</td>
              <td className="p-3 border text-center relative">
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
