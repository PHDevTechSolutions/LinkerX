'use client';

import React from 'react';

export interface LinkPost {
  _id: string;
  Url: string;
  LinkName: string;
  PhotoUrl?: string;
}

interface TableProps {
  rows: LinkPost[];
  totalPages: number;
  currentPage: number;
  pageLength: number;
  onPageChange: (page: number) => void;
  onPageLengthChange: (len: number) => void;
  onEdit: (row: LinkPost) => void;
  onDelete: (row: LinkPost) => void;
}

const Table: React.FC<TableProps> = ({
  rows,
  totalPages,
  currentPage,
  pageLength,
  onPageChange,
  onPageLengthChange,
  onEdit,
  onDelete,
}) => (
  <>
    {/* Page‑length selector */}
    <div className="flex justify-end items-center mb-3 gap-2 text-xs">
      <span>Rows per page:</span>
      <select
        value={pageLength}
        onChange={(e) => onPageLengthChange(Number(e.target.value))}
        className="border px-2 py-1 rounded"
      >
        {[5, 10, 25, 50].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </div>

    {rows.length === 0 ? (
      <p className="text-center text-gray-500 py-8">No results found</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr className="text-xs text-left whitespace-nowrap">
              <th className="px-6 py-4 font-semibold text-gray-700 w-24">Photo</th>
              <th className="px-6 py-4 font-semibold text-gray-700">URL</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Link Name</th>
              <th className="px-6 py-4 font-semibold text-gray-700 w-36">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((post) => (
              <tr key={post._id} className="border-t align-middle">
                <td className="px-6 py-4 text-[10px]">
                  {post.PhotoUrl ? (
                    <img src={post.PhotoUrl} alt={post.LinkName} className="w-20 h-10 object-cover rounded" />
                  ) : (
                    <div className="w-20 h-10 bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-xs">
                  <a href={post.Url} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline">
                    {post.Url}
                  </a>
                </td>
                <td className="px-6 py-4 text-xs">{post.LinkName}</td>
                <td className="px-6 py-4 text-xs">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(post)}
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => onDelete(post)}
                      className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-500 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {totalPages > 1 && (
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="bg-gray-200 text-xs px-4 py-2 rounded"
        >
          Prev
        </button>
        <span className="text-xs">{currentPage} / {totalPages}</span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="bg-gray-200 text-xs px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    )}
  </>
);

export default Table;
