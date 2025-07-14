"use client";

import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
    itemsPerPage: number;
    totalItems: number;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    setCurrentPage,
    itemsPerPage,
    totalItems,
}) => {
    if (totalItems <= itemsPerPage) return null;

    return (
        <div className="flex justify-between items-center mt-4">
            <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="bg-gray-200 text-xs px-4 py-2 rounded"
            >
                Prev
            </button>
            <span className="text-xs">
                Page {currentPage} of {totalPages}
            </span>
            <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className="bg-gray-200 text-xs px-4 py-2 rounded"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
