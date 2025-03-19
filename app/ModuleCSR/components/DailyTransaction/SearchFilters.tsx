"use client";

import React from "react";

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedClientType: string;
  setSelectedClientType: (clientType: string) => void;
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
  selectedClientType,
  setSelectedClientType,
  postsPerPage,
  setPostsPerPage,
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
        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        className="border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow capitalize"
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
      
      {/* Date Range Filter */}
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
      </div>
    </div>
  );
};

export default SearchFilters;