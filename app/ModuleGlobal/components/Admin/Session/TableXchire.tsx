import React from "react";

interface TableXchireProps {
  data: any[];
  handleEdit: (post: any) => void;
  handleDelete: (postId: string) => void;
  Role: string;
  Department: string;
}

const TableXchire: React.FC<TableXchireProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-200 sticky top-0 z-10">
          <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
            <th className="px-6 py-4 font-semibold text-gray-700">Email</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Department</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Timestamp</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((post) => (
              <tr key={post._id} className="whitespace-nowrap hover:bg-gray-100 cursor-pointer">
                <td className="px-6 py-4 text-xs">{post.email}</td>
                <td className="px-6 py-4 text-xs">{post.department}</td>
                <td className="px-6 py-4 text-xs">
                  {post.timestamp
                    ? new Date(post.timestamp).toLocaleString()
                    : "N/A"}
                </td>
                <td className="px-6 py-4 text-xs capitalize">
                  {post.status || "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center px-4 py-4 text-gray-500">
                No accounts available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableXchire;
