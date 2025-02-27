import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Menu } from "@headlessui/react";

const socket = io("http://localhost:3001");

interface UsersCardProps {
  posts: any[];
  handleEdit: (post: any) => void;
  handleDelete: (postId: string) => void;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts, handleEdit, handleDelete }) => {
  const [updatedUser, setUpdatedUser] = useState<any[]>(posts);

  useEffect(() => {
    setUpdatedUser(posts);
  }, [posts]);

  useEffect(() => {
    const newPostListener = (newPost: any) => {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {updatedUser.length > 0 ? (
        updatedUser.map((post) => (
          <div key={post._id} className="relative border rounded-md shadow-md p-4 flex flex-col bg-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-semibold capitalize">
                  {post.Lastname}, {post.Firstname}
                </h3>
              </div>
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button>
                    <BsThreeDotsVertical />
                  </Menu.Button>
                </div>
                <Menu.Items className="absolute right-0 mt-2 w-29 bg-white shadow-md rounded-md z-10">
                  <button
                    className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => handleEdit(post)}
                  >
                    Edit
                  </button>
                  <button
                    className="block px-4 py-2 text-xs text-red-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => handleDelete(post._id)}
                  >
                    Delete
                  </button>
                </Menu.Items>
              </Menu>
            </div>
            <div className="mt-4 text-xs">
              <p><strong>Email:</strong> {post.Email}</p>
              <p className="capitalize"><strong>Role:</strong> {post.Role}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-4 text-xs">No accounts available</div>
      )}
    </div>
  );
};

export default UsersCard;
