import React from "react";

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
}

interface TableViewProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
}

const statusColors: Record<string, string> = {
  Cold: "bg-blue-400",
  Warm: "bg-yellow-400 text-black",
  Hot: "bg-red-300",
  Done: "bg-green-500",
};

const formatDate = (dateStr: string | null) => {
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
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
            {/* Sticky Edit Button Header */}
            <th
              scope="col"
              className="px-6 py-4 font-semibold text-gray-700 sticky left-0 bg-gray-100 border-r border-gray-200 z-20 cursor-default"
              aria-label="Actions"
            >
              Actions
            </th>

            {/* Status Header (non-sticky) */}
            <th
              scope="col"
              className="px-6 py-4 font-semibold text-gray-700"
            >
              Status
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
              Date Created
            </th>
            <th scope="col" className="px-6 py-4 font-semibold text-gray-700">
              Date Updated
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {posts.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center py-4 text-xs">
                No records available
              </td>
            </tr>
          ) : (
            posts.map((post) => (
              <tr
                key={post.id}
                className="border-b whitespace-nowrap hover:bg-gray-100 cursor-pointer"
                onClick={() => handleEdit(post)}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleEdit(post)}
              >
                {/* Sticky Edit Button Cell */}
                <td
                  className="px-6 py-4 text-xs sticky left-0 bg-white border-r border-gray-200 z-20"
                  onClick={(e) => e.stopPropagation()}
                >
                   <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering expand on click
                handleEdit(post);
              }}
              className="absolute top-3 right-3 bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600 transition"
              aria-label={`Edit ${post.companyname}`}
            >
              Edit
            </button>
                </td>

                {/* Status Cell */}
                <td className="px-6 py-4 text-xs">
                  <span
                    className={`px-2 py-1 text-[10px] rounded-full text-white font-semibold ${
                      statusColors[post.activitystatus] ?? "bg-gray-300 text-black"
                    }`}
                  >
                    {post.activitystatus}
                  </span>
                </td>

                <td className="px-6 py-4 text-xs uppercase">{post.companyname}</td>
                <td className="px-6 py-4 text-xs capitalize">{post.contactperson}</td>
                <td className="px-6 py-4 text-xs">{post.contactnumber}</td>
                <td className="px-6 py-4 text-xs">{post.typeclient}</td>
                <td className="px-6 py-4 text-xs">{post.ticketreferencenumber}</td>
                <td className="px-6 py-4 text-xs">{formatDate(post.date_created)}</td>
                <td className="px-6 py-4 text-xs">{formatDate(post.date_updated)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;
