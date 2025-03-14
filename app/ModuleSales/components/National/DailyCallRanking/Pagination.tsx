"use client";
import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, setCurrentPage }) => {
    if (totalPages < 1) return null; // Hide pagination if there are no pages

    return (
        <div className="flex justify-center items-center gap-2 mt-4 text-xs">
            {/* First Page */}
            <button
                className="bg-gray-200 px-3 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
            >
                «
            </button>

            {/* Previous Page */}
            <button
                className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Previous
            </button>

            {/* Page Indicator */}
            <span className="px-4">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>

            {/* Next Page */}
            <button
                className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
            >
                Next
            </button>

            {/* Last Page */}
            <button
                className="bg-gray-200 px-3 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
            >
                »
            </button>
        </div>
    );
};

export default Pagination;
