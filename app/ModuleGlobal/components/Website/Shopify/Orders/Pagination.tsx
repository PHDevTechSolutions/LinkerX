interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showingCount: number;
    totalCount: number;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    showingCount,
    totalCount,
}) => {
    return (
        <div className="flex justify-between items-center mt-4">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="bg-gray-200 text-xs px-4 py-2 rounded"
            >
                Prev
            </button>
            <span className="text-xs">
                Page {currentPage} of {totalPages}
            </span>
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="bg-gray-200 text-xs px-4 py-2 rounded"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
