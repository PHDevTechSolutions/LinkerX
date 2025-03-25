"use client";

import React from "react";

interface SearchFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedCityAddress: string;
    setSelectedCityAddress: (city: string) => void;
    postsPerPage: number;
    setPostsPerPage: (num: number) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    selectedCityAddress,
    setSelectedCityAddress,
    postsPerPage,
    setPostsPerPage,
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
            <input
                type="text"
                placeholder="Filter by City Address"
                value={selectedCityAddress}
                onChange={(e) => setSelectedCityAddress(e.target.value)}
                className="border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow"
            />
            <select
                value={postsPerPage}
                onChange={(e) => setPostsPerPage(parseInt(e.target.value))}
                className="border px-3 py-2 rounded text-xs w-full md:w-auto"
            >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
                <option value={500}>500</option>
                <option value={1000}>1000</option>
                <option value={5000}>5000</option>
            </select>
        </div>
    );
};

export default SearchFilters;
