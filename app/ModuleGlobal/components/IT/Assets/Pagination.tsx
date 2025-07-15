"use client";

import React from "react";

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    totalPages,
    currentPage,
    onPageChange,
}) => {
    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <div className="flex justify-between items-center mt-4">
            <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="bg-gray-200 text-xs px-4 py-2 rounded"
            >
                Prev
            </button>

            <span className="text-xs">
                Page {currentPage} of {totalPages}
            </span>
            
            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="bg-gray-200 text-xs px-4 py-2 rounded"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
