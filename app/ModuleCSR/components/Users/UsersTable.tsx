import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Menu } from "@headlessui/react";

const socket = io("http://localhost:3001");

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

const UsersTable: React.FC<UsersTableProps> = ({ posts, handleEdit, handleDelete }) => {
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

    socket.on("newPost", newPostListener);
    return () => {
      socket.off("newPost", newPostListener);
    };
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 shadow-md text-left">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th className="px-4 py-2 border">Full Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Role</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {updatedUser.length > 0 ? (
            updatedUser.map((post) => (
              <tr key={post._id} className="text-xs text-gray-700 border">
                <td className="px-4 py-2 border capitalize">{post.Lastname}, {post.Firstname}</td>
                <td className="px-4 py-2 border">{post.Email}</td>
                <td className="px-4 py-2 border capitalize">{post.Role}</td>
                <td className="px-4 py-2 text-left absolute">
                  <Menu as="div" className="relative inline-block">
                    <Menu.Button className="text-gray-500 hover:text-gray-800">
                      <BsThreeDotsVertical size={14} />
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
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center text-gray-500 text-xs py-3">No accounts available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
