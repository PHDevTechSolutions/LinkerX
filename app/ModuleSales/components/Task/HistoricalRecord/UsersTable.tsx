import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Updated the interface to include targetQuota
interface UsersCardProps {
  posts: any[];
  handleEdit: (post: any) => void;
  fetchAccount: () => void;
  TargetQuota: string;
}

const UsersTable: React.FC<UsersCardProps> = ({ posts }) => {
  // ✅ Format date to Philippine standard
  const formatDate = (timestamp: string) => {
    return new Intl.DateTimeFormat("en-PH", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Manila",
    }).format(new Date(timestamp));
  };

  return (
    <div className="p-4">
      <ToastContainer autoClose={1000} />

      {/* 6 Cards - 3 per row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.slice(0, 6).map((post, index) => (
          <div key={index} className="bg-white p-4 rounded shadow border-l-4 border-orange-400">
            <h2 className="text-sm font-bold capitalize">{post.projectname}</h2>
            <p className="text-xs uppercase text-gray-500">{post.companyname}</p>
            <p className="text-xs mt-2">{post.activitystatus}</p>
            <p className="text-[10px] text-gray-400 mt-1">{formatDate(post.date_created)}</p>
          </div>
        ))}
      </div>

      {/* Full width card */}
      {posts[6] && (
        <div className="mt-4">
          <div className="bg-white p-6 rounded shadow border-l-4 border-orange-400 w-full">
            <h2 className="text-base font-bold capitalize">{posts[6].projectname}</h2>
            <p className="text-xs uppercase text-gray-500">{posts[6].companyname}</p>
            <p className="text-sm mt-2">{posts[6].activitystatus}</p>
            <p className="text-xs text-gray-400 mt-1">{formatDate(posts[6].date_created)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
