import React, { useState } from "react";

interface UsersCardProps {
  posts: any[];
  handleDelete: (postId: string) => void;
  referenceid?: string;
}

const UsersCard: React.FC<UsersCardProps> = ({ posts }) => {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  // Function to extract YouTube video ID from URL
  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Get current posts based on page
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentPosts.length > 0 ? (
          currentPosts.map((post) => (
            <div
              key={post.id}
              className="border rounded-xl shadow-sm p-4 flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="text-sm font-semibold text-gray-800 mb-2">
                {post.title}
              </div>

              {/* Card Body */}
              <div className="flex-1 mb-3">
                <p className="text-xs text-gray-600 mt-2">{post.description}</p>
                {/* Video Embed */}
                {post.link.includes("youtube.com") && (
                  <div className="mt-4">
                    {extractVideoId(post.link) && (
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
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="text-xs text-gray-500 border-t pt-2 mt-auto">
                {post.date_created
                  ? new Date(post.date_created).toLocaleDateString()
                  : "No date"}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-xs text-gray-500 py-8">
            No video available.
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
  );
};

export default UsersCard;
