import React, { useMemo, memo, useCallback } from "react";
import { CiEdit } from "react-icons/ci";

interface TableXchireProps {
  updatedUser: any[];
  handleSelectUser: (userId: string) => void;
  selectedUsers: Set<string>;
  bulkEditMode: boolean;
  bulkChangeMode: boolean;
  bulkEditStatusMode: boolean;
  bulkRemoveMode: boolean;
  Role: string;
  handleEdit: (post: any) => void;
  formatDate: (timestamp: number) => string;
}

const getRowStyle = (status: string) => {
  switch (status) {
    case "Active":
      return { border: "border-l-4 border-green-400", hover: "hover:bg-green-100 hover:text-green-900" };
    case "Used":
      return { border: "border-l-4 border-blue-400", hover: "hover:bg-blue-100 hover:text-blue-900" };
    case "On Hold":
      return { border: "border-l-4 border-yellow-400", hover: "hover:bg-yellow-100 hover:text-yellow-900" };
    default:
      return { border: "", hover: "" };
  }
};

const TableRow = memo(({
  post,
  Role,
  selected,
  handleEdit,
  handleCheckboxChange,
  formatDate,
  showCheckbox,
}: {
  post: any;
  Role: string;
  selected: boolean;
  handleEdit: (post: any) => void;
  handleCheckboxChange: () => void;
  formatDate: (timestamp: number) => string;
  showCheckbox: boolean;
}) => {
  const { border, hover } = getRowStyle(post.status);

  return (
    <tr
      key={post.id}
      className={`border-b whitespace-nowrap cursor-pointer ${hover}`}
      onClick={() => handleEdit(post)}
    >
      <td
        className={`px-6 py-4 text-xs ${border}`}
        onClick={(e) => e.stopPropagation()}
      >
        {showCheckbox && (
          <input
            type="checkbox"
            checked={selected}
            onChange={handleCheckboxChange}
            className="w-4 h-4"
          />
        )}
      </td>

      {Role !== "Special Access" && (
        <td
          className="px-6 py-4 text-xs"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="block px-4 py-2 text-[10px] font-bold text-black bg-blue-300 rounded-lg hover:bg-orange-300 hover:rounded-full hover:shadow-md w-full text-left flex items-center gap-1"
            onClick={() => handleEdit(post)}
          >
            <CiEdit /> Edit
          </button>
        </td>
      )}

      <td className="px-6 py-4 text-xs uppercase">{post.remarks}</td>
      <td className="px-6 py-4 text-xs uppercase">{post.companyname}</td>
      <td className="px-6 py-4 text-xs capitalize">{post.contactperson}</td>
      <td className="px-6 py-4 text-xs capitalize">{post.contactnumber}</td>
      <td className="px-6 py-4 text-xs">{post.emailaddress}</td>
      <td className="px-6 py-4 text-xs">{post.typeclient}</td>
      <td className="px-6 py-4 text-xs capitalize">{post.address}</td>
      <td className="px-6 py-4 text-xs capitalize">{post.deliveryaddress}</td>
      <td className="px-6 py-4 text-xs capitalize">{post.area}</td>
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
});

const TableXchire: React.FC<TableXchireProps> = ({
  updatedUser,
  handleSelectUser,
  selectedUsers,
  bulkEditMode,
  bulkChangeMode,
  bulkEditStatusMode,
  bulkRemoveMode,
  Role,
  handleEdit,
  formatDate,
}) => {
  const showCheckbox = bulkEditMode || bulkChangeMode || bulkEditStatusMode || bulkRemoveMode;

  const tableRows = useMemo(
    () =>
      updatedUser.map((post) => (
        <TableRow
          key={post.id}
          post={post}
          Role={Role}
          selected={selectedUsers.has(post.id)}
          handleEdit={handleEdit}
          handleCheckboxChange={() => handleSelectUser(post.id)}
          formatDate={formatDate}
          showCheckbox={showCheckbox}
        />
      )),
    [updatedUser, Role, selectedUsers, handleEdit, handleSelectUser, formatDate, showCheckbox]
  );

  return (
    <table className="min-w-full table-auto">
      <thead className="bg-gray-100">
        <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
          <th className="px-6 py-4 font-semibold text-gray-700"></th>
          {Role !== "Special Access" && (
            <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
          )}
          <th className="px-6 py-4 font-semibold text-gray-700">Remarks / Reason</th>
          <th className="px-6 py-4 font-semibold text-gray-700">Company Name</th>
          <th className="px-6 py-4 font-semibold text-gray-700">Contact Person</th>
          <th className="px-6 py-4 font-semibold text-gray-700">Contact Number</th>
          <th className="px-6 py-4 font-semibold text-gray-700">Email Address</th>
          <th className="px-6 py-4 font-semibold text-gray-700">Type of Client</th>
          <th className="px-6 py-4 font-semibold text-gray-700">Complete Address</th>
          <th className="px-6 py-4 font-semibold text-gray-700">Delivery Address</th>
          <th className="px-6 py-4 font-semibold text-gray-700">Area</th>
          <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {updatedUser.length > 0 ? (
          tableRows
        ) : (
          <tr>
            <td colSpan={Role !== "Special Access" ? 12 : 11} className="text-center text-xs py-4 text-gray-500">
              No record available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TableXchire;
