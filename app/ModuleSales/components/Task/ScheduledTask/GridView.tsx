import React, { useState, useEffect } from "react";
import { GiPin } from "react-icons/gi";

interface Post {
  id: string;
  companyname: string;
  contactperson: string;
  contactnumber: string;
  typeclient: string;
  activitystatus: string;
  ticketreferencenumber: string;
  date_created: string;
  date_updated: string | null;
}

interface GridViewProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
  loading?: boolean;
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const PINNED_POSTS_STORAGE_KEY = "pinnedPosts";

const GridView: React.FC<GridViewProps> = ({ posts, handleEdit, loading = false }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());

  // Load pinned posts from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(PINNED_POSTS_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setPinnedIds(new Set(parsed));
          }
        } catch {}
      }
    }
  }, []);

  // Save pinned posts to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(PINNED_POSTS_STORAGE_KEY, JSON.stringify(Array.from(pinnedIds)));
    }
  }, [pinnedIds]);

  const togglePin = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="border rounded p-5 shadow-sm animate-pulse bg-gray-100 h-40"
          />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <p className="text-center text-gray-500 text-sm mt-10">No records available</p>
    );
  }

  // Show pinned posts first
  const pinnedPosts = posts.filter((p) => pinnedIds.has(p.id));
  const unpinnedPosts = posts.filter((p) => !pinnedIds.has(p.id));
  const sortedPosts = [...pinnedPosts, ...unpinnedPosts];

  return (
    <div className="grid grid-cols-2 gap-6">
      {sortedPosts.map((post) => {
        const isExpanded = expandedId === post.id;
        const isPinned = pinnedIds.has(post.id);

        return (
          <div
            key={post.id}
            tabIndex={0}
            onClick={() => setExpandedId(isExpanded ? null : post.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setExpandedId(isExpanded ? null : post.id);
            }}
            className={`bg-white rounded-lg p-5 flex flex-col justify-between cursor-pointer
              shadow-sm transition-shadow duration-300
              hover:shadow-md
              relative
              border
              ${isPinned ? "border-yellow-400" : "border-gray-200"}
              `}
            aria-expanded={isExpanded}
          >
            {/* Buttons container on top right */}
            <div className="absolute top-3 right-3 flex space-x-2">
              <button
                onClick={(e) => togglePin(post.id, e)}
                className="p-1 rounded hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                aria-label={isPinned ? `Unpin ${post.companyname}` : `Pin ${post.companyname}`}
                title={isPinned ? "Unpin this post" : "Pin this post"}
                type="button"
              >
                <GiPin
                  size={20}
                  className={`transition-colors duration-200 ${
                    isPinned ? "text-yellow-500" : "text-gray-400 hover:text-yellow-400"
                  }`}
                />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(post);
                }}
                className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`Edit ${post.companyname}`}
                type="button"
              >
                Edit
              </button>
            </div>

            {/* Pinned label at top-left */}
            {isPinned && (
              <span className="absolute top-10 left-3 bg-yellow-200 text-yellow-800 text-xs px-2 py-0.5 rounded font-semibold select-none">
                Pinned
              </span>
            )}

            <p className="text-xs font-semibold text-gray-800 mb-1">
              Company: <span className="uppercase">{post.companyname}</span>
            </p>
            <p className="text-xs text-gray-600 mb-2">
              Contact Person: <span className="capitalize">{post.contactperson}</span>
            </p>

            {isExpanded && (
              <div className="mt-3 space-y-1 text-xs text-gray-700 border-t border-gray-200 pt-3">
                <p>
                  <strong>Contact Number:</strong> {post.contactnumber}
                </p>
                <p>
                  <strong>Type of Client:</strong> {post.typeclient}
                </p>
                <p>
                  <strong>Activity Status:</strong> {post.activitystatus}
                </p>
                <p>
                  <strong>Ticket Reference:</strong> {post.ticketreferencenumber}
                </p>
                <p>
                  <strong>Date Created:</strong> {formatDate(post.date_created)}
                </p>
                <p>
                  <strong>Date Updated:</strong> {formatDate(post.date_updated)}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GridView;
