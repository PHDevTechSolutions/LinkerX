import React from "react";

interface Post {
  id: string;
  companyname: string;
  contactperson: string;
  contactnumber: string;
  emailaddress: string;
  address: string;
  area: string;
  typeclient: string;
  referenceid: string;
  tsm: string;
  status: string;
  remarks: string;
  date_created: string;
  date_updated: string;
}

interface TableXchireProps {
  updatedUser: Post[];
  bulkDeleteMode: boolean;
  bulkEditMode: boolean;
  bulkChangeMode: boolean;
  bulkTransferMode: boolean;
  bulkTransferTSAMode: boolean;
  selectedUsers: Set<string>;
  handleSelectUser: (id: string) => void;
  handleEdit: (post: Post) => void;
  formatDate: (timestamp: number) => string;
}

const TableXchire: React.FC<TableXchireProps> = ({
  updatedUser,
  bulkDeleteMode,
  bulkEditMode,
  bulkChangeMode,
  bulkTransferMode,
  bulkTransferTSAMode,
  selectedUsers,
  handleSelectUser,
  handleEdit,
  formatDate,
}) => {
  return (
    <table className="min-w-full table-auto">
      <thead className="bg-gray-100">
        <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
          {(bulkDeleteMode || bulkEditMode || bulkChangeMode || bulkTransferMode || bulkTransferTSAMode) && (
            <th className="px-6 py-4 font-semibold text-gray-700">Select</th>
          )}
          <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
          <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
          <th className="px-6 py-4 font-semibold text-gray-700">Company Name</th>
          <th className="px-6 py-4 font-semibold text-gray-700">Contact Person</th>
          <th className="px-6 py-4 font-semibold text-gray-700">Contact Number</th>
          <th className="px-6 py-4 font-semibold text-gray-700">Email Address</th>
          <th className="px-6 py-4 font-semibold text-gray-700">Address</th>
          <th className="px-6 py-4 font-semibold text-gray-700">Area</th>
          <th className="px-6 py-4 font-semibold text-gray-700">Type of Client</th>
          <th className="px-6 py-4 font-semibold text-gray-700">TSA | TSM</th>
          <th className="px-6 py-4 font-semibold text-gray-700">Remarks</th>
          <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {updatedUser.length > 0 ? (
          updatedUser.map((post) => {
            const borderLeftClass = {
              Active: "border-l-4 border-green-400",
              Used: "border-l-4 border-blue-400",
              Inactive: "border-l-4 border-red-400",
              "For Deletion": "border-l-4 border-rose-400",
              Remove: "border-l-4 border-rose-900",
              "Approve For Deletion": "border-l-4 border-sky-400",
            }[post.status] || "";

            const hoverClass = {
              Active: "hover:bg-green-100 hover:text-green-900",
              Used: "hover:bg-blue-100 hover:text-blue-900",
              Inactive: "hover:bg-red-100 hover:text-red-900",
              "For Deletion": "hover:bg-rose-100 hover:text-rose-900",
              Remove: "hover:bg-rose-200 hover:text-rose-900",
              "Approve For Deletion": "hover:bg-sky-100 hover:text-sky-900",
            }[post.status] || "";

            return (
              <tr key={post.id} className={`border-b whitespace-nowrap ${hoverClass}`}>
                {(bulkDeleteMode || bulkEditMode || bulkChangeMode || bulkTransferMode || bulkTransferTSAMode) && (
                  <td className={`px-6 py-4 text-xs ${borderLeftClass}`}>
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(post.id)}
                      onChange={() => handleSelectUser(post.id)}
                      className={`w-4 h-4 ${
                        bulkDeleteMode
                          ? "text-red-600"
                          : bulkEditMode || bulkChangeMode
                          ? "text-blue-600"
                          : "text-purple-600"
                      }`}
                    />
                  </td>
                )}
                <td className="px-6 py-4 text-xs">
                  <button
                    onClick={() => handleEdit(post)}
                    className="px-3 py-1 ml-2 text-[10px] text-white bg-blue-500 hover:bg-blue-800 hover:rounded-full rounded-md"
                  >
                    Update
                  </button>
                </td>
                <td className="px-6 py-4 text-xs">
                  <span
                    className={`px-2 py-1 text-[8px] font-semibold rounded-full whitespace-nowrap ${
                      post.status === "Active"
                        ? "bg-green-400 text-white"
                        : post.status === "Used"
                        ? "bg-blue-400 text-white"
                        : post.status === "Inactive"
                        ? "bg-red-400 text-white"
                        : post.status === "For Deletion"
                        ? "bg-rose-400 text-white"
                        : post.status === "Remove"
                        ? "bg-rose-800 text-white"
                        : post.status === "Approve For Deletion"
                        ? "bg-sky-400 text-white"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs uppercase">{post.companyname}</td>
                <td className="px-6 py-4 text-xs capitalize">{post.contactperson}</td>
                <td className="px-6 py-4 text-xs">{post.contactnumber}</td>
                <td className="px-6 py-4 text-xs">{post.emailaddress}</td>
                <td className="px-6 py-4 text-xs capitalize">{post.address}</td>
                <td className="px-6 py-4 text-xs capitalize">{post.area}</td>
                <td className="px-6 py-4 text-xs">{post.typeclient}</td>
                <td className="px-6 py-4 text-xs">
                  <strong>{post.referenceid}</strong> | {post.tsm}
                </td>
                <td className="px-6 py-4 text-xs">{post.remarks}</td>
                <td className="px-4 py-2 text-xs align-top">
                  <div className="flex flex-col gap-1">
                    <span className="text-white bg-blue-400 p-2 rounded">
                      Uploaded: {formatDate(new Date(post.date_created).getTime())}
                    </span>
                    <span className="text-white bg-green-500 p-2 rounded">
                      Updated: {formatDate(new Date(post.date_updated).getTime())}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={13} className="text-center py-4 text-xs">
              No accounts available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TableXchire;
