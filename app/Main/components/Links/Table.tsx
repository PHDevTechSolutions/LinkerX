'use client';

import React from 'react';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiShare2 } from 'react-icons/fi';
import { HiOutlineQrcode } from 'react-icons/hi';

export interface LinkPost {
  _id: string;
  Url: string;
  Email: string;
  LinkName: string;
  Description: string;
  PhotoUrl?: string;
  Slug: string;
  Category: string;
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

const getCategoryBadgeClasses = (category: string) => {
  switch (category.toLowerCase()) {
    case 'social':
      return 'bg-violet-100 text-violet-700';
    case 'tools':
      return 'bg-blue-100 text-blue-700';
    case 'news':
      return 'bg-red-100 text-red-700';
    case 'entertainment':
      return 'bg-pink-100 text-pink-700';
    case 'education':
      return 'bg-green-100 text-green-700';
    case 'business':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

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
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(post.Url)}&size=300x300`;

    const qrWindow = window.open('', '_blank', 'width=450,height=520');
    if (qrWindow) {
      qrWindow.document.write(`
        <html>
          <head>
            <title>QR Code</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                background-color: #f3f4f6;
                font-family: Arial, sans-serif;
              }
              h2 {
                margin-bottom: 16px;
                color: #4b5563;
              }
              .qr-container {
                position: relative;
                border: 4px solid #e5e7eb;
                padding: 20px;
                border-radius: 12px;
                background-color: #ffffff;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
              }
              .qr-img {
                width: 300px;
                height: 300px;
              }
              .logo-overlay {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background-color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
              }
              .logo-overlay img {
                width: 40px;
                height: 40px;
                border-radius: 50%;
              }
              .download-btn {
                margin-top: 20px;
                padding: 10px 20px;
                background-color: #6366f1;
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 14px;
                cursor: pointer;
              }
              .download-btn:hover {
                background-color: #4f46e5;
              }
            </style>
          </head>
          <body>
            <h2>Scan this QR Code</h2>
            <div class="qr-container">
              <img id="qrCodeImg" class="qr-img" src="${qrUrl}" alt="QR Code" />
              <div class="logo-overlay">
                            <img src="/LinkerX-logo.png" className="h-6" />
              </div>
            </div>
            <button class="download-btn" onclick="downloadQR()">Download QR Code</button>

            <script>
              function downloadQR() {
                const link = document.createElement('a');
                link.href = document.getElementById('qrCodeImg').src;
                link.download = 'QRCode.png';
                link.click();
              }
            </script>
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

<p className="font-semibold text-gray-700 break-all text-[10px] mb-1">
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

{/* Slug */}
<p className="text-gray-400 text-[9px] italic mb-1">/{post.Slug}</p>

{/* Description */}
<p className="text-gray-600 text-[10px] font-bold capitalize border-t border-b mt-2 pt-1">
  {post.Description.length > 40
    ? post.Description.slice(0, 40) + '...'
    : post.Description}
</p>

{/* Category */}
<p className="text-[10px] mt-1 text-purple-600 font-semibold uppercase tracking-wide">
  {post.Category && (
  <span
    className={`inline-block mt-1 px-2 py-0.5 text-[9px] rounded-full font-semibold uppercase tracking-wide ${getCategoryBadgeClasses(post.Category)}`}
  >
    {post.Category}
  </span>
)}
</p>
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
