"use client";

import React, { useState } from "react";

// SearchFilters Component
interface SearchFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
    searchTerm,
    setSearchTerm,
}) => {

    return (
        <div className="flex flex-wrap gap-2 mb-4 items-center">
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLocaleUpperCase())}
                className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow capitalize"
            />
        </div>
    );
};

export default SearchFilters;