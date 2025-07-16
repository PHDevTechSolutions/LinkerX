"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  lastSync: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  lastSync,
}) => {
  return (
    <div>
      <p className="text-xs mt-4 mb-4 text-gray-500">Last synced: {lastSync}</p>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-200 text-xs px-4 py-2 rounded"
        >
          Prev
        </button>
        <span className="text-xs">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-gray-200 text-xs px-4 py-2 rounded"
        >
          Next
        </button>
      </div></div>
  );
};

export default Pagination;
