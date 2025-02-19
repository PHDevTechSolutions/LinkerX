import React, { useEffect, useState, useCallback, useMemo } from "react";
import io from "socket.io-client";
import moment from "moment";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

const socket = io("http://localhost:3000");

interface Post {
  _id: string;
  userName: string;
  CompanyName: string;
  CustomerName: string;
  ContactNumber: string;
  TicketType: string;
  TicketConcern: string;
  NatureConcern: string;
  SalesManager: string;
  SalesAgent: string;
  PendingDays: string;
  Department: string;
  TrackingRemarks: string;
  TrackingStatus: string;
  EndorsedDate: string;
  ClosedDate: string;
}

interface AccountsCardsProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
}

const DTrackingCards: React.FC<AccountsCardsProps> = ({ posts, handleEdit }) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [menuVisible, setMenuVisible] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const newPostListener = (newPost: Post) => {
      if (!posts.some((post) => post._id === newPost._id)) {
        posts.unshift(newPost);
      }
    };

    socket.on("newPost", newPostListener);
    return () => {
      socket.off("newPost", newPostListener);
    };
  }, [posts]);

  const toggleExpand = useCallback((postId: string) => {
    setExpandedCards((prev) => ({ ...prev, [postId]: !prev[postId] }));
  }, []);

  const toggleMenu = useCallback((postId: string) => {
    setMenuVisible((prev) => ({ ...prev, [postId]: !prev[postId] }));
  }, []);

  const formatDate = (timestamp: string) => {
    if (!timestamp) return "N/A";
    return moment(timestamp).format("MMM DD, YYYY hh:mm A");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} className="relative border rounded-md shadow-md p-4 flex flex-col bg-white">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold capitalize">{post.CompanyName}</h3>
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
              <div className="mt-2 text-xs capitalize">
                <p><strong>Company:</strong> {post.CompanyName}</p>
                <p><strong>Customer:</strong> {post.CustomerName}</p>
                <p><strong>Contact:</strong> {post.ContactNumber}</p>
                <p className="mt-2"><strong>Ticket Type:</strong> {post.TicketType} <strong>Concern: </strong>{post.TicketConcern}</p>
                <p><strong>Department:</strong> {post.Department}</p>
                <div className="border-t border-gray-800 pb-4 mt-4"></div>
                <p><strong>Pending Days:</strong> {post.PendingDays}</p>
                <p><strong>Endorsed:</strong> {formatDate(post.EndorsedDate)}</p>
                <p><strong>Closed:</strong> {formatDate(post.ClosedDate)}</p>
                <div className="border-t border-gray-800 pb-4 mt-4"></div>
                <p><strong>Remarks:</strong> {post.TrackingRemarks}</p>
              </div>
            )}
            
            <div className="border-t border-gray-300 mt-3 pt-2 text-xs flex justify-between items-center">
              <span className="italic capitalize">{post.userName}</span>
              <span className="italic">{post.TrackingStatus}</span>
            </div>

            {menuVisible[post._id] && (
              <div className="absolute right-2 top-10 bg-white shadow-lg rounded-lg border w-32 z-10 text-xs">
                <button onClick={() => handleEdit(post)} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Edit Details
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500 text-xs">No records found</p>
      )}
    </div>
  );
};

export default DTrackingCards;
