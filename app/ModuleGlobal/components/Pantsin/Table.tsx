"use client";

import React from "react";

interface Order {
  _id: string;
  ReferenceID: string;
  Email: string;
  Type: string;
  Status: string;
  date_created: string;
}

interface TableProps {
  paginated: Order[];
  selectedIds: Set<string>;
  toggleSelectAll: () => void;
  toggleSelect: (id: string) => void;
  startEdit: (order: Order) => void;
  confirmDelete: (order: Order) => void;
  handleBulkDelete: () => void;
  loading: boolean;
}

const formatDuration = (ms: number) => {
  const secs = Math.floor(ms / 1000);
  const mins = Math.floor(secs / 60);
  const hrs = Math.floor(mins / 60);
  if (hrs) return `${hrs}h ${mins % 60}m`;
  if (mins) return `${mins}m`;
  return `${secs}s`;
};

const getLateOrOT = (dateISO: string) => {
  const d = new Date(dateISO);
  const y = d.getFullYear();
  const m = d.getMonth();
  const day = d.getDate();

  const startRef = new Date(y, m, day, 8, 0, 0);     // 08:00
  const endRef   = new Date(y, m, day, 17, 20, 0);    // 17:20

  if (d > endRef) {
    return `OT ${formatDuration(d.getTime() - endRef.getTime())}`;
  }
  if (d > startRef) {
    return `Late ${formatDuration(d.getTime() - startRef.getTime())}`;
  }
  return "—";
};

const Table: React.FC<TableProps> = ({
  paginated,
  selectedIds,
  toggleSelectAll,
  toggleSelect,
  startEdit,
  confirmDelete,
  handleBulkDelete,
  loading,
}) => {
  if (loading)
    return <p className="text-center py-8 text-xs">Loading…</p>;

  if (paginated.length === 0)
    return <p className="text-center py-8 text-xs">No records found.</p>;

  return (
    <div className="overflow-x-auto">
      <button
        disabled={selectedIds.size === 0}
        onClick={handleBulkDelete}
        className={`mb-3 px-3 py-1 rounded text-white text-xs ${
          selectedIds.size === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700"
        }`}
      >
        Delete Selected ({selectedIds.size})
      </button>

      <table className="min-w-full table-auto">
        <thead className="bg-gray-200 sticky top-0 z-10">
          <tr className="text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
            <th className="px-3 py-3 font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={
                  paginated.length > 0 &&
                  paginated.every((o) => selectedIds.has(o._id))
                }
                onChange={toggleSelectAll}
              />
            </th>
            <th className="px-4 py-3 font-semibold text-gray-700">Ref ID</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Type</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Date</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Late / OT</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {paginated.map((o) => (
            <tr key={o._id} className="border-b whitespace-nowrap hover:bg-gray-100">
              <td className="px-4 py-2 text-xs">
                <input
                  type="checkbox"
                  checked={selectedIds.has(o._id)}
                  onChange={() => toggleSelect(o._id)}
                />
              </td>
              <td className="px-4 py-2 text-xs">{o.ReferenceID}</td>
              <td className="px-4 py-2 text-xs">{o.Email}</td>
              <td className="px-4 py-2 text-xs">{o.Type}</td>
              <td className="px-4 py-2 text-xs">{o.Status}</td>
              <td className="px-4 py-2 text-xs">{new Date(o.date_created).toLocaleString()}</td>
              <td className="px-4 py-2 text-xs">{getLateOrOT(o.date_created)}</td>
              <td className="px-4 py-2 text-xs">
                <button
                  onClick={() => startEdit(o)}
                  className="px-3 py-1 ml-2 text-[10px] text-white bg-blue-500 hover:bg-blue-800 hover:rounded-full rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(o)}
                  className="px-3 py-1 ml-2 text-[10px] text-white bg-red-500 hover:bg-red-800 hover:rounded-full rounded-md"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
