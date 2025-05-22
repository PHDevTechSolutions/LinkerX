import React, { useState, useEffect } from "react";
import { LuVideo, LuLayoutList, LuFolderKanban, LuClock, LuStar } from "react-icons/lu";

interface UsersCardProps {
  posts: any[];
}

const UsersCard: React.FC<UsersCardProps> = ({ posts }) => {
  const [activeType, setActiveType] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bookmarkedPosts");
      if (stored) setBookmarks(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bookmarkedPosts", JSON.stringify(bookmarks));
    }
  }, [bookmarks]);

  const extractVideoId = (url: string) => {
    const regex =
      /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const toggleBookmark = (postId: string) => {
    setBookmarks((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  // Add "bookmarks" as a special filter tab
  // When activeType === 'bookmarks', show bookmarked posts only
  let filteredPosts = posts;
  if (activeType === "bookmarks") {
    filteredPosts = posts.filter((post) => bookmarks.includes(post.id));
  } else if (activeType) {
    filteredPosts = posts.filter((post) => post.type === activeType);
  }

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredPosts.length;
  const handleLoadMore = () => setVisibleCount((prev) => prev + 12);

  const typeCounts: Record<string, number> = posts.reduce((acc, post) => {
    acc[post.type] = (acc[post.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "video":
        return <LuVideo className="w-4 h-4 mr-2" />;
      case "list":
        return <LuLayoutList className="w-4 h-4 mr-2" />;
      default:
        return <LuFolderKanban className="w-4 h-4 mr-2" />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Left Tabs for Desktop, Select for Mobile */}
      <div className="md:w-1/5 border-b md:border-r md:pr-4">
        <h3 className="text-xs font-semibold mb-2">Module</h3>

        {/* Mobile View: Select Dropdown */}
        <div className="block md:hidden mb-4">
          <select
            value={activeType ?? "all"}
            onChange={(e) => {
              const val = e.target.value;
              setActiveType(val === "all" ? null : val);
              setVisibleCount(12);
            }}
            className="w-full p-2 border rounded-md text-xs bg-white text-gray-700"
          >
            <option value="all">All</option>
            <option value="bookmarks">Bookmarks ({bookmarks.length})</option>
            {Object.entries(typeCounts).map(([type, count]) => (
              <option key={type} value={type}>
                {type} ({count})
              </option>
            ))}
          </select>
        </div>

        {/* Desktop View: Tabs */}
        <div className="hidden md:block">
          <ul className="space-y-1">
            <li
              onClick={() => {
                setActiveType(null);
                setVisibleCount(12);
              }}
              className={`cursor-pointer px-2 py-1 rounded text-xs ${
                activeType === null ? "bg-blue-500 text-white" : "hover:bg-gray-100"
              }`}
            >
              All
            </li>
            <li
              onClick={() => {
                setActiveType("bookmarks");
                setVisibleCount(12);
              }}
              className={`cursor-pointer px-2 py-1 rounded flex items-center justify-between ${
                activeType === "bookmarks"
                  ? "bg-yellow-400 text-white"
                  : "hover:bg-gray-100 text-gray-800"
              }`}
            >
              <span className="flex items-center text-xs">
                <LuStar className="w-4 h-4 mr-2" /> Bookmarks
              </span>
              <span className="text-[10px] bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
                {bookmarks.length}
              </span>
            </li>
            {Object.entries(typeCounts).map(([type, count]) => (
              <li
                key={type}
                onClick={() => {
                  setActiveType(type);
                  setVisibleCount(12);
                }}
                className={`cursor-pointer px-2 py-1 rounded flex items-center justify-between ${
                  activeType === type
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100 text-gray-800"
                }`}
              >
                <span className="flex items-center text-xs">
                  {getTypeIcon(type)} {type}
                </span>
                <span className="text-[10px] bg-gray-300 text-gray-800 px-2 py-0.5 rounded-full">
                  {count}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:w-4/5 md:pl-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {visiblePosts.length > 0 ? (
            visiblePosts.map((post) => {
              const isBookmarked = bookmarks.includes(post.id);
              const videoId = extractVideoId(post.link);

              return (
                <div
                  key={post.id}
                  className="border rounded-xl shadow-sm p-4 flex flex-col justify-between"
                >
                  <div className="text-sm font-semibold text-gray-800 mb-2">{post.title}</div>
                  <div className="flex-1 mb-3">
                    {/* Video iframe */}
                    {videoId && (
                      <div className="mt-4 text-xs">
                        <iframe
                          width="100%"
                          height="200"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title={post.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="rounded-lg"
                        ></iframe>
                      </div>
                    )}

                    <p className="text-xs text-gray-600 mt-2">{post.description}</p>
                  </div>

                  <div className="text-xs text-gray-500 border-t pt-2 mt-auto flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <LuClock size={15} />{" "}
                      {post.date_created
                        ? new Date(post.date_created).toLocaleDateString()
                        : "No date"}
                    </div>

                    <div className="flex gap-4 mt-2">
                      <button
                        onClick={() => toggleBookmark(post.id)}
                        className={`text-xs ${
                          isBookmarked ? "text-yellow-500" : "text-gray-400"
                        } hover:text-yellow-500`}
                        title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
                      >
                        {isBookmarked ? "★ Bookmarked" : "☆ Bookmark"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center text-xs text-gray-500 py-8">
              No content available.
            </div>
          )}
        </div>

        {canLoadMore && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleLoadMore}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersCard;
