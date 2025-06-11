"use client";

import React, { useState } from "react";

// SearchFilters Component
interface SearchFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    postsPerPage: number;
    setPostsPerPage: (num: number) => void;
    selectedClientType: string;
    setSelectedClientType: (clientType: string) => void;
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
    selectedClientType,
    setSelectedClientType,
    startDate,
    setStartDate,
    endDate,
    setEndDate
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
            <select
                value={selectedClientType}
                onChange={(e) => setSelectedClientType(e.target.value)}
                className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto"
            >
                <option value="">All Client Types</option>
                <option value="null">No Data</option> {/* Updated for null */}
                <option value="Top 50">Top 50</option>
                <option value="Next 30">Next 30</option>
                <option value="Balance 20">Balance 20</option>
                <option value="New Account - Client Development">New Account - Client Development</option>
            </select>
            <div className="flex gap-2">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border px-3 py-2 rounded text-xs"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border px-3 py-2 rounded text-xs"
                />
                <select
                    value={postsPerPage}
                    onChange={(e) => setPostsPerPage(parseInt(e.target.value))}
                    className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                    <option value={500}>500</option>
                    <option value={1000}>1000</option>
                </select>
            </div>
        </div>
    );
};

export default SearchFilters;