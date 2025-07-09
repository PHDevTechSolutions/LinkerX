import React from "react";

interface SearchFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    postsPerPage: number;
    setPostsPerPage: (num: number) => void;
    startDate: string;
    setStartDate: (date: string) => void;
    endDate: string;
    setEndDate: (date: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    postsPerPage,
    setPostsPerPage,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
}) => {
    return (
        <div className="flex flex-wrap gap-2 mb-4 items-center">
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLocaleLowerCase())}
                className="border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow capitalize"
            />

            <div className="flex gap-2">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border px-3 py-2 rounded text-xs"
                />
                <span className="text-xs">to</span>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border px-3 py-2 rounded text-xs"
                />
            </div>

            <select
                value={postsPerPage}
                onChange={(e) => setPostsPerPage(parseInt(e.target.value))}
                className="border px-3 py-2 rounded text-xs w-full md:w-auto"
            >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
            </select>
        </div>
    );
};

export default SearchFilters;
