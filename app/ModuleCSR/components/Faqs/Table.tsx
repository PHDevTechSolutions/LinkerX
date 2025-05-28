"use client";
import React, { useState, useMemo } from "react";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";

interface Post {
  _id: string;
  Title: string;
  Description: string; // Draft.js raw JSON string
}

interface AccountsTableProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
  handleDelete: (postId: string) => void;
  role: string;
}

const draftDescriptionToHTML = (description: string) => {
  try {
    const contentState = convertFromRaw(JSON.parse(description));
    return stateToHTML(contentState);
  } catch {
    return description;
  }
};

const ClientAccordion: React.FC<AccountsTableProps> = ({
  posts,
  handleEdit,
  handleDelete,
  role,
}) => {
  const [expandedTitle, setExpandedTitle] = useState<string | null>(null);

  const groupedPosts = useMemo(() => {
    const grouped: Record<string, Post[]> = {};
    posts.forEach((post) => {
      if (!grouped[post.Title]) {
        grouped[post.Title] = [];
      }
      grouped[post.Title].push(post);
    });
    return grouped;
  }, [posts]);

  const uniqueTitles = Object.keys(groupedPosts);

  return (
    <div className="space-y-4">
      {uniqueTitles.map((title) => (
        <div key={title} className="border rounded-md shadow-md overflow-hidden">
          <button
            className="w-full text-left px-4 py-3 font-semibold text-sm flex justify-between items-center"
            onClick={() =>
              setExpandedTitle(expandedTitle === title ? null : title)
            }
          >
            <span className="text-md font-bold capitalize">{title}</span>
            <span className="text-gray-500 text-xs">
              {expandedTitle === title ? "− " : "+"}
            </span>
          </button>

          {expandedTitle === title && (
            <div className="bg-white p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedPosts[title].map((post) => (
                  <div
                    key={post._id}
                    className="border p-3 rounded-md flex justify-between items-start text-xs space-x-4"
                  >
                    <div
                      className="text-gray-700 text-xs capitalize prose max-w-full"
                      dangerouslySetInnerHTML={{
                        __html: draftDescriptionToHTML(post.Description),
                      }}
                    />
                    {role !== "Staff" && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ClientAccordion;
