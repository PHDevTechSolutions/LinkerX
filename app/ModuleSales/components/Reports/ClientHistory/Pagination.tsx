import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, goToPage }) => {
  return (
    <div className="flex justify-between items-center mt-4 text-xs text-gray-600">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`bg-gray-200 text-xs px-4 py-2 rounded ${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
        }`}
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages || 1}
      </span>
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
        className={`bg-gray-200 text-xs px-4 py-2 rounded ${
          currentPage === totalPages || totalPages === 0
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-300"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
