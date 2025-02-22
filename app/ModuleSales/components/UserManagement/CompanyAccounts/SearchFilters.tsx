"use client";

import React from "react";

interface SearchFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    postsPerPage: number;
    setPostsPerPage: (num: number) => void;
    selectedClientType: string;
    setSelectedClientType: (clientType: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    postsPerPage,
    setPostsPerPage,
    selectedClientType,
    setSelectedClientType,

}) => {
    return (
        <div className="flex flex-wrap gap-2 mb-4 items-center">
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLocaleUpperCase())}
                className="border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow capitalize"
            />
            <select value={selectedClientType} onChange={(e) => setSelectedClientType(e.target.value)} className="border px-3 py-2 rounded text-xs w-full md:w-auto">
                <option value="">All Client Types</option>
                <option value="Top 50">Top 50</option>
                <option value="Next 30">Next 30</option>
                <option value="Below 20">Below 20</option>
                <option value="New Account - Client Development">New Account - Client Development</option>
                <option value="CSR Inquiries">CSR Inquiries</option>
            </select>
            <select
                value={postsPerPage}
                onChange={(e) => setPostsPerPage(parseInt(e.target.value))}
                className="border px-3 py-2 rounded text-xs w-full md:w-auto"
            >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
            </select>
        </div>
    );
};

export default SearchFilters;
