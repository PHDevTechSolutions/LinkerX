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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {updatedUser.length > 0 ? (
        updatedUser.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition duration-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 capitalize">
                  {post.Lastname}, {post.Firstname}
                </h3>
                <p className="text-xs text-gray-500">{post.Email}</p>
                <p className="text-xs text-gray-700 mt-1 capitalize">
                  Role: {post.Role}
                </p>
              </div>

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
