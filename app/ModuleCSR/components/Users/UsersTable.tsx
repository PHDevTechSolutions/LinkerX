import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Menu } from "@headlessui/react";

interface User {
  _id: string;
  Firstname: string;
  Lastname: string;
  Email: string;
  Role: string;
  Status: string;
  ReferenceID: string;
}

interface UsersTableProps {
  posts: User[];
  handleEdit: (post: User) => void;
  handleDelete: (postId: string) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  posts,
  handleEdit,
  handleDelete,
}) => {
  const [updatedUser, setUpdatedUser] = useState<User[]>(posts);

  useEffect(() => {
    setUpdatedUser(posts);
  }, [posts]);

  useEffect(() => {
    const newPostListener = (newPost: User) => {
      setUpdatedUser((prevPosts) => {
        if (prevPosts.some((post) => post._id === newPost._id)) return prevPosts;
        return [newPost, ...prevPosts];
      });
    };
  }, []);

  const statusColors: { [key: string]: string } = {
    Active: "bg-green-800",
    Inactive: "bg-red-500",
    Resigned: "bg-red-700",
    Terminated: "bg-yellow-600",
    Locked: "bg-gray-500",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {updatedUser.length > 0 ? (
        updatedUser.map((post) => (
          <div
            key={post._id}
            className={`relative rounded-lg shadow-md p-4 border ${
              post.ReferenceID === "LR-CSR-654001"
                ? "bg-black pointer-events-none"
                : "bg-white hover:shadow-lg transition duration-300"
            }`}
          >
            {post.ReferenceID === "LR-CSR-654001" && (
              <span className="absolute top-2 right-2 bg-yellow-500 text-black text-[8px] font-bold px-2 py-1 rounded">
                Master VIP
              </span>
            )}

            <div className="flex justify-between items-start">
              <div>
                <h3
                  className={`text-xs font-semibold capitalize ${
                    post.ReferenceID === "LR-CSR-654001"
                      ? "text-white"
                      : "text-gray-800"
                  }`}
                >
                  {post.ReferenceID} | {post.Lastname}, {post.Firstname}
                </h3>
                <div
                  className={`mt-4 mb-4 text-xs ${
                    post.ReferenceID === "LR-CSR-654001"
                      ? "text-gray-300"
                      : "text-gray-700"
                  }`}
                >
                  <p>
                    <strong>Email:</strong> {post.Email}
                  </p>
                  <p className="capitalize">
                    <strong>Role:</strong> {post.Role}
                  </p>
                </div>
                <p className="mt-2">
                  <span
                    className={`badge text-white text-[8px] px-2 py-1 mr-2 rounded-xl ${
                      post.ReferenceID === "LR-CSR-654001"
                        ? "bg-yellow-500"
                        : statusColors[post.Status] || "bg-gray-400"
                    }`}
                  >
                    {post.ReferenceID === "LR-CSR-654001" ? "Master VIP" : post.Status}
                  </span>
                </p>
              </div>

              {/* Disable buttons if ReferenceID is VIP */}
              {post.ReferenceID !== "LR-CSR-654001" && (
                <Menu as="div" className="relative inline-block">
                  <Menu.Button className="text-gray-500 hover:text-gray-800">
                    <BsThreeDotsVertical size={16} />
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 w-28 bg-white shadow-md rounded-md z-10 text-xs">
                    <button
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => handleEdit(post)}
                    >
                      Edit
                    </button>
                    <button
                      className="block px-4 py-2 text-red-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete
                    </button>
                  </Menu.Items>
                </Menu>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center text-gray-500 text-xs py-3">
          No accounts available
        </div>
      )}
    </div>
  );
};

export default UsersTable;
