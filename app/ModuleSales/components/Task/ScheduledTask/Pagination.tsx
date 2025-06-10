import React from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

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
      <div className="flex items-center space-x-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50 flex items-center"
        >
          <MdNavigateBefore size={15} /> Previous
        </button>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50 flex items-center"
        >
           Next <MdNavigateNext size={15} />
        </button>
        <span className="ml-2">
          Page {currentPage} of {totalPages || 1}
        </span>
      </div>
  );
};

export default Pagination;
