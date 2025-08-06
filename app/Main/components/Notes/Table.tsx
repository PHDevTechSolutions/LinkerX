'use client';

import React from 'react';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiShare2 } from 'react-icons/fi';
import { HiOutlineQrcode } from 'react-icons/hi';

export interface LinkPost {
    _id: string;
    Email: string;
    Title: string;
    Description: string;
    PhotoUrl?: string;
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
                                                onDelete(post);
                                            }}
                                            className="text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600 border-t"
                                        >
                                            <FiTrash2 /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <p className="text-gray-600 text-sm font-bold uppercase">{post.Title}</p>

                            {/* Description */}
                            <p className="text-gray-600 text-[10px] font-bold capitalize border-t border-b mt-2 pt-1">
                                {post.Description.length > 400
                                    ? post.Description.slice(0, 400) + '...'
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
