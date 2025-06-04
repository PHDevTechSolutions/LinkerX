import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const goToPage = (page: number) => {
    if (page < 1) page = 1;
    else if (page > totalPages) page = totalPages;
    onPageChange(page);
  };

  return (
    <div className="flex justify-between items-center mt-4 text-xs text-gray-600">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="bg-gray-200 px-4 py-2 rounded"
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages || 1}
      </span>
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
        className="bg-gray-200 px-4 py-2 rounded"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
