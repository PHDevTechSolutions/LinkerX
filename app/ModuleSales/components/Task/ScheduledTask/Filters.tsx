"use client";

import React from "react";

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value.toLocaleUpperCase())}
        className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto flex-grow capitalize"
      />
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="shadow-sm border px-3 py-2 rounded text-xs w-full md:w-auto"
      />

      {(searchTerm || startDate || endDate) && (
        <button
          onClick={() => {
            setSearchTerm("");
            setStartDate("");
            setEndDate("");
          }}
          className="text-xs bg-gray-100 px-3 py-2 rounded hover:bg-gray-200"
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default SearchFilters;
