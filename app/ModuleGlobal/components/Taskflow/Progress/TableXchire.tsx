"use client";

import React, { useMemo, useCallback } from "react";
import { format } from "date-fns";

interface TableXchireProps {
  updatedUser: any[];
  bulkDeleteMode: boolean;
  bulkEditMode: boolean;
  selectedUsers: Set<string>;
  handleSelectUser: (userId: string) => void;
  handleEdit: (post: any) => void;
  totalQuotation: number;
  totalSOAmount: number;
  totalActualSales: number;
  statusColors: Record<string, string>;
}

const formatDate = (timestamp: number): string => {
  return format(timestamp, "MMM dd, yyyy");
};

const TableXchire: React.FC<TableXchireProps> = React.memo(
  ({
    updatedUser,
    bulkDeleteMode,
    bulkEditMode,
    selectedUsers,
    handleSelectUser,
    handleEdit,
    totalQuotation,
    totalSOAmount,
    totalActualSales,
    statusColors,
  }) => {
    const showCheckbox = bulkDeleteMode || bulkEditMode;

    const memoizedSelectUser = useCallback(
      (id: string) => {
        handleSelectUser(id);
      },
      [handleSelectUser]
    );

    const memoizedEdit = useCallback(
      (post: any) => {
        handleEdit(post);
      },
      [handleEdit]
    );

    const rows = useMemo(() => {
      return updatedUser.map((post) => (
        <tr key={post.id} className="border-b whitespace-nowrap">
          {showCheckbox && (
            <td className="px-6 py-4 text-xs">
              <input
                type="checkbox"
                checked={selectedUsers.has(post.id)}
                onChange={() => memoizedSelectUser(post.id)}
                className={`w-4 h-4 ${
                  bulkDeleteMode
                    ? "text-red-600"
                    : bulkEditMode
                    ? "text-blue-600"
                    : "text-purple-600"
                }`}
              />
            </td>
          )}
          <td className="px-6 py-4 text-xs">
            <button
              className="px-3 py-1 ml-2 text-[10px] text-white bg-blue-500 hover:bg-blue-800 hover:rounded-full rounded-md"
              onClick={() => memoizedEdit(post)}
            >
              Update
            </button>
          </td>
          <td className="px-6 py-4">
            <span
              className={`px-2 py-1 text-[8px] rounded-full shadow-md font-semibold ${
                statusColors[post.activitystatus as keyof typeof statusColors] ??
                "bg-gray-300 text-black"
              }`}
            >
              {post.activitystatus}
            </span>
          </td>
          <td className="px-6 py-4 text-xs uppercase">{post.companyname}</td>
          <td className="px-6 py-4 text-xs">{post.typeclient}</td>
          <td className="px-6 py-4 text-xs">{post.activitynumber}</td>
          <td className="px-6 py-4 text-xs">{post.typeactivity}</td>
          <td className="px-6 py-4 text-xs">{post.callstatus}</td>
          <td className="px-6 py-4 text-xs">{post.typecall}</td>
          <td className="px-6 py-4 text-xs capitalize">{post.remarks}</td>
          <td className="px-6 py-4 text-xs">{post.quotationnumber}</td>
          <td className="px-6 py-4 text-xs">{post.quotationamount}</td>
          <td className="px-6 py-4 text-xs">{post.sonumber}</td>
          <td className="px-6 py-4 text-xs">{post.soamount}</td>
          <td className="px-6 py-4 text-xs">{post.actualsales}</td>
          <td className="px-6 py-4 text-xs">{post.ticketreferencenumber}</td>
          <td className="px-6 py-4 text-xs">{post.wrapup}</td>
          <td className="px-6 py-4 text-xs">{post.inquiries}</td>
          <td className="px-6 py-4 text-xs">{post.csragent}</td>
          <td className="px-6 py-4 text-xs">
            <strong>{post.referenceid}</strong> | {post.tsm}
          </td>
          <td className="px-6 py-4 text-xs">{post.targetquota}</td>
          <td className="px-6 py-4 text-xs align-top">
            <div className="flex flex-col gap-1">
              <span className="text-white bg-blue-900 p-2 rounded">
                Duration: {formatDate(new Date(post.startdate).getTime())} -{" "}
                {formatDate(new Date(post.enddate).getTime())}
              </span>
              <span className="text-black bg-orange-300 p-2 rounded">
                Callback: {formatDate(new Date(post.callback).getTime())}
              </span>
              <span className="text-black bg-blue-300 p-2 rounded">
                Created: {formatDate(new Date(post.date_created).getTime())}
              </span>
              <span className="text-black bg-green-300 p-2 rounded">
                Updated: {formatDate(new Date(post.date_updated).getTime())}
              </span>
            </div>
          </td>
        </tr>
      ));
    }, [
      updatedUser,
      selectedUsers,
      showCheckbox,
      bulkDeleteMode,
      bulkEditMode,
      memoizedSelectUser,
      memoizedEdit,
      statusColors
    ]);

    return (
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
            {showCheckbox && <th className="px-6 py-4 font-semibold text-gray-700">Select</th>}
            <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Company</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Type of Client</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Activity Number</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Type of Activity</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Call Status</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Type of Call</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Remarks</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Quotation Number</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Quotation Amount</th>
            <th className="px-6 py-4 font-semibold text-gray-700">SO Number</th>
            <th className="px-6 py-4 font-semibold text-gray-700">SO Amount</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Actual Sales</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Ticket Reference Number</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Wrap Up</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Inquiries</th>
            <th className="px-6 py-4 font-semibold text-gray-700">CSR Agent</th>
            <th className="px-6 py-4 font-semibold text-gray-700">TSA | TSM</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Target Quota</th>
            <th className="px-6 py-4 font-semibold text-gray-700">Dates</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {rows.length > 0 ? (
            rows
          ) : (
            <tr>
              <td colSpan={21} className="text-center text-xs py-4">
                No accounts available
              </td>
            </tr>
          )}
        </tbody>

        <tfoot className="bg-gray-100 text-xs font-semibold">
          <tr>
            {showCheckbox && <td className="px-6 py-3 text-gray-700">Total</td>}
            <td colSpan={8} className="px-6 py-3 text-gray-700">
              Totals
            </td>
            <td className="px-6 py-3 text-gray-700">{totalQuotation.toLocaleString()}</td>
            <td></td>
            <td className="px-6 py-3 text-gray-700">{totalSOAmount.toLocaleString()}</td>
            <td className="px-6 py-3 text-gray-700">{totalActualSales.toLocaleString()}</td>
            <td colSpan={8}></td>
          </tr>
        </tfoot>
      </table>
    );
  }
);

export default TableXchire;
