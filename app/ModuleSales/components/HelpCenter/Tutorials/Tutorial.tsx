import React, { useState } from "react";
import { LuVideo, LuLayoutList, LuFolderKanban, LuClock } from "react-icons/lu";

interface UsersCardProps {
  posts: any[];
  handleDelete: (postId: string) => void;
  referenceid?: string;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeType, setActiveType] = useState<string | null>(null);
  const postsPerPage = 12;

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Count per type for badges
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

  // Get unique types for tabs
  const types = Array.from(new Set(posts.map((post) => post.type)));

  // Filter by selected type
  const filteredPosts = activeType ? posts.filter((post) => post.type === activeType) : posts;

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
              const selectedType = e.target.value === "all" ? null : e.target.value;
              setActiveType(selectedType);
              setCurrentPage(1);
            }}
            className="w-full p-2 border rounded-md text-xs bg-white text-gray-700"
          >
            <option value="all">All</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type} ({typeCounts[type]})
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
                setCurrentPage(1);
              }}
              className={`cursor-pointer px-2 py-1 rounded text-xs ${activeType === null ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
            >
              All
            </li>
            {types.map((type) => (
              <li
                key={type}
                onClick={() => {
                  setActiveType(type);
                  setCurrentPage(1);
                }}
                className={`cursor-pointer px-2 py-1 rounded flex items-center justify-between ${activeType === type ? "bg-blue-500 text-white" : "hover:bg-gray-100 text-gray-800"
                  }`}
              >
                <span className="flex items-center text-xs">{getTypeIcon(type)} {type}</span>
                <span className="text-[10px] bg-gray-300 text-gray-800 px-2 py-0.5 rounded-full">
                  {typeCounts[type]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:w-4/5 md:pl-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <div key={post.id} className="border rounded-xl shadow-sm p-4 flex flex-col justify-between">
                <div className="text-sm font-semibold text-gray-800 mb-2">{post.title}</div>
                <div className="flex-1 mb-3">
                  {post.link.includes("youtube.com") && (
                    <div className="mt-4">
                      <iframe
                        width="100%"
                        height="315"
                        src={`https://www.youtube.com/embed/${extractVideoId(post.link)}`}
                        title={post.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="rounded-xl"
                      ></iframe>
                    </div>
                  )}
                  <p className="text-xs text-gray-600 mt-2">{post.description}</p>
                </div>
                <div className="text-xs text-gray-500 border-t pt-2 mt-auto flex gap-1">
                  <LuClock size={15}/> {post.date_created ? new Date(post.date_created).toLocaleDateString() : "No date"}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-xs text-gray-500 py-8">
              No content available.
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4 text-xs">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-l-md disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 ${currentPage === index + 1 ? "bg-blue-400 text-white" : "bg-gray-200 text-gray-700"} rounded-md mx-1`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-r-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersCard;
