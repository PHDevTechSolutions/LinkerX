import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Post {
  id: string;
  projecttype: string;
  activitystatus: string;
  companyname: string;
  date_created: string;
  source: string;
}

interface UsersCardProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
  fetchAccount: () => void;
  TargetQuota: string;
}

const UsersTable: React.FC<UsersCardProps> = ({ posts }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const groupedPosts = posts.reduce((acc: Record<string, Post[]>, post) => {
    const { projecttype } = post;
    if (!acc[projecttype]) acc[projecttype] = [];
    acc[projecttype].push(post);
    return acc;
  }, {});

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
    }
    return { progress, borderClass, hoverClass, badgeClass };
  };

  const openModal = (category: string) => {
    setSelectedCategory(category);
  };

  const closeModal = () => {
    setSelectedCategory(null);
  };

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
    <div className="overflow-x-auto">
      <ToastContainer autoClose={1000} />

      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
            <th className="px-6 py-4 font-semibold text-gray-700">Project Type</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Total Companies</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {Object.keys(groupedPosts).map((category) => {
            const group = groupedPosts[category];
            const count = group.length;
            const { progress, borderClass, hoverClass, badgeClass } = getActivityStatusClasses(
              group[0].activitystatus
            );

            return (
              <tr
                key={category}
                className={`border-b ${hoverClass} cursor-pointer`}
                onClick={() => openModal(category)}
              >
                <td className={`px-6 py-4 text-xs capitalize ${borderClass}`}>{category}</td>
                <td className="px-6 py-4 text-xs font-bold text-gray-800">{count}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal for selected category */}
      {selectedCategory && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold mb-4">
              {selectedCategory} Companies ({groupedPosts[selectedCategory].length})
            </h3>
            <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
              <table className="min-w-full table-auto text-sm border border-gray-200">
                <thead className="bg-gray-100">
                  <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
                    <th className="px-6 py-4 font-semibold text-gray-700">Company Name</th>
                    <th className="px-6 py-4 font-semibold text-gray-700">Source</th>
                    <th className="px-6 py-4 font-semibold text-gray-700">Progress</th>
                    <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 font-semibold text-gray-700">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {groupedPosts[selectedCategory].map((post) => {
                    const { progress, badgeClass } = getActivityStatusClasses(post.activitystatus);

                    return (
                      <tr key={post.id} className="border-b whitespace-nowrap">
                        <td className="px-6 py-4 text-xs uppercase">{post.companyname}</td>
                        <td className="px-6 py-4 text-xs">{post.source}</td>
                        <td className="px-6 py-4 text-xs">
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
                  })}
                </tbody>
              </table>
            </div>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 text-black rounded text-xs border"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
