"use client";

import React from "react";

interface MediaItem {
  asset_id: string;
  public_id: string;
  format: string;
  bytes: number;
  created_at: string;
  secure_url: string;
}

interface TableProps {
  mediaItems: MediaItem[];
  confirmDelete: (item: MediaItem) => void;
}

// helper: format bytes -> Bytes / KB / MB
const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

const Table: React.FC<TableProps> = ({ mediaItems, confirmDelete }) => {
  const totalBytes = mediaItems.reduce((sum, m) => sum + m.bytes, 0);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-200 sticky top-0 z-10 text-xs text-left whitespace-nowrap border-l-4 border-orange-400">
          <tr>
            <th className="px-3 py-3 font-semibold text-gray-700">Preview</th>
            <th className="px-3 py-3 font-semibold text-gray-700">Public ID</th>
            <th className="px-3 py-3 font-semibold text-gray-700">Format</th>
            <th className="px-3 py-3 font-semibold text-gray-700">Size</th>
            <th className="px-3 py-3 font-semibold text-gray-700">Created At</th>
            <th className="px-3 py-3 font-semibold text-gray-700">Link</th>
            <th className="px-3 py-3 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {mediaItems.map((item) => (
            <tr
              key={item.asset_id}
              className="border-b whitespace-nowrap hover:bg-gray-100"
            >
              <td className="px-4 py-2 text-xs">
                <img
                  src={item.secure_url}
                  alt={item.public_id}
                  className="h-16 w-16 object-cover rounded"
                />
              </td>
              <td className="px-4 py-2 text-xs break-all">{item.public_id}</td>
              <td className="px-4 py-2 text-xs uppercase">{item.format}</td>
              <td className="px-4 py-2 text-xs">{formatSize(item.bytes)}</td>
              <td className="px-4 py-2 text-xs">
                {new Date(item.created_at).toLocaleString()}
              </td>
              <td className="px-4 py-2 text-xs break-all">
                <a
                  href={item.secure_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Preview Image
                </a>
              </td>
              <td className="px-4 py-2 text-xs">
                <button
                  onClick={() => confirmDelete(item)}
                  className="px-3 py-1 ml-2 text-[10px] text-white bg-red-500 hover:bg-red-800 hover:rounded-full rounded-md"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot className="bg-gray-50 text-xs font-semibold">
          <tr>
            <td colSpan={4} className="px-4 py-2">
              Total items: {mediaItems.length}
            </td>
            <td className="px-4 py-2">{formatSize(totalBytes)}</td>
            <td colSpan={2}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Table;
