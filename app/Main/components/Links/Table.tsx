'use client';

import React from 'react';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiShare2 } from 'react-icons/fi';
import { HiOutlineQrcode } from 'react-icons/hi';

export interface LinkPost {
  _id: string;
  Url: string;
  LinkName: string;
  Description: string;
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
}) => {
  return (
    <>
      {/* Page Length Selector */}
      <div className="flex justify-end items-center mb-3 gap-2 text-xs">
        <span>Rows per page:</span>
        <select
          value={pageLength}
          onChange={(e) => onPageLengthChange(Number(e.target.value))}
          className="border px-2 py-1 rounded"
        >
          {[5, 10, 25, 50].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {rows.length === 0 ? (
        <p className="text-center text-xs text-gray-500 py-8">No results found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rows.map((post) => (
            <div
              key={post._id}
              className="relative border rounded shadow-sm p-4 hover:bg-gray-50 transition cursor-pointer text-xs group"
            >
              {/* Action Dropdown Top Right */}
              <div className="absolute top-2 right-2 z-10">
                <div className="relative inline-block text-left">
                  <button className="px-2 py-1 bg-white text-black border rounded text-xs">
                    Actions ▾
                  </button>

                  <div className="hidden group-hover:flex absolute right-0 mt-1 flex-col bg-white border rounded shadow-md w-40 text-xs z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(post);
                      }}
                      className="text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FiEdit2 /> Update
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (navigator.share) {
                          navigator
                            .share({ title: post.LinkName, url: post.Url })
                            .catch(console.error);
                        } else {
                          toast.info('Sharing not supported on this browser.');
                        }
                      }}
                      className="text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FiShare2 /> Share
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const qrWindow = window.open('', '_blank', 'width=300,height=300');
                        if (qrWindow) {
                          qrWindow.document.write(`
                            <html>
                              <head><title>QR Code</title></head>
                              <body style="display:flex;justify-content:center;align-items:center;height:100vh;margin:0;">
                                <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                            post.Url
                          )}&size=200x200" />
                              </body>
                            </html>
                          `);
                        }
                      }}
                      className="text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <HiOutlineQrcode /> QR Code
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(post);
                      }}
                      className="text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600 border-t"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Image */}
              {post.PhotoUrl ? (
                <img
                  src={post.PhotoUrl || '/xchire-logo.png'}
                  alt={post.LinkName}
                  className="w-full h-32 object-contain rounded mb-2 bg-white"
                />

              ) : (
                <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-gray-400 mb-2 rounded">
                  No Image
                </div>
              )}

              {/* Info */}
              <p className="text-gray-600 text-sm font-bold uppercase">{post.LinkName}</p>
              <p className="font-semibold text-gray-700 break-all mb-1 text-[10px]">
                <a
                  href={post.Url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[#5e17eb] hover:underline"
                >
                  {post.Url}
                </a>
              </p>
              <p className="text-gray-600 text-[10px] font-bold capitalize border-t mt-2">{post.Description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-xs">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default Table;
