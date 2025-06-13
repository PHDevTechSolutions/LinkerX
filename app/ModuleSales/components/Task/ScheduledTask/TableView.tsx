import React, { useMemo, useCallback } from "react";
import { IoIosSettings } from "react-icons/io";

export interface Post {
  id: string;
  companyname: string;
  contactperson: string;
  contactnumber: string;
  typeclient: string;
  activitystatus: string;
  ticketreferencenumber: string;
  date_created: string;
  date_updated: string | null;
  activitynumber: string;
}

interface TableViewProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
  refreshPosts: () => void;
}

const statusColors: Record<string, string> = {
  Assisted: "bg-blue-400 text-white",
  Paid: "bg-green-500 text-white",
  Delivered: "bg-cyan-400 text-white",
  Collected: "bg-indigo-500 text-white",
  "Quote-Done": "bg-slate-500 text-white",
  "SO-Done": "bg-purple-500 text-white",
  Cancelled: "bg-red-500 text-white",
  Loss: "bg-red-800 text-white",
};

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const TableView: React.FC<TableViewProps> = ({ posts, handleEdit }) => {
  const groupedPosts = useMemo(() => {
    return posts.reduce<Record<string, Post[]>>((groups, post) => {
      const dateKey = (() => {
        if (!post.date_created) return "N/A";
        const date = new Date(post.date_created);
        if (isNaN(date.getTime())) return "Invalid date";
        return date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      })();

      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(post);
      return groups;
    }, {});
  }, [posts]);

  const onEdit = useCallback(
    (post: Post) => {
      handleEdit(post);
    },
    [handleEdit]
  );

  const renderedRows = useMemo(() => {
    if (posts.length === 0) {
      return (
        <tr>
          <td colSpan={9} className="text-center py-4 text-xs">
            No records available
          </td>
        </tr>
      );
    }

    return Object.entries(groupedPosts).map(([date, postsForDate]) => {
      const hasCold = postsForDate.some((p) => p.activitystatus === "Cold");

      return (
        <React.Fragment key={date}>
          {/* Group header */}
          <tr className="bg-gray-200 font-semibold text-xs text-gray-600">
            <td colSpan={9} className="px-6 py-2 sticky top-10 z-10">
              <div className="flex items-center justify-start gap-2">
                <span>{date}</span>
                {postsForDate.some((post) => post.activitystatus === "Cold") && (
                  <div className="bg-orange-500 pl-2 pr-2 rounded-full flex items-center text-white text-[10px] font-semibold space-x-1">
                    <IoIosSettings className="animate-spin" />
                    <span>On Progress</span>
                  </div>
                )}
              </div>
            </td>
          </tr>

          {postsForDate.map((post) => (
            <tr
              key={post.id}
              className="whitespace-nowrap hover:bg-gray-100 cursor-pointer"
              onClick={() => onEdit(post)}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onEdit(post)}
            >
              <td
                className="px-6 py-4 text-xs sticky left-0 bg-white border-r border-gray-200 z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(post);
                  }}
                  className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-700 transition"
                  aria-label={`Edit ${post.companyname}`}
                >
                  Create
                </button>
              </td>

              <td className="px-6 py-4 text-xs">
                <span
                  className={`px-2 py-1 text-[10px] rounded-full text-white font-semibold ${statusColors[post.activitystatus] ?? "bg-gray-300 text-black"
                    }`}
                >
                  {post.activitystatus}
                </span>
              </td>
              <td className="px-6 py-4 text-xs">{formatDate(post.date_created)}</td>
              <td className="px-6 py-4 text-xs uppercase">{post.companyname}</td>

              <td colSpan={5} className="relative px-0 py-0 whitespace-nowrap">
                <div className="flex">
                  <div className="px-6 py-4 text-xs capitalize flex-1 whitespace-nowrap">
                    {post.contactperson}
                  </div>
                  <div className="px-6 py-4 text-xs flex-1 whitespace-nowrap">
                    {post.contactnumber}
                  </div>
                  <div className="px-6 py-4 text-xs flex-1">
                    {post.typeclient}
                  </div>
                  <div className="px-6 py-4 text-xs flex-1">
                    {post.ticketreferencenumber}
                  </div>
                  <div className="px-6 py-4 text-xs flex-1">
                    {formatDate(post.date_updated)}
                  </div>
                </div>
              </td>

            </tr>
          ))}
        </React.Fragment>
      );
    });
  }, [groupedPosts, onEdit, posts.length]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
            <th
              scope="col"
              className="px-6 py-4 font-semibold text-gray-700 sticky left-0 bg-gray-100 border-r border-gray-200 z-20 cursor-default"
              aria-label="Actions"
            >
              Actions
            </th>
            <th scope="col" className="px-6 py-4 font-semibold text-gray-700">
              Status
            </th>
            <th scope="col" className="px-6 py-4 font-semibold text-gray-700">
              Date Created
            </th>
            <th scope="col" className="px-6 py-4 font-semibold text-gray-700">
              Company Name
            </th>
            <th scope="col" className="px-6 py-4 font-semibold text-gray-700">
              Contact Person
            </th>
            <th scope="col" className="px-6 py-4 font-semibold text-gray-700">
              Contact Number
            </th>
            <th scope="col" className="px-6 py-4 font-semibold text-gray-700">
              Type of Client
            </th>
            <th scope="col" className="px-6 py-4 font-semibold text-gray-700">
              Ticket Reference Number
            </th>
            <th scope="col" className="px-6 py-4 font-semibold text-gray-700">
              Date Updated
            </th>
          </tr>
        </thead>
        <tbody>{renderedRows}</tbody>
      </table>
    </div>
  );
};

export default TableView;
