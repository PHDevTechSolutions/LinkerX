import React, { useMemo } from "react";

interface TableXchireProps {
  updatedUser: any[];
  bulkDeleteMode: boolean;
  bulkEditMode: boolean;
  selectedUsers: Set<string>;
  handleSelectUser: (userId: string) => void;
  handleEdit: (post: any) => void;
  formatDate: (timestamp: number) => string;
  statusColors: Record<string, string>;
}

const TableXchire: React.FC<TableXchireProps> = ({
  updatedUser,
  bulkDeleteMode,
  bulkEditMode,
  selectedUsers,
  handleSelectUser,
  handleEdit,
  formatDate,
  statusColors,
}) => {
  const showCheckbox = bulkDeleteMode || bulkEditMode;

  const borderLeftClassMap: Record<string, string> = {
    Cold: "border-l-4 border-blue-400",
    Warm: "border-l-4 border-yellow-400",
    Hot: "border-l-4 border-red-400",
    Done: "border-l-4 border-green-500",
    Loss: "border-l-4 border-stone-500",
    Cancelled: "border-l-4 border-rose-500",
  };

  const hoverClassMap: Record<string, string> = {
    Cold: "hover:bg-blue-100 hover:text-blue-900",
    Warm: "hover:bg-yellow-100 hover:text-yellow-900",
    Hot: "hover:bg-red-100 hover:text-red-900",
    Done: "hover:bg-green-100 hover:text-green-900",
    Cancelled: "hover:bg-rose-100 hover:text-rose-900",
    Loss: "hover:bg-stone-100 hover:text-stone-900",
  };

  const displayFields = [
    "activitynumber", "companyname", "contactperson", "contactnumber",
    "emailaddress", "address", "area", "typeclient", "projectname",
    "projectcategory", "projecttype", "source", "targetquota",
    "activityremarks", "ticketreferencenumber", "wrapup", "inquiries",
    "csragent"
  ];

  const rows = useMemo(() => {
    return updatedUser.map((post: Record<string, any>) => {
      const borderLeftClass = borderLeftClassMap[post.activitystatus] || "";
      const hoverClass = hoverClassMap[post.activitystatus] || "";

      return (
        <tr key={post.id} className={`border-b whitespace-nowrap ${hoverClass}`}>
          {showCheckbox && (
            <td className={`px-6 py-4 text-xs ${borderLeftClass}`}>
              <input
                type="checkbox"
                checked={selectedUsers.has(post.id)}
                onChange={() => handleSelectUser(post.id)}
                className={`w-4 h-4 ${
                  bulkDeleteMode
                    ? "text-red-600"
                    : bulkEditMode
                    ? "text-blue-600"
                    : ""
                }`}
              />
            </td>
          )}
          <td className="px-6 py-4 text-xs">
            <button
              className="px-3 py-1 ml-2 text-[10px] text-white bg-blue-500 hover:bg-blue-800 hover:rounded-full rounded-md"
              onClick={() => handleEdit(post)}
            >
              Update
            </button>
          </td>
          <td className="px-6 py-4">
            <span
              className={`px-2 py-1 text-[8px] rounded-full shadow-md font-semibold ${
                statusColors[post.activitystatus as keyof typeof statusColors] ?? "bg-gray-300 text-black"
              }`}
            >
              {post.activitystatus}
            </span>
          </td>
          {displayFields.map((key) => (
            <td key={`${post.id}-${key}`} className="px-6 py-4 text-xs capitalize">
              {post[key]}
            </td>
          ))}
          <td className="px-6 py-4 text-xs">
            <strong>{post.referenceid}</strong> | {post.tsm}
          </td>
          <td className="px-6 py-4 text-xs align-top">
            <div className="flex flex-col gap-1">
              <span className="text-black bg-blue-300 p-2 rounded">
                Created: {formatDate(new Date(post.date_created).getTime())}
              </span>
            </div>
          </td>
        </tr>
      );
    });
  }, [
    updatedUser,
    selectedUsers,
    bulkDeleteMode,
    bulkEditMode,
    handleSelectUser,
    handleEdit,
    formatDate,
    statusColors
  ]);

  return (
    <table className="min-w-full table-auto">
      <thead className="bg-gray-100">
        <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
          {showCheckbox && <th className="px-6 py-4 font-semibold text-gray-700">Select</th>}
          <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
          <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
          {[
            "#", "Company", "Contact Person", "Contact Number", "Email Address", "Address", "Area",
            "Type of Client", "Project Name", "Project Category", "Project Type", "Source",
            "Target Quota", "Activity Remarks", "Ticket Reference Number", "Wrap Up", "Inquiries",
            "CSR Agent", "TSA | TSM", "Dates"
          ].map((label, i) => (
            <th key={label + i} className="px-6 py-4 font-semibold text-gray-700">{label}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {rows.length > 0 ? rows : (
          <tr>
            <td colSpan={23} className="text-center text-xs py-4">
              No accounts available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TableXchire;
