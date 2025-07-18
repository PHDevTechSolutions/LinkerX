import React, { useState } from "react";

interface Post {
    id: string;
    title: string;
    description: string;
    link: string;
  }

interface UsersCardProps {
  posts: any[];
  handleEdit: (post: Post) => void;
  handleDelete: (postId: string) => void;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts, handleEdit, handleDelete, }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
            <th className="px-6 py-4 font-semibold text-gray-700">Title</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Type</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Description</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Date Created</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {posts.length > 0 ? (
            posts.map((post) => (
              <tr key={post.id} className="border-b whitespace-nowrap">
                <td className="px-6 py-4 text-xs">{post.title}</td>
                <td className="px-6 py-4 text-xs">{post.type}</td>
                <td className="px-6 py-4 text-xs">{post.description}</td>
                <td className="px-6 py-4 text-xs">
                  {post.date_created
                    ? new Date(post.date_created).toLocaleDateString()
                    : "No date"}
                </td>
                <td className="px-6 py-4 text-xs">
                  <button
                    onClick={() => handleEdit(post)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                No posts available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersCard;
