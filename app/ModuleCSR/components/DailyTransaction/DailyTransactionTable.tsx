import React, { useState, useCallback, useMemo } from "react";
import { BsPlusCircle } from "react-icons/bs";
import { CiClock2 } from "react-icons/ci";

interface DailyTransactionCardProps {
  posts: any[];
}

const calculateTimeConsumed = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return "N/A";
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffInSeconds = (end.getTime() - start.getTime()) / 1000;
  
  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = Math.floor(diffInSeconds % 60);
  
  return `${hours}h ${minutes}m ${seconds}s`;
};

const DailyTransactionCards: React.FC<DailyTransactionCardProps> = ({ posts }) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleExpand = useCallback((postId: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  }, []);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const dateA = a.start_date ? new Date(a.start_date) : new Date(0);
      const dateB = b.start_date ? new Date(b.start_date) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  }, [posts]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {sortedPosts.length > 0 ? (
        sortedPosts.map((post) => {
          const timeConsumed = calculateTimeConsumed(post.start_date, post.end_date);
          return (
            <div key={post._id} className="border rounded-md shadow-md p-4 flex flex-col bg-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <BsPlusCircle className="text-gray-700 cursor-pointer" onClick={() => toggleExpand(post._id)} />
                  <h3 className="text-xs font-semibold uppercase">{post.account_name}</h3>
                </div>
              </div>
              {expandedCards[post._id] && (
                <div className="mt-4 text-xs capitalize">
                  <p><strong>Ticker Number:</strong> {post.ticket_reference_number}</p>
                  <p><strong>Contact:</strong> {post.contact_person} ({post.contact_number})</p>
                  <p><strong>Email:</strong> {post.email}</p>

                  <p className="mt-2"><strong>Call Type:</strong> {post.type_of_call}</p>
                  <p><strong>Status:</strong> {post.call_status}</p>
                  <div className="border-t border-gray-800 pb-4 mt-4"></div>
                  <p><strong>Remarks:</strong> {post.remarks}</p>
                </div>
              )}
              
              <div className="border-t border-gray-900 mt-3 pt-2 text-xs flex justify-between items-center italic capitalize">
                <span>TSA: {post.agent_fullname}</span>
                <span>TSM: {post.tsm_fullname}</span>
              </div>
              <div className="border-t border-gray-900 mt-3 pt-2 text-xs flex gap-2">
                <span className="italic capitalize">
                  <strong>Call Duration:</strong> {post.start_date} - {post.end_date} / {timeConsumed}
                  </span>
                </div>
            </div>
          );
        })
      ) : (
        <div className="col-span-full text-center py-4 text-sm">No transactions available</div>
      )}
    </div>
  );
};

export default DailyTransactionCards;
