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

  // Function to determine border, hover, badge classes and progress based on activity status
  const getActivityStatusClasses = (status: string) => {
    let progress = 0;
    let borderClass = "border-l-4 border-gray-300";
    let hoverClass = "hover:bg-gray-100 hover:text-gray-900";
    let badgeClass = "bg-gray-300 text-black";

    switch (status) {
      case "Cold":
        progress = 5;
        borderClass = "border-l-4 border-blue-400";
        hoverClass = "hover:bg-blue-100 hover:text-blue-900";
        badgeClass = "bg-blue-400 text-white";
        break;
      case "Warm":
        progress = 25;
        borderClass = "border-l-4 border-yellow-400";
        hoverClass = "hover:bg-yellow-100 hover:text-yellow-900";
        badgeClass = "bg-yellow-400 text-white";
        break;
      case "Hot":
        progress = 50;
        borderClass = "border-l-4 border-red-400";
        hoverClass = "hover:bg-red-100 hover:text-red-900";
        badgeClass = "bg-red-400 text-white";
        break;
      case "Done":
        progress = 100;
        borderClass = "border-l-4 border-green-500";
        hoverClass = "hover:bg-green-100 hover:text-green-900";
        badgeClass = "bg-green-500 text-white";
        break;
      case "Cancelled":
        progress = 0;
        borderClass = "border-l-4 border-rose-500";
        hoverClass = "hover:bg-rose-100 hover:text-rose-900";
        badgeClass = "bg-rose-500 text-white";
        break;
      case "Loss":
        progress = 0;
        borderClass = "border-l-4 border-stone-500";
        hoverClass = "hover:bg-stone-100 hover:text-stone-900";
        badgeClass = "bg-stone-400 text-white";
        break;
      default:
        break;
    }
    return { progress, borderClass, hoverClass, badgeClass };
  };

  return (
    <div className="overflow-x-auto">
      <ToastContainer autoClose={1000} />

      {/* ✅ Table */}
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
            <th className="px-6 py-4 font-semibold text-gray-700">Project Name</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Company Name</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Progress</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {posts.length > 0 ? (
            posts.map((post) => {
              const { progress, borderClass, hoverClass, badgeClass } = getActivityStatusClasses(post.activitystatus);

              return (
                <tr key={post.id} className={`border-b ${hoverClass} whitespace-nowrap`}>
                  <td className={`px-6 py-4 text-xs capitalize ${borderClass}`}>{post.projectname}</td>
                  <td className="px-6 py-4 text-xs uppercase">{post.companyname}</td>
                  <td className="px-6 py-4 text-xs">
                    {/* Display progress as a percentage */}
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div
                          className={`h-2 rounded-full ${badgeClass}`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs">{progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span className={`text-[10px] px-2 py-1 rounded-full ${badgeClass}`}>
                      {post.activitystatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs">{formatDate(post.date_created)}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="text-center text-xs py-4">
                No records available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
