import React, { useEffect, useState, useCallback, useMemo } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineLeft, AiOutlineRight, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";


interface Post {
  _id: string;
  CompanyName: string;
  CustomerName: string;
  Gender: string;
  ContactNumber: string;
  Email: string;
  CityAddress: string;
  CustomerSegment?: string;
  CustomerType?: string;
}

interface AccountsTableProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
  handleDelete: (postId: string) => void;
  Role: string;
}

const formatDate = (dateString?: string) => {
  return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
};

const AccountsCards: React.FC<AccountsTableProps> = ({ posts, handleEdit, handleDelete, Role }) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [menuVisible, setMenuVisible] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(0);

  const updatedPosts = useMemo(() => posts, [posts]);

  useEffect(() => {
    console.log("Role in AccountsTable:", Role);
  }, [Role]);

  const toggleExpand = useCallback((postId: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  }, []);

  const toggleMenu = (postId: string) => {
    setMenuVisible((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {updatedPosts.map((post) => (
        <div key={post._id} className="relative border-b-2 rounded-md shadow-md p-4 flex flex-col mb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 border border-black shadow-xl rounded-full bg-green-500"></span>
              <h3 className="text-xs font-semibold capitalize">{post.CompanyName}</h3>
            </div>
            <div className="flex items-center space-x-1">
              <button onClick={() => toggleExpand(post._id)} className="text-gray-500 hover:text-gray-800">
                {expandedCards[post._id] ? <AiOutlineMinus size={12} /> : <AiOutlinePlus size={12} />}
              </button>
              <button onClick={() => toggleMenu(post._id)} className="text-gray-500 hover:text-gray-800">
                <BsThreeDotsVertical size={12} />
              </button>
            </div>
          </div>

          {expandedCards[post._id] && (
            <div className="mt-4 text-xs capitalize flex-grow">
              <p><strong>Customer Name:</strong> {post.CustomerName}</p>
              <p><strong>Gender:</strong> {post.Gender}</p>
              <p><strong>Contact Number:</strong> {post.ContactNumber}</p>
              <p><strong>Email:</strong> {post.Email}</p>
              <p><strong>City Address:</strong> {post.CityAddress}</p>
              <hr className="my-2 border-gray-900" />
              {post.CustomerSegment && <p><strong>Segment:</strong> {post.CustomerSegment}</p>}
            </div>
          )}

          <div className="border-t border-gray-900 mt-3 pt-2 text-xs flex justify-between items-center">
            <span className="flex items-center gap-1 font-bold">Type: {post.CustomerType}</span>
          </div>

          {menuVisible[post._id] && (
            <div className="absolute right-4 top-12 bg-white shadow-lg rounded-lg border w-32 z-10 text-xs">
              <button onClick={() => handleEdit(post)} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                Edit Details
              </button>
              <button onClick={() => handleDelete(post._id)} className="border-t w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AccountsCards;