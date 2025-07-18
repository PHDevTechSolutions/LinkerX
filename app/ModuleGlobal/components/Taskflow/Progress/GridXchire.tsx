"use client";

import React from "react";
import { format } from "date-fns";

interface GridXchireProps {
  updatedUser: any[];
  selectedUsers: Set<string>;
  bulkDeleteMode: boolean;
  bulkEditMode: boolean;
  handleSelectUser: (id: string) => void;
  handleEdit: (post: any) => void;
  statusColors: Record<string, string>;
}

const formatDate = (timestamp: number) => format(timestamp, "MMM dd, yyyy");

const GridXchire: React.FC<GridXchireProps> = ({
  updatedUser,
  selectedUsers,
  bulkDeleteMode,
  bulkEditMode,
  handleSelectUser,
  handleEdit,
  statusColors,
}) => {
  const showCheckbox = bulkDeleteMode || bulkEditMode;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {updatedUser.map((post) => (
        <div
          key={post.id}
          className={`p-4 border rounded-lg shadow-sm relative bg-white hover:shadow-md`}
        >
          {showCheckbox && (
            <input
              type="checkbox"
              checked={selectedUsers.has(post.id)}
              onChange={() => handleSelectUser(post.id)}
              className="absolute top-2 left-2 w-4 h-4"
            />
          )}

          <div className="flex justify-between items-center mb-2">
            <span className={`px-2 py-1 text-[8px] rounded-full shadow-md font-semibold ${statusColors[post.activitystatus] || "bg-gray-300 text-black"}`}>
              {post.activitystatus}
            </span>
            <button
              className="text-[10px] bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700"
              onClick={() => handleEdit(post)}
            >
              Update
            </button>
          </div>

          <h3 className="text-xs font-bold uppercase truncate">{post.companyname}</h3>
          <p className="text-[11px] text-gray-600 capitalize">{post.typeclient}</p>

          <div className="mt-2 text-[11px] space-y-1">
            <p><strong>Activity #:</strong> {post.activitynumber}</p>
            <p><strong>Type:</strong> {post.typeactivity}</p>
            <p><strong>Call:</strong> {post.callstatus} / {post.typecall}</p>
            <p><strong>Remarks:</strong> {post.remarks}</p>
            <p><strong>CSR Agent:</strong> {post.csragent}</p>
            <p><strong>TSM:</strong> {post.tsm}</p>
          </div>

          <div className="mt-2 text-[10px] space-y-1">
            <p className="text-blue-800 bg-blue-100 p-1 rounded">
              Duration: {formatDate(new Date(post.startdate).getTime())} - {formatDate(new Date(post.enddate).getTime())}
            </p>
            <p className="bg-orange-100 text-orange-800 p-1 rounded">
              Callback: {formatDate(new Date(post.callback).getTime())}
            </p>
            <p className="bg-gray-100 text-gray-800 p-1 rounded">
              Created: {formatDate(new Date(post.date_created).getTime())}
            </p>
            <p className="bg-green-100 text-green-800 p-1 rounded">
              Updated: {formatDate(new Date(post.date_updated).getTime())}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GridXchire;
